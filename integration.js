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
  let activeEvolution=all.find(e=>!e.archived_at);
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
 const snapshot={id:cur.id,evolutionId:cur.evolutionId,bedNo:cur.bedNo,f:{...cur.f},answers:JSON.parse(JSON.stringify(cur.answers||{}))};
 saveQueue=saveQueue.then(async()=>{
  await api('/patients/'+encodeURIComponent(snapshot.id),{method:'PATCH',body:{initials:String(snapshot.f.identifier||('LEITO-'+snapshot.bedNo)).slice(0,20),permanent_data:permanent(snapshot.f)}});
  await api('/evolutions/'+encodeURIComponent(snapshot.evolutionId),{method:'PATCH',body:{content:{answers:snapshot.answers,form:snapshot.f,generated_text:typeof buildEvolution==='function'?buildEvolution():''}}});
 }).catch(err=>{console.error(err);alert('Não foi possível salvar no servidor: '+err.message);});
 return saveQueue;
};
window.persist=()=>{}; // bloqueia gravação clínica em localStorage
window.save=()=>{if(!cur)return;capture();$('patientTitle').textContent='Leito '+cur.bedNo;updateProgress();enqueueSave();};
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
window.showHistory=id=>{
 const p=db.patients.find(x=>x.id===id);if(!p)return;
 const w=window.open('','_blank');if(!w){alert('Permita a abertura da janela para visualizar o histórico.');return;}
 w.document.write('<meta name="viewport" content="width=device-width"><title>Histórico leito '+esc(p.bedNo)+'</title><style>body{font:15px Arial;padding:16px;white-space:pre-wrap}article{border-bottom:1px solid #ccc;padding:12px 0}</style><h2>Histórico — Leito '+esc(p.bedNo)+'</h2>'+(p.history.length?p.history.slice().reverse().map(x=>'<article><b>'+esc(new Date(x.archivedAt).toLocaleString('pt-BR'))+'</b><pre>'+esc(x.text)+'</pre></article>').join(''):'<p>Nenhuma evolução arquivada.</p>'));
};
window.closeStay=async id=>{
 const p=db.patients.find(x=>x.id===id);if(!p||!confirm('Registrar alta hospitalar e liberar este leito?'))return;
 try{await api('/patients/'+encodeURIComponent(id)+'/discharge',{method:'POST',body:{}});db.patients=db.patients.filter(x=>x.id!==id);cur=null;home();}catch(err){alert(err.message);}
};
window.deletePatient=()=>{if(cur)closeStay(cur.id);};
window.startNewEvolution=async()=>{
 if(!cur)return;capture();await enqueueSave();
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
 if(!cur)return;capture();await enqueueSave();
 if(!confirm('Arquivar esta evolução no histórico do servidor?'))return;
 try{await api('/evolutions/'+encodeURIComponent(cur.evolutionId)+'/archive',{method:'POST',body:{}});alert('Evolução arquivada no PostgreSQL.');await loadBeds();home();}
 catch(err){alert(err.message);}
};
window.showEvolution=()=>{capture();enqueueSave();$('editor').classList.add('hidden');$('home').classList.add('hidden');$('evolution').classList.remove('hidden');$('evolutionText').textContent=buildEvolution();window.scrollTo(0,0);};
window.backup=async()=>{
 try{capture();await enqueueSave();const payload={exported_at:new Date().toISOString(),patients:db.patients};const blob=new Blob([JSON.stringify(payload,null,2)],{type:'application/json'});const a=document.createElement('a'),u=URL.createObjectURL(blob);a.href=u;a.download='backup-uti-check-servidor-'+new Date().toISOString().slice(0,10)+'.json';a.click();URL.revokeObjectURL(u);}catch(err){alert(err.message);}
};
const originalHome=window.home;
window.home=async()=>{if(cur){capture();await enqueueSave();} $('editor').classList.add('hidden');$('evolution').classList.add('hidden');$('home').classList.remove('hidden');await loadBeds();};
document.addEventListener('submit',async e=>{
 if(e.target.id!=='utiLoginForm')return;e.preventDefault();
 const btn=e.target.querySelector('button');btn.disabled=true;
 try{
  const d=await fetch('./api/auth/login',{method:'POST',credentials:'same-origin',headers:{'Content-Type':'application/json','Accept':'application/json'},body:JSON.stringify({username:$('utiUser').value.trim(),password:$('utiPass').value})});
  const body=await d.json().catch(()=>({}));if(!d.ok)throw new Error(body.error||'Falha no login');
  user=body.user;await loadCsrf();hideLogin();await loadBeds();
 }catch(err){$('utiLoginError').textContent=err.message;btn.disabled=false;}
});
document.addEventListener('change',e=>{if(e.target.matches('[data-f],[data-a]')){capture();enqueueSave();}});
document.addEventListener('input',e=>{if(e.target.matches('[data-f],[data-a]')){capture();clearTimeout(window.__utiSaveTimer);window.__utiSaveTimer=setTimeout(enqueueSave,700);}});
(async()=>{
 try{const me=await api('/auth/me');user=me.user;await loadCsrf();await loadBeds();hideLogin();}
 catch(err){showLogin('Entre com seu usuário e senha.');}
})();
if($('home'))$('home').classList.add('hidden');
})();
