/* UTI Check — integração privada com API/PostgreSQL.
   Não lê nem grava dados clínicos no localStorage. */
(()=>{
'use strict';
const $=id=>document.getElementById(id);
let csrf=null, user=null, saveQueue=Promise.resolve(), saving=false;
const api=async(path,opts={})=>{
 const method=(opts.method||'GET').toUpperCase();
 const headers={'Accept':'application/json',...(opts.headers||{})};
 if(opts.body!==undefined){headers['Content-Type']='application/json';}
 if(!['GET','HEAD','OPTIONS'].includes(method)){
  if(!csrf) throw new Error('Sessão sem token de proteção. Entre novamente.');
  headers['X-CSRF-Token']=csrf;
 }
 const res=await fetch('./api'+path,{method,credentials:'same-origin',headers,body:opts.body===undefined?undefined:JSON.stringify(opts.body),cache:'no-store'});
 let data={};try{data=await res.json()}catch{}
 if(!res.ok){if(res.status===401){showLogin('Sessão expirada. Entre novamente.');}throw new Error(data.error||('Falha HTTP '+res.status));}
 return data;
};
const showLogin=(msg='')=>{
 ['home','editor','evolution'].forEach(id=>$(id)?.classList.add('hidden'));
 let el=$('utiLogin'); if(!el){el=document.createElement('section');el.id='utiLogin';el.className='card';el.style.cssText='max-width:420px;margin:10vh auto;padding:24px';
 el.innerHTML='<h2>Acesso ao UTI Check</h2><p class="muted">Entre com sua conta autorizada.</p><form id="utiLoginForm"><div class="field"><label>Usuário</label><input id="utiUser" autocomplete="username" required maxlength="80"></div><div class="field" style="margin-top:12px"><label>Senha</label><input id="utiPass" type="password" autocomplete="current-password" required maxlength="200"></div><p id="utiLoginError" class="warning" role="alert"></p><button class="btn" style="width:100%;margin-top:10px" type="submit">Entrar</button></form>';
 document.querySelector('main.wrap').prepend(el);
 }
 el.classList.remove('hidden');$('utiLoginError').textContent=msg;
};
const hideLogin=()=>{$('utiLogin')?.classList.add('hidden');};
const installLogout=()=>{
 let b=$('utiLogout');
 if(!b){b=document.createElement('button');b.id='utiLogout';b.className='btn secondary';b.type='button';b.textContent='Sair';b.style.cssText='position:absolute;right:14px;top:14px';document.querySelector('header')?.appendChild(b);}
 b.classList.remove('hidden');
 b.onclick=async()=>{try{await api('/auth/logout',{method:'POST',body:{}});}catch(e){console.warn(e);}csrf=null;user=null;showLogin('Sessão encerrada.');};
};
const loadCsrf=async()=>{const d=await api('/auth/csrf');csrf=d.csrfToken||d.csrf||d.token;if(!csrf)throw new Error('O servidor não retornou o token CSRF esperado.');};
const permanent=f=>{const x={...f};delete x.bed;return x;};
const formFrom=row=>({...((row&&row.permanent_data)||{}),bed:String(row.bed_no).padStart(2,'0'),identifier:row.initials||''});
const loadBeds=async()=>{
 const d=await api('/clinical/beds');
 const beds=d.beds||[];
 const patients=[];
 for(const b of beds){
  if(!b.stay_id)continue;
  const hist=await api('/patients/'+encodeURIComponent(b.stay_id)+'/evolutions');
  const all=hist.evolutions||[];
  let activeEvolution=all.filter(e=>!e.archived_at).sort((a,b)=>new Date(b.started_at||b.created_at)-new Date(a.started_at||a.created_at))[0];
  if(!activeEvolution){
   const made=await api('/patients/'+encodeURIComponent(b.stay_id)+'/evolutions',{method:'POST',body:{content:{answers:{}}}});
   activeEvolution=made.evolution;
  }
  const content=activeEvolution.content||{};
  const f=formFrom(b);
  const history=all.filter(e=>e.archived_at).map(e=>({id:e.id,archivedAt:e.archived_at,label:'Evolução arquivada',text:e.content?.generated_text||'(Evolução preservada no banco; texto não disponível nesta versão)',form:e.content?.form||{},answers:e.content?.answers||{}}));
  patients.push({id:b.stay_id,bedNo:String(b.bed_no).padStart(2,'0'),f,answers:content.answers||{},history,cycleStartedAt:activeEvolution.started_at||activeEvolution.created_at,cycleId:activeEvolution.id,archivedCycleId:null,evolutionId:activeEvolution.id});
 }
 db={patients};
 renderHome();
};
const capture=()=>{
 if(!cur)return;
 document.querySelectorAll('[data-f]').forEach(el=>cur.f[el.dataset.f]=el.value);
 document.querySelectorAll('[data-a]').forEach(el=>{
  if(el.type==='checkbox'){let arr=cur.answers[el.dataset.a]||[];if(el.checked&&!arr.includes(el.value))arr.push(el.value);if(!el.checked)arr=arr.filter(x=>x!==el.value);cur.answers[el.dataset.a]=arr;}
  else cur.answers[el.dataset.a]=el.value;
 });
 cur.f.bed=cur.bedNo;
};
const enqueueSave=()=>{
 if(!cur||!cur.evolutionId)return;
 const snapshot={id:cur.id,evolutionId:cur.evolutionId,bedNo:cur.bedNo,f:{...cur.f},answers:JSON.parse(JSON.stringify(cur.answers||{})),generatedText:cur.generatedText||''};
 saveQueue=saveQueue.then(async()=>{
  await api('/patients/'+encodeURIComponent(snapshot.id),{method:'PATCH',body:{initials:String(snapshot.f.identifier||('LEITO-'+snapshot.bedNo)).slice(0,20),permanent_data:permanent(snapshot.f)}});
  await api('/evolutions/'+encodeURIComponent(snapshot.evolutionId),{method:'PATCH',body:{content:{answers:snapshot.answers,form:snapshot.f,generated_text:snapshot.generatedText}}});
 }).catch(err=>{console.error(err);alert('Não foi possível salvar no servidor: '+err.message);});
 return saveQueue;
};
window.persist=()=>{}; // bloqueia gravação clínica em localStorage
window.save=()=>{if(!cur)return;capture();$('patientTitle').textContent='Leito '+cur.bedNo;updateProgress();clearTimeout(window.__utiSaveTimer);window.__utiSaveTimer=setTimeout(enqueueSave,700);};
window.renderHome=()=>{
 $('count').textContent=db.patients.length+' / 10 ocupados';
 $('patients').innerHTML='';
 for(let i=1;i<=10;i++){
  const n=String(i).padStart(2,'0'),p=db.patients.find(x=>x.bedNo===n),el=document.createElement('div');el.className='card';
  if(!p){el.innerHTML='<div class="patient"><div><strong>Leito '+n+' · Livre</strong><div class="meta">Nenhuma internação ativa</div></div><button class="btn secondary" type="button">Ocupar leito</button></div>';el.querySelector('button').addEventListener('click',()=>newPatient(n));}
  else{const age=(Date.now()-new Date(p.cycleStartedAt||Date.now()).getTime())/3600000;const status=age>=24?'Ciclo de 24h atingido':'Em preenchimento';
   el.innerHTML='<div class="patient"><div><strong>Leito '+n+' · '+esc(p.f.identifier||'Paciente')+'</strong><div class="meta">'+esc(p.f.diagnosis||'Diagnóstico não informado')+' · '+status+'</div><div class="meta">Histórico: '+p.history.length+' evolução(ões)</div></div><button class="btn secondary open" type="button">Abrir leito</button></div><div class="toolbar"><button class="btn secondary hist" type="button">Ver histórico</button><button class="btn danger discharge" type="button">Encerrar internação</button></div>';
   el.querySelector('.open').addEventListener('click',()=>openPatient(p.id));el.querySelector('.hist').addEventListener('click',()=>showHistory(p.id));el.querySelector('.discharge').addEventListener('click',()=>closeStay(p.id));
  }
  $('patients').appendChild(el);
 }
};
window.newPatient=async bedNo=>{
 const used=new Set(db.patients.map(p=>p.bedNo));const n=bedNo||Array.from({length:10},(_,i)=>String(i+1).padStart(2,'0')).find(x=>!used.has(x));
 if(!n||used.has(n)){alert('Os dez leitos estão ocupados.');return;}
 const identifier=prompt('Informe um código ou iniciais não nominais (não use nome completo):','LEITO-'+n);if(identifier===null)return;
 try{
  const d=await api('/patients',{method:'POST',body:{bed_no:Number(n),initials:String(identifier).trim().slice(0,20)||('LEITO-'+n),permanent_data:{}}});
  const p=d.patient;
  const e=await api('/patients/'+encodeURIComponent(p.id)+'/evolutions',{method:'POST',body:{content:{answers:{}}}});
  const rec={id:p.id,bedNo:String(p.bed_no).padStart(2,'0'),f:formFrom(p),answers:{},history:[],cycleStartedAt:e.evolution.started_at||e.evolution.created_at,cycleId:e.evolution.id,evolutionId:e.evolution.id};
  db.patients.push(rec);openPatient(rec.id);
 }catch(err){alert(err.message);}
};
window.openPatient=id=>{
 cur=db.patients.find(p=>p.id===id);if(!cur)return;
 $('home').classList.add('hidden');$('evolution').classList.add('hidden');$('editor').classList.remove('hidden');
 document.querySelectorAll('[data-f]').forEach(el=>el.value=cur.f[el.dataset.f]??'');
 active=0;renderTabs();renderStage();updateProgress();$('patientTitle').textContent='Leito '+cur.bedNo;
};
window.showHistory=async id=>{
 const p=db.patients.find(x=>x.id===id);if(!p)return;
 let w=window.open('','_blank');
 if(!w){alert('Permita a abertura de janelas para visualizar o histórico.');return;}
 w.document.write('<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Histórico de evoluções</title></head><body style="font:15px Arial;padding:18px">Carregando todas as evoluções...</body></html>');
 try{
  const d=await api('/patients/'+encodeURIComponent(id)+'/evolutions');
  const evs=(d.evolutions||[]).slice().sort((a,b)=>new Date(a.created_at||a.started_at||0)-new Date(b.created_at||b.started_at||0));
  const escHtml=value=>String(value??'').replace(/[&<>"]/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[ch]));
  const cards=evs.map((e,i)=>{
   const stamp=e.created_at||e.started_at||e.archived_at;
   const body=e.content?.generated_text||'Texto da evolução ainda não foi gerado.';
   const status=e.archived_at?'Arquivada':(String(body).startsWith('EVOLUÇÃO PROVISÓRIA')?'Provisória':'Em andamento');
   return '<article><header><b>EVOLUÇÃO '+String(i+1).padStart(2,'0')+'</b> · '+escHtml(stamp?new Date(stamp).toLocaleString('pt-BR'):'Data não informada')+' · '+status+'</header><pre>'+escHtml(body)+'</pre></article>';
  }).join('');
  w.document.open();
  w.document.write('<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Histórico — Leito '+escHtml(p.bedNo)+'</title><style>*{box-sizing:border-box}body{font:14px/1.5 -apple-system,BlinkMacSystemFont,Arial,sans-serif;color:#172536;margin:0;padding:20px;background:#f3f6f9}.toolbar{position:sticky;top:0;background:#10283d;padding:12px;text-align:right}.toolbar button{border:0;border-radius:8px;padding:11px 16px;background:#e5eef7;color:#123b5e;font-weight:700}main{max-width:900px;margin:20px auto}h1{font-size:22px}article{background:#fff;border:1px solid #d9e2ec;border-radius:10px;padding:16px;margin:14px 0;break-inside:auto}article header{position:static;background:transparent;color:#425466;padding:0 0 10px;border-bottom:1px solid #e3eaf1;margin-bottom:10px;font-size:12px}pre{white-space:pre-wrap;overflow-wrap:anywhere;font:12px/1.5 -apple-system,BlinkMacSystemFont,Arial,sans-serif;margin:0}.empty{background:white;padding:18px;border-radius:10px}@page{margin:14mm}@media print{body{background:white;padding:0}.toolbar{display:none}main{margin:0}article{box-shadow:none}}</style></head><body><div class="toolbar"><button id="printAll" type="button">Imprimir / Salvar todas em PDF</button></div><main><h1>Histórico de evoluções — Leito '+escHtml(p.bedNo)+' · '+escHtml(p.f.identifier||'Paciente')+'</h1><p>'+evs.length+' evolução(ões), da mais antiga para a mais recente.</p>'+(cards||'<p class="empty">Nenhuma evolução registrada.</p>')+'</main></body></html>');
  w.document.close();
  w.document.getElementById('printAll')?.addEventListener('click',()=>{w.focus();w.print();});
 }catch(err){w.document.body.textContent='Não foi possível carregar o histórico: '+err.message;}
};
window.closeStay=async id=>{
 const p=db.patients.find(x=>x.id===id);if(!p||!confirm('Registrar alta hospitalar e liberar este leito?'))return;
 try{await api('/patients/'+encodeURIComponent(id)+'/discharge',{method:'POST',body:{}});db.patients=db.patients.filter(x=>x.id!==id);cur=null;home();}catch(err){alert(err.message);}
};
window.deletePatient=()=>{if(cur)closeStay(cur.id);};
window.startNewEvolution=async()=>{
 if(!cur)return;
 clearTimeout(window.__utiSaveTimer);
 capture();
 cur.generatedText=buildEvolution();
 clearTimeout(window.__utiSaveTimer);
 await enqueueSave();
 clearTimeout(window.__utiSaveTimer);
 if(!confirm('Arquivar a evolução atual e iniciar um novo ciclo de 24 horas?'))return;
 try{
  await api('/evolutions/'+encodeURIComponent(cur.evolutionId)+'/archive',{method:'POST',body:{}});
  const d=await api('/patients/'+encodeURIComponent(cur.id)+'/evolutions',{method:'POST',body:{content:{answers:{}}}});
  cur.history.push({id:cur.evolutionId,archivedAt:d.evolution.started_at||new Date().toISOString(),label:'Evolução diária',text:buildEvolution()});
  cur.answers={};cur.evolutionId=d.evolution.id;cur.cycleId=d.evolution.id;cur.cycleStartedAt=d.evolution.started_at||d.evolution.created_at;
  active=0;renderTabs();renderStage();updateProgress();alert('Novo ciclo iniciado e registrado no servidor.');
 }catch(err){alert(err.message);}
};
window.archiveEvolution=async()=>{
 if(!cur)return;capture();cur.generatedText=buildEvolution();await enqueueSave();
 if(!confirm('Arquivar esta evolução no histórico do servidor?'))return;
 try{await api('/evolutions/'+encodeURIComponent(cur.evolutionId)+'/archive',{method:'POST',body:{}});alert('Evolução arquivada no PostgreSQL.');await loadBeds();home();}
 catch(err){alert(err.message);}
};
window.showEvolution=()=>{capture();cur.generatedText=buildEvolution();enqueueSave();$('evolutionStatus').textContent='Rascunho';$('evolutionWarning').textContent='Revise todos os campos, corrija omissões e valide os dados no prontuário antes de assinar. O texto não representa decisão clínica automatizada.';$('archiveEvolutionBtn').classList.remove('hidden');$('editor').classList.add('hidden');$('home').classList.add('hidden');$('evolution').classList.remove('hidden');$('evolutionText').textContent=buildEvolution();window.scrollTo(0,0);};
window.showProvisionalEvolution=async()=>{if(!cur)return;clearTimeout(window.__utiSaveTimer);capture();const body=buildEvolution();clearTimeout(window.__utiSaveTimer);cur.generatedText='EVOLUÇÃO PROVISÓRIA — PARA PASSAGEM DE CASO — NÃO FINALIZADA\n\n'+body;await enqueueSave();$('evolutionStatus').textContent='PROVISÓRIA';$('evolutionWarning').textContent='Documento provisório para passagem de caso. A visita permanece aberta; esta visualização não conclui, não arquiva e não substitui a evolução médica final. Confira os dados e complete a visita depois.';$('archiveEvolutionBtn').classList.add('hidden');$('editor').classList.add('hidden');$('home').classList.add('hidden');$('evolution').classList.remove('hidden');$('evolutionText').textContent=cur.generatedText;window.scrollTo(0,0);};
window.backup=async()=>{
 try{capture();await enqueueSave();const payload={exported_at:new Date().toISOString(),patients:db.patients};const blob=new Blob([JSON.stringify(payload,null,2)],{type:'application/json'});const a=document.createElement('a'),u=URL.createObjectURL(blob);a.href=u;a.download='backup-uti-check-servidor-'+new Date().toISOString().slice(0,10)+'.json';a.click();URL.revokeObjectURL(u);}catch(err){alert(err.message);}
};
const originalHome=window.home;
window.home=async()=>{if(cur){capture();await enqueueSave();} $('editor').classList.add('hidden');$('evolution').classList.add('hidden');$('home').classList.remove('hidden');await loadBeds();};
const showArchive=async()=>{
 try{
  $('home').classList.add('hidden');$('editor').classList.add('hidden');$('evolution').classList.add('hidden');$('archive').classList.remove('hidden');
  $('archiveList').innerHTML='<p class="muted">Carregando arquivo...</p>';
  const d=await api('/clinical/discharged');
  const stays=d.stays||[];
  $('archiveCount').textContent=stays.length+' registros';
  if(!stays.length){$('archiveList').innerHTML='<p class="muted">Nenhuma internação encerrada encontrada.</p>';return;}
  $('archiveList').innerHTML='';
  stays.forEach(stay=>{
   const card=document.createElement('article');card.className='card';
   const admitted=stay.admitted_at?new Date(stay.admitted_at).toLocaleString('pt-BR'):'—';
   const discharged=stay.discharged_at?new Date(stay.discharged_at).toLocaleString('pt-BR'):'—';
   card.innerHTML='<div class="patient"><div><strong>Leito '+esc(String(stay.bed_no).padStart(2,'0'))+' · '+esc(stay.initials||'Sem identificação')+'</strong><div class="meta">Admissão: '+esc(admitted)+'</div><div class="meta">Alta: '+esc(discharged)+'</div><div class="meta">'+Number(stay.evolution_count||0)+' evolução(ões)</div></div><button class="btn secondary" type="button">Consultar histórico</button></div>';
   card.querySelector('button').addEventListener('click',()=>showDischargedHistory(stay));
   $('archiveList').appendChild(card);
  });
 }catch(err){$('archiveList').innerHTML='<p class="warning">Não foi possível carregar o arquivo: '+esc(err.message)+'</p>';}
};
const showDischargedHistory=async stay=>{
 try{
  const d=await api('/patients/'+encodeURIComponent(stay.id)+'/evolutions');
  const evs=(d.evolutions||[]).slice().sort((a,b)=>new Date(b.created_at)-new Date(a.created_at));
  const w=window.open('','_blank');
  if(!w){alert('Permita a abertura da janela para visualizar o histórico.');return;}
  const headings=new Set(['HISTÓRIA E EVOLUÇÃO RECENTE','EXAME FÍSICO','PARÂMETROS E BALANÇO','RESPIRATÓRIO / VENTILAÇÃO','HEMODINÂMICA','RENAL / METABÓLICO','INFECCIOSO','EXAMES COMPLEMENTARES','DISPOSITIVOS / MOBILIDADE','AVALIAÇÃO / PROBLEMAS ATIVOS','METAS TERAPÊUTICAS','CONDUTAS / PLANO']);
  const renderText=raw=>{
   let source=String(raw||'').replaceAll('\r','');
   const disclaimer='RASCUNHO GERADO PELO UTI CHECK';
   const disclaimerAt=source.indexOf(disclaimer);
   const disclaimerText=disclaimerAt>=0?source.slice(disclaimerAt).trim():'';
   if(disclaimerAt>=0)source=source.slice(0,disclaimerAt).trim();
   const headingList=[...headings].sort((a,b)=>b.length-a.length);
   const found=[];
   let cursor=0;
   while(cursor<source.length){
    let next=null;
    for(const title of headingList){
     const at=source.indexOf(title,cursor);
     if(at>=0&&(!next||at<next.at))next={at,title};
    }
    if(!next)break;
    found.push(next);
    cursor=next.at+next.title.length;
   }
   const intro=source.slice(0,found.length?found[0].at:source.length).trim();
   const sections=found.map((m,i)=>({title:m.title,body:source.slice(m.at+m.title.length,i+1<found.length?found[i+1].at:source.length).trim()}));
   const renderLines=body=>body.split('\n').map(x=>x.trim()).filter(Boolean).map(line=>{
    const pos=line.indexOf(':');
    return pos>0&&pos<70?'<p><strong>'+esc(line.slice(0,pos+1))+'</strong> '+esc(line.slice(pos+1).trim())+'</p>':'<p>'+esc(line)+'</p>';
   }).join('');
   const introHtml=intro?'<div class="intro">'+renderLines(intro)+'</div>':'';
   const sectionsHtml=sections.filter(section=>section.body).map(section=>'<section class="clinical-section"><h3>'+esc(section.title)+'</h3><div>'+renderLines(section.body)+'</div></section>').join('');
   const footer=disclaimerText?'<footer class="draft-note">'+esc(disclaimerText)+'</footer>':'';
   return introHtml+sectionsHtml+footer;
  };
  const cards=evs.map((e,i)=>{
   const stamp=e.created_at||e.started_at||e.archived_at;
   const body=e.content?.generated_text||'';
   const fallback=body?'':'<pre class="raw">'+esc(JSON.stringify(e.content||{},null,2))+'</pre>';
   return '<article class="evolution"><div class="evolution-head"><div><span class="eyebrow">EVOLUÇÃO '+String(evs.length-i).padStart(2,'0')+'</span><h2>'+esc(stamp?new Date(stamp).toLocaleString('pt-BR'):'Data não informada')+'</h2></div><span class="status">'+(e.archived_at?'Arquivada':'Registro')+'</span></div>'+(body?renderText(body):fallback)+'</article>';
  }).join('');
  const style=`*{box-sizing:border-box}body{margin:0;background:#f2f5f8;color:#172536;font:15px/1.5 -apple-system,BlinkMacSystemFont,"Segoe UI",Arial,sans-serif}.toolbar{position:sticky;top:0;background:#10283d;padding:12px max(18px,calc((100% - 980px)/2));display:flex;justify-content:flex-end;z-index:2}.toolbar button{border:0;border-radius:9px;padding:10px 16px;background:#e5eef7;color:#123b5e;font-weight:700;cursor:pointer}.page{max-width:980px;margin:28px auto;padding:0 18px}.summary,.evolution{background:white;border:1px solid #d9e2ec;border-radius:14px;padding:22px;margin-bottom:18px;box-shadow:0 2px 8px #10283d0a}.summary h1{margin:0 0 8px;font-size:26px}.muted{color:#52677d}.evolution-head{display:flex;align-items:center;justify-content:space-between;gap:12px;border-bottom:1px solid #e3eaf1;padding-bottom:14px;margin-bottom:14px}.eyebrow{font-size:11px;letter-spacing:.08em;font-weight:800;color:#52708b}.evolution h2{font-size:19px;margin:4px 0}.status{font-size:12px;background:#edf3f8;padding:5px 10px;border-radius:20px}.intro{background:#f7f9fb;border-radius:10px;padding:12px 16px;margin-bottom:14px}.intro p{margin:4px 0}.clinical-section{border:1px solid #e1e8ef;border-radius:10px;margin:12px 0;overflow:hidden}.clinical-section h3{margin:0;background:#edf3f8;padding:10px 14px;font-size:14px;color:#183b59}.clinical-section>div{padding:10px 14px}.clinical-section p{margin:5px 0;overflow-wrap:anywhere}.raw{white-space:pre-wrap;overflow-wrap:anywhere}.draft-note{margin-top:14px;padding-top:9px;border-top:1px solid #d9e2ec;color:#52677d;font-size:12px;font-style:italic}.empty{padding:24px;text-align:center;color:#52677d}@page{size:auto;margin:14mm 12mm}@media print{html,body{background:#fff!important;color:#172536!important;font-size:10.5pt}.toolbar{display:none!important}.page{max-width:none;margin:0;padding:0}.summary,.evolution{box-shadow:none;border:1px solid #bbb;margin:0 0 10px;padding:12px;break-before:auto;break-after:auto;break-inside:auto}.summary{break-after:avoid}.evolution-head{break-after:avoid}.clinical-section{break-inside:avoid;margin:8px 0}.clinical-section h3{print-color-adjust:exact;-webkit-print-color-adjust:exact}.intro{break-inside:avoid}.evolution{orphans:3;widows:3}}`;
  w.document.write('<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Histórico da internação</title><style>'+style+'</style></head><body><div class="toolbar"><button id="printHistory" type="button">Imprimir / Salvar PDF</button></div><main class="page"><section class="summary"><h1>Histórico da internação</h1><p><strong>Leito '+esc(String(stay.bed_no).padStart(2,'0'))+' · '+esc(stay.initials||'Sem identificação')+'</strong></p><p class="muted">Admissão: '+esc(stay.admitted_at?new Date(stay.admitted_at).toLocaleString('pt-BR'):'—')+'<br>Alta: '+esc(stay.discharged_at?new Date(stay.discharged_at).toLocaleString('pt-BR'):'—')+'</p><p class="muted">'+evs.length+' evolução(ões) registrada(s)</p></section>'+(cards||'<div class="summary empty">Nenhuma evolução registrada.</div>')+'</main></body></html>');
  w.document.close();
  const printButton=w.document.getElementById('printHistory');
  printButton?.addEventListener('click',()=>{w.focus();w.print();});
 }catch(err){alert('Falha ao consultar histórico: '+err.message);}
};
const escapePdfHtml=value=>String(value).replace(/[&<>"]/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[ch]));
window.printEvolutionPdf=()=>{
 const text=$('evolutionText')?.textContent||'';
 if(!text.trim()){alert('Não há evolução exibida para exportar.');return;}
 const w=window.open('','_blank');
 if(!w){alert('Permita a abertura de janelas para gerar o PDF.');return;}
 const provisional=$('evolutionStatus')?.textContent==='PROVISÓRIA';
 const title=provisional?'Evolução provisória — passagem de caso':'Evolução médica';
 const warning=provisional?'<p class="notice">PROVISÓRIA — PARA PASSAGEM DE CASO — NÃO FINALIZADA</p>':'<p class="notice">RASCUNHO — revisar e validar antes de assinar.</p>';
 w.document.write('<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>'+escapePdfHtml(title)+'</title><style>*{box-sizing:border-box}body{font:14px/1.5 -apple-system,BlinkMacSystemFont,Arial,sans-serif;color:#172536;margin:0;padding:24px}.toolbar{margin-bottom:18px}.toolbar button{border:0;border-radius:8px;padding:11px 16px;background:#1769aa;color:white;font-weight:700}.notice{font-weight:800;color:#8a3b00;border:1px solid #e5c58e;background:#fff7e8;padding:10px;border-radius:8px}pre{white-space:pre-wrap;overflow-wrap:anywhere;font:12px/1.5 -apple-system,BlinkMacSystemFont,Arial,sans-serif;margin:0}@page{size:auto;margin:14mm}@media print{body{padding:0}.toolbar{display:none}}</style></head><body><div class="toolbar"><button id="printPdf" type="button">Imprimir / Salvar como PDF</button></div>'+warning+'<pre id="evolutionBody"></pre></body></html>');
 w.document.close();
 w.document.getElementById('evolutionBody').textContent=text;
 w.document.getElementById('printPdf').addEventListener('click',()=>{w.focus();w.print();});
};
document.addEventListener('click',e=>{
 const el=e.target.closest('[data-action]');if(!el)return;
 if(el.dataset.action==='pdf-evolution')window.printEvolutionPdf();
 if(el.dataset.action==='open-archive')showArchive();
 if(el.dataset.action==='close-archive'){$('archive').classList.add('hidden');$('home').classList.remove('hidden');}
});
document.addEventListener('submit',async e=>{
 if(e.target.id!=='utiLoginForm')return;e.preventDefault();
 const btn=e.target.querySelector('button');btn.disabled=true;
 try{
  const d=await fetch('./api/auth/login',{method:'POST',credentials:'same-origin',headers:{'Content-Type':'application/json','Accept':'application/json'},body:JSON.stringify({username:$('utiUser').value.trim(),password:$('utiPass').value})});
  const body=await d.json().catch(()=>({}));if(!d.ok)throw new Error(body.error||'Falha no login');
  user=body.user;await loadCsrf();await loadBeds();$('home').classList.remove('hidden');hideLogin();installLogout();
 }catch(err){showLogin('Falha ao carregar os leitos: '+err.message);btn.disabled=false;}
});
(async()=>{
 try{const me=await api('/auth/me');user=me.user;await loadCsrf();await loadBeds();hideLogin();$('home').classList.remove('hidden');installLogout();}
 catch(err){showLogin('Entre com seu usuário e senha.');}
})();
if($('home'))$('home').classList.add('hidden');
 const restoreBtn=document.querySelector('[data-action="choose-restore"]');if(restoreBtn)restoreBtn.disabled=true;
 const restoreInput=$('restore');if(restoreInput)restoreInput.disabled=true;
})();
