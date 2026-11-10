const stages=[
{id:'history',name:'História',fields:[
{type:'textarea',id:'hpi',label:'História da doença atual / resumo da internação',full:true,placeholder:'Início, evolução, tratamentos prévios, motivo da admissão no CTI...'},
{type:'textarea',id:'last24',label:'Eventos e intercorrências nas últimas 24 horas',full:true},
{type:'textarea',id:'priorCourse',label:'Procedimentos, cirurgias, dispositivos e tratamentos prévios',full:true},
{type:'choice',id:'source',label:'Origem da internação',options:['Pronto-socorro','Enfermaria','Centro cirúrgico / RPA','Transferência de outro hospital','Outro']},
{type:'choice',id:'baseline',label:'Funcionalidade prévia',options:['Independente','Dependência parcial','Dependência total','Não conhecido']},
{type:'textarea',id:'historyOther',label:'Outras informações relevantes',full:true}
]},
{id:'exam',name:'Exame físico',fields:[
{type:'choice',id:'general',label:'Estado geral',options:['Bom','Regular','Grave','Muito grave']},
{type:'choice',id:'consciousness',label:'Consciência',options:['Alerta','Sonolento','Confuso','Agitado','Torporoso','Comatoso','Sedado']},
{type:'choice',id:'neuroExam',label:'Neurológico',options:['Sem déficit focal aparente','Déficit focal','Pupilas isocóricas e fotorreagentes','Alteração pupilar','Exame limitado / não avaliável']},
{type:'text',id:'gcs',label:'Glasgow (E/V/M ou total)'},
{type:'text',id:'rass',label:'RASS'},
{type:'text',id:'pain',label:'Dor (escala e valor)'},
{type:'choice',id:'respExam',label:'Inspeção / esforço respiratório',options:['Confortável','Taquipneico','Uso de musculatura acessória','Bradipneico','Em ventilação mecânica','Outro']},
{type:'choice',id:'lungAusc',label:'Ausculta pulmonar',options:['MV presente bilateral, sem ruídos adventícios','Crepitações','Sibilos','Roncos','MV reduzido','Assimetria','Não avaliado']},
{type:'choice',id:'cardioExam',label:'Cardiovascular',options:['Ritmo regular, bulhas normofonéticas','Arritmia','Bulhas hipofonéticas','Sopro','Outro']},
{type:'choice',id:'perfusion',label:'Perfusão periférica',options:['Adequada','TEC prolongado','Extremidades frias','Moteamento','Edema periférico','Outro']},
{type:'choice',id:'abdomen',label:'Abdome',options:['Flácido, indolor','Distendido','Doloroso','Defesa / irritação peritoneal','RHA diminuídos','RHA aumentados','Outro']},
{type:'choice',id:'limbs',label:'Extremidades',options:['Sem edema','Edema','Assimetria','Sinais sugestivos de TVP','Lesões / alterações cutâneas']},
{type:'textarea',id:'skin',label:'Pele, feridas, lesões por pressão e outros achados',full:true},
{type:'textarea',id:'physicalOther',label:'Outros achados do exame físico',full:true}
]},
{id:'vitals',name:'Parâmetros',fields:[
{type:'number',id:'bpSys',label:'PA sistólica (mmHg)'},{type:'number',id:'bpDia',label:'PA diastólica (mmHg)'},{type:'number',id:'map',label:'PAM (mmHg)'},{type:'number',id:'hr',label:'FC (bpm)'},{type:'number',id:'rr',label:'FR (irpm)'},{type:'number',id:'temp',label:'Temperatura (°C)',step:'.1'},{type:'number',id:'spo2',label:'SpO₂ (%)'},{type:'number',id:'glucose',label:'Glicemia (mg/dL)'},
{type:'number',id:'urineHour',label:'Diurese (mL/h)'},{type:'number',id:'urine24',label:'Diurese 24h (mL)'},{type:'number',id:'input24',label:'Entradas 24h (mL)'},{type:'number',id:'output24',label:'Saídas 24h (mL)'},{type:'number',id:'balance24',label:'Balanço 24h (mL)'},{type:'number',id:'balanceTotal',label:'Balanço acumulado (mL)'},
{type:'textarea',id:'monitorNotes',label:'Tendências / outros parâmetros monitorizados',full:true}
]},
{id:'resp',name:'Respiratório',fields:[
{type:'choice',id:'oxygenMode',label:'Suporte respiratório',options:['Ar ambiente','Cateter nasal','Máscara','Máscara com reservatório','CNAF / alto fluxo','VNI','Ventilação mecânica invasiva','Traqueostomia / suporte ventilatório']},
{type:'number',id:'oxygenFlow',label:'Fluxo O₂ (L/min)'},{type:'text',id:'fio2',label:'FiO₂ (%)'},
{type:'number',id:'ventVt',label:'Volume corrente (mL)'},{type:'number',id:'ventPeep',label:'PEEP (cmH₂O)'},{type:'number',id:'ventPip',label:'Pressão de pico (cmH₂O)'},{type:'number',id:'ventPplat',label:'Pressão de platô (cmH₂O)'},{type:'number',id:'ventRR',label:'FR programada (irpm)'},{type:'number',id:'ventPS',label:'Pressão de suporte (cmH₂O)'},
{type:'choice',id:'ventMode',label:'Modo ventilatório',options:['VCV','PCV','PSV','PRVC','Outro','Não se aplica']},
{type:'textarea',id:'gasometry',label:'Gasometria (pH / PaCO₂ / PaO₂ / HCO₃ / BE / lactato)',full:true},
{type:'textarea',id:'respAssessment',label:'Avaliação respiratória / desmame / TRE',full:true}
]},
{id:'hemo',name:'Hemodinâmica',fields:[
{type:'choice',id:'vasoactive',label:'Drogas vasoativas',options:['Não utiliza','Noradrenalina','Noradrenalina + vasopressina','Adrenalina','Dobutamina','Outras combinações']},
{type:'textarea',id:'vasoDose',label:'Drogas, doses, unidades e tendência',full:true},
{type:'choice',id:'rhythm',label:'Ritmo / monitorização',options:['Sinusal','Fibrilação atrial','Flutter','Taquiarritmia','Bradiarritmia','Marca-passo','Outro']},
{type:'textarea',id:'hemoAssessment',label:'Perfusão, lactato, responsividade a fluidos, POCUS/eco e avaliação hemodinâmica',full:true}
]},
{id:'renal',name:'Renal/metabólico',fields:[
{type:'number',id:'creatinine',label:'Creatinina (mg/dL)',step:'.01'},{type:'number',id:'urea',label:'Ureia (mg/dL)'},{type:'number',id:'sodium',label:'Sódio (mEq/L)'},{type:'number',id:'potassium',label:'Potássio (mEq/L)',step:'.1'},{type:'number',id:'magnesium',label:'Magnésio (mg/dL)',step:'.1'},{type:'number',id:'phosphorus',label:'Fósforo (mg/dL)',step:'.1'},{type:'number',id:'calcium',label:'Cálcio (mg/dL)',step:'.1'},{type:'number',id:'lactate',label:'Lactato (mmol/L)',step:'.1'},
{type:'choice',id:'rtt',label:'Terapia renal substitutiva',options:['Não','Hemodiálise intermitente','Terapia contínua','SLED','Em avaliação']},
{type:'textarea',id:'renalAssessment',label:'Função renal, distúrbios, reposições e plano',full:true}
]},
{id:'infect',name:'Infecção',fields:[
{type:'choice',id:'infectionStatus',label:'Situação infecciosa',options:['Sem suspeita atual','Suspeita de infecção','Infecção confirmada','Sepse','Choque séptico','Em investigação']},
{type:'text',id:'infectionFocus',label:'Foco suspeito/confirmado'},{type:'text',id:'fever',label:'Curva térmica / pico febril'},
{type:'textarea',id:'cultures',label:'Culturas: coleta, data e resultados',full:true},
{type:'textarea',id:'antibiotics',label:'Antimicrobianos: fármaco, dose, início, dia de tratamento e plano',full:true},
{type:'textarea',id:'sourceControl',label:'Controle de foco / isolamento / avaliação infecciosa',full:true}
]},
{id:'labs',name:'Exames',fields:[
{type:'textarea',id:'cbc',label:'Hemograma',full:true},{type:'textarea',id:'coag',label:'Coagulograma / hemóstase',full:true},{type:'textarea',id:'liver',label:'Função hepática',full:true},{type:'textarea',id:'otherLabs',label:'Outros exames laboratoriais e tendências',full:true},{type:'textarea',id:'imaging',label:'Imagem: RX, US, TC, RM e achados relevantes',full:true},{type:'textarea',id:'ecgEcho',label:'ECG / ecocardiograma / POCUS',full:true},{type:'textarea',id:'pendingTests',label:'Exames solicitados / pendentes e previsão de revisão',full:true}
]},
{id:'devices',name:'Dispositivos',fields:[
{type:'checks',id:'deviceList',label:'Dispositivos presentes',options:['Tubo orotraqueal','Traqueostomia','CVC','Acesso arterial','Acesso periférico','Sonda vesical','Sonda enteral / nasoenteral','Dreno torácico','Dreno abdominal','Cateter de diálise','Outros']},
{type:'textarea',id:'deviceDetails',label:'Data, sítio, indicação, cuidados e necessidade diária de cada dispositivo',full:true},
{type:'choice',id:'mobility',label:'Mobilidade',options:['Acamado','Mobilização no leito','Sedestação','Poltrona','Deambulação assistida','Deambula independente']},
{type:'textarea',id:'skinCare',label:'Pele, curativos, prevenção de lesão por pressão e fisioterapia',full:true}
]},
{id:'assessment',name:'Avaliação',fields:[
{type:'textarea',id:'problemList',label:'Lista de problemas ativos (priorizar)',full:true,placeholder:'1. ...\n2. ...\n3. ...'},
{type:'textarea',id:'systemAssessment',label:'Impressão clínica / avaliação por sistemas',full:true},
{type:'textarea',id:'severity',label:'Gravidade, disfunções orgânicas e escores (se calculados)',full:true},
{type:'textarea',id:'response',label:'Resposta às intervenções e comparação com visita anterior',full:true}
]},
{id:'goals',name:'Metas',fields:[
{type:'textarea',id:'goalHemodynamic',label:'Meta hemodinâmica (ex.: PAM individualizada)',full:true},
{type:'textarea',id:'goalResp',label:'Meta respiratória / oxigenação / ventilação',full:true},
{type:'textarea',id:'goalRenal',label:'Meta renal / diurese / balanço',full:true},
{type:'textarea',id:'goalNeuro',label:'Meta neurológica / sedação / analgesia',full:true},
{type:'textarea',id:'goalNutrition',label:'Meta nutricional / glicêmica',full:true},
{type:'textarea',id:'goalOther',label:'Outras metas individualizadas',full:true}
]},
{id:'plan',name:'Condutas',fields:[
{type:'textarea',id:'dietPlan',label:'Dieta / nutrição / hidratação',full:true},
{type:'textarea',id:'medPlan',label:'Prescrição e ajustes de medicamentos',full:true},
{type:'textarea',id:'anticoagPlan',label:'Profilaxia TEV / anticoagulação / risco hemorrágico',full:true},
{type:'textarea',id:'prophylaxis',label:'Profilaxias e medidas preventivas',full:true},
{type:'textarea',id:'procedures',label:'Procedimentos / pareceres / interconsultas',full:true},
{type:'textarea',id:'testsPlan',label:'Exames a solicitar e programação de reavaliação',full:true},
{type:'textarea',id:'family',label:'Comunicação com família / objetivos de cuidado',full:true},
{type:'textarea',id:'next24',label:'Plano para as próximas 24 horas / pendências',full:true},
{type:'choice',id:'disposition',label:'Perspectiva de saída da UTI',options:['Sem previsão','Reavaliar possibilidade nas próximas 24–48h','Possível transferência para enfermaria','Alta da UTI indicada após avaliação da equipe','Cuidados de fim de vida / plano individualizado','Outro']}
]}
];
let db=JSON.parse(localStorage.getItem('uticheck_adulto_v2')||'{"patients":[]}'),cur=null,active=0;

if(!Array.isArray(db.patients))db={patients:[]};
// Migração não destrutiva: mantém pacientes já cadastrados e cria histórico/ciclo.
db.patients.forEach((p,i)=>{p.f||={};p.answers||={};p.history=Array.isArray(p.history)?p.history:[];p.bedNo=String(p.bedNo||p.f.bed||String(i+1).padStart(2,'0')).padStart(2,'0');p.f.bed=p.bedNo;p.cycleStartedAt=p.cycleStartedAt||new Date().toISOString();p.cycleId=p.cycleId||p.cycleStartedAt;p.archivedCycleId=p.archivedCycleId||null;});
const $=id=>document.getElementById(id);
function esc(s){return String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function persist(){localStorage.setItem('uticheck_adulto_v2',JSON.stringify(db))}
function occupied(){return new Set(db.patients.map(p=>p.bedNo))}
function newPatient(){let used=occupied(),n=Array.from({length:10},(_,i)=>String(i+1).padStart(2,'0')).find(x=>!used.has(x));if(!n){alert('Os 10 leitos já estão ocupados. Encerre uma internação antes de cadastrar outro paciente.');return}cur={id:Date.now().toString(),bedNo:n,f:{bed:n},answers:{},history:[],cycleStartedAt:new Date().toISOString(),cycleId:Date.now().toString(),archivedCycleId:null};db.patients.push(cur);persist();openPatient(cur.id)}
function renderHome(){let used=occupied();$('count').textContent=db.patients.length+' / 10 ocupados';$('patients').innerHTML='';for(let i=1;i<=10;i++){let n=String(i).padStart(2,'0'),p=db.patients.find(x=>x.bedNo===n);let el=document.createElement('div');el.className='card';if(!p){el.innerHTML=`<div class="patient"><div><strong>Leito ${n} · Livre</strong><div class="meta">Nenhum paciente cadastrado</div></div><button class="btn secondary">Ocupar leito</button></div>`;el.querySelector('button').onclick=newPatient;}else{let age=(Date.now()-new Date(p.cycleStartedAt||Date.now()).getTime())/3600000;let status=age>=24?'Nova visita pendente':(p.lastArchivedAt&&new Date(p.lastArchivedAt)>new Date(p.cycleStartedAt)?'Evolução arquivada':'Em preenchimento');el.innerHTML=`<div class="patient"><div><strong>Leito ${n} · ${esc(p.f.identifier||'Paciente')}</strong><div class="meta">${esc(p.f.diagnosis||'Diagnóstico não informado')} · ${status}</div><div class="meta">Histórico: ${(p.history||[]).length} evolução(ões)</div></div><button class="btn secondary">Abrir leito</button></div><div class="toolbar"><button class="btn secondary histbtn">Ver histórico</button><button class="btn danger closebtn">Encerrar internação</button></div>`;el.querySelector('.patient button').onclick=()=>openPatient(p.id);el.querySelector('.histbtn').onclick=()=>showHistory(p.id);el.querySelector('.closebtn').onclick=()=>closeStay(p.id);} $('patients').appendChild(el)}}
function home(){$('editor').classList.add('hidden');$('evolution').classList.add('hidden');$('home').classList.remove('hidden');renderHome()}
function hasDailyData(p){return Object.values(p.answers||{}).some(v=>Array.isArray(v)?v.length>0:String(v??'').trim()!=='')}
function archiveDraft(p,label='Fechamento do ciclo de 24h'){p.history=p.history||[];if(p.archivedCycleId===p.cycleId||p.history.some(x=>x.cycleId===p.cycleId))return false;let txt=buildEvolution();let rec={id:Date.now().toString(),cycleId:p.cycleId,bedNo:p.bedNo,archivedAt:new Date().toISOString(),label,text:txt,form:JSON.parse(JSON.stringify(p.f||{})),answers:JSON.parse(JSON.stringify(p.answers||{}))};p.history.push(rec);p.lastArchivedAt=rec.archivedAt;p.archivedCycleId=p.cycleId;return true;}
function startNewEvolution(){if(!cur)return;save();if(!confirm('Iniciar uma nova evolução para este paciente? A evolução atual será arquivada no histórico e os campos diários serão limpos. O cadastro e os dados permanentes do paciente serão mantidos.'))return;if(hasDailyData(cur)&&cur.archivedCycleId!==cur.cycleId)archiveDraft(cur,'Evolução anterior — arquivada ao iniciar nova visita');cur.answers={};cur.cycleStartedAt=new Date().toISOString();cur.cycleId=Date.now().toString();cur.archivedCycleId=null;persist();active=0;renderTabs();renderStage();updateProgress();$('evolution').classList.add('hidden');$('editor').classList.remove('hidden');alert('Nova evolução iniciada. Os dados diários anteriores foram preservados no histórico.');}
function rotateCycle(p){let age=(Date.now()-new Date(p.cycleStartedAt||Date.now()).getTime())/3600000;if(age<24)return false;if(!confirm(`Já se passaram ${Math.floor(age)} horas desde o início deste ciclo do leito ${p.bedNo}. Arquivar o registro atual e iniciar uma nova evolução de 24 horas? O histórico anterior será preservado.`))return false;if(hasDailyData(p)&&p.archivedCycleId!==p.cycleId)archiveDraft(p,'Fechamento do ciclo de 24h');p.answers={};p.cycleStartedAt=new Date().toISOString();p.cycleId=Date.now().toString();p.archivedCycleId=null;persist();return true}
function openPatient(id){cur=db.patients.find(p=>p.id===id);if(!cur)return;cur.f||={};cur.answers||={};cur.history||=[];rotateCycle(cur);$('home').classList.add('hidden');$('evolution').classList.add('hidden');$('editor').classList.remove('hidden');document.querySelectorAll('[data-f]').forEach(el=>el.value=cur.f[el.dataset.f]??'');active=0;renderTabs();renderStage();updateProgress();$('patientTitle').textContent='Leito '+cur.bedNo}
function save(){if(!cur)return;document.querySelectorAll('[data-f]').forEach(el=>cur.f[el.dataset.f]=el.value);document.querySelectorAll('[data-a]').forEach(el=>{if(el.type==='checkbox'){let arr=cur.answers[el.dataset.a]||[];if(el.checked&&!arr.includes(el.value))arr.push(el.value);if(!el.checked)arr=arr.filter(x=>x!==el.value);cur.answers[el.dataset.a]=arr}else cur.answers[el.dataset.a]=el.value});cur.f.bed=cur.bedNo;$('patientTitle').textContent='Leito '+cur.bedNo;persist();updateProgress()}
function showHistory(id){let p=db.patients.find(x=>x.id===id);if(!p)return;let h=p.history||[];let w=window.open('','_blank');if(!w){alert('Permita a abertura da janela para visualizar o histórico.');return}w.document.write('<meta name="viewport" content="width=device-width"><title>Histórico leito '+p.bedNo+'</title><style>body{font:15px Arial;padding:16px;white-space:pre-wrap}article{border-bottom:1px solid #ccc;padding:12px 0}</style><h2>Histórico — Leito '+p.bedNo+'</h2>'+ (h.length?h.slice().reverse().map(x=>'<article><b>'+new Date(x.archivedAt).toLocaleString('pt-BR')+' — '+esc(x.label)+'</b><pre>'+esc(x.text)+'</pre></article>').join(''):'<p>Nenhuma evolução arquivada.</p>'));}
function closeStay(id){let p=db.patients.find(x=>x.id===id);if(!p)return;if(!confirm('Encerrar a internação deste leito? O cadastro e todo o histórico serão exportados para o backup local antes de liberar o leito.'))return;let blob=new Blob([JSON.stringify({patient:p},null,2)],{type:'application/json'}),a=document.createElement('a'),u=URL.createObjectURL(blob);a.href=u;a.download='arquivo-leito-'+p.bedNo+'-'+Date.now()+'.json';a.click();URL.revokeObjectURL(u);db.patients=db.patients.filter(x=>x.id!==id);persist();renderHome();}
function renderTabs(){$('tabs').innerHTML=stages.map((s,i)=>`<button class="tab ${i===active?'active':''} ${stageHasData(s)?'done':''}" data-action="tab-select" data-index="${i}">${s.name}</button>`).join('')}
function stageHasData(s){return s.fields.some(f=>{let v=cur.answers[f.id];return Array.isArray(v)?v.length>0:!!v})}
function renderStage(){let s=stages[active],html=`<div class="card"><div class="section-head"><h2>${s.name}</h2><span class="pill">Etapa ${active+1} de ${stages.length}</span></div><p class="muted">Preencha o que estiver disponível. Você pode pular esta etapa e retornar depois.</p><div class="grid">`;
s.fields.forEach(f=>{let val=cur.answers[f.id]??(f.type==='checks'?[]:'');html+=`<div class="field ${f.full?'full':''}"><label>${f.label}</label>`;if(f.type==='textarea')html+=`<textarea data-a="${f.id}" data-autosave="input" placeholder="${f.placeholder||''}">${esc(val)}</textarea>`;else if(f.type==='choice')html+=`<select data-a="${f.id}" data-autosave="change"><option value="">Selecionar</option>${f.options.map(o=>`<option ${val===o?'selected':''}>${o}</option>`).join('')}</select>`;else if(f.type==='checks')html+=`<div class="checks">${f.options.map(o=>`<label class="check"><input type="checkbox" data-a="${f.id}" value="${o}" ${Array.isArray(val)&&val.includes(o)?'checked':''} data-autosave="change"><span>${o}</span></label>`).join('')}</div>`;else html+=`<input data-a="${f.id}" type="${f.type==='number'?'number':'text'}" ${f.step?'step="'+f.step+'"':''} value="${esc(val)}" data-autosave="input">`;html+='</div>'});html+='</div></div>';$('stage').innerHTML=html;$('prev').disabled=active===0;$('next').textContent=active===stages.length-1?'Ver evolução →':'Próxima etapa →';}
function move(d){save();if(active===stages.length-1&&d>0){showEvolution();return}active=Math.max(0,Math.min(stages.length-1,active+d));renderTabs();renderStage();window.scrollTo({top:0,behavior:'smooth'})}
function updateProgress(){if(!cur)return;let all=stages.flatMap(s=>s.fields),filled=all.filter(f=>{let v=cur.answers[f.id];return Array.isArray(v)?v.length>0:!!v}).length;let pct=Math.round(filled/all.length*100);$('pct').textContent=pct+'% dos campos preenchidos';$('bar').style.width=pct+'%'}
function val(id){return cur.answers[id]??''}
function fieldLine(label,id){let v=val(id);return v?`${label}: ${Array.isArray(v)?v.join(', '):v}`:''}
function buildEvolution(){save();let f=cur.f,L=[];L.push('EVOLUÇÃO MÉDICA — TERAPIA INTENSIVA ADULTO');L.push(`Data/hora: ${new Date().toLocaleString('pt-BR')}`);L.push(`Leito: ${f.bed||'Não informado'} | Identificação: ${f.identifier||'Não informada'} | Idade: ${f.age||'—'} | Sexo: ${f.sex||'—'}`);L.push(`DIH: ${f.hospitalDay||'—'} | DI-UTI: ${f.icuDay||'—'} | Peso: ${f.weight||'—'} kg | Altura: ${f.height||'—'} cm`);L.push(`Diagnóstico principal: ${f.diagnosis||'Não informado'}`);if(f.comorbidities)L.push(`Comorbidades/diagnósticos secundários: ${f.comorbidities}`);if(f.allergies)L.push(`Alergias: ${f.allergies}`);if(f.homeMeds)L.push(`Medicações habituais: ${f.homeMeds}`);if(f.goalsOfCare)L.push(`Objetivos/limites de suporte: ${f.goalsOfCare}`);
L.push('\n\nHISTÓRIA E EVOLUÇÃO RECENTE');[['História da doença atual', 'hpi'],['Eventos últimas 24h','last24'],['Procedimentos/tratamentos prévios','priorCourse'],['Origem','source'],['Funcionalidade prévia','baseline']].forEach(([a,b])=>{let x=fieldLine(a,b);if(x)L.push(x)});
L.push('\n\nEXAME FÍSICO');[['Estado geral','general'],['Consciência','consciousness'],['Neurológico','neuroExam'],['Glasgow','gcs'],['RASS','rass'],['Dor','pain'],['Respiratório','respExam'],['Ausculta pulmonar','lungAusc'],['Cardiovascular','cardioExam'],['Perfusão','perfusion'],['Abdome','abdomen'],['Extremidades','limbs'],['Pele/feridas','skin'],['Outros achados','physicalOther']].forEach(([a,b])=>{let x=fieldLine(a,b);if(x)L.push(x)});
L.push('\n\nPARÂMETROS E BALANÇO');[['PA sistólica','bpSys'],['PA diastólica','bpDia'],['PAM','map'],['FC','hr'],['FR','rr'],['Temperatura','temp'],['SpO₂','spo2'],['Glicemia','glucose'],['Diurese mL/h','urineHour'],['Diurese 24h','urine24'],['Entradas 24h','input24'],['Saídas 24h','output24'],['Balanço 24h','balance24'],['Balanço acumulado','balanceTotal'],['Tendências','monitorNotes']].forEach(([a,b])=>{let x=fieldLine(a,b);if(x)L.push(x)});
L.push('\n\nRESPIRATÓRIO / VENTILAÇÃO');[['Suporte','oxygenMode'],['Fluxo O₂','oxygenFlow'],['FiO₂','fio2'],['Modo ventilatório','ventMode'],['Volume corrente','ventVt'],['PEEP','ventPeep'],['Pressão de pico','ventPip'],['Pressão de platô','ventPplat'],['FR programada','ventRR'],['Pressão de suporte','ventPS'],['Gasometria','gasometry'],['Avaliação respiratória','respAssessment']].forEach(([a,b])=>{let x=fieldLine(a,b);if(x)L.push(x)});
L.push('\n\nHEMODINÂMICA');[['Drogas vasoativas','vasoactive'],['Doses/tendência','vasoDose'],['Ritmo','rhythm'],['Avaliação hemodinâmica','hemoAssessment']].forEach(([a,b])=>{let x=fieldLine(a,b);if(x)L.push(x)});
L.push('\n\nRENAL / METABÓLICO');[['Creatinina','creatinine'],['Ureia','urea'],['Sódio','sodium'],['Potássio','potassium'],['Magnésio','magnesium'],['Fósforo','phosphorus'],['Cálcio','calcium'],['Lactato','lactate'],['TRS','rtt'],['Avaliação renal','renalAssessment']].forEach(([a,b])=>{let x=fieldLine(a,b);if(x)L.push(x)});
L.push('\n\nINFECCIOSO');[['Situação','infectionStatus'],['Foco','infectionFocus'],['Curva térmica','fever'],['Culturas','cultures'],['Antimicrobianos','antibiotics'],['Controle de foco','sourceControl']].forEach(([a,b])=>{let x=fieldLine(a,b);if(x)L.push(x)});
L.push('\n\nEXAMES COMPLEMENTARES');[['Hemograma','cbc'],['Coagulação','coag'],['Função hepática','liver'],['Outros laboratórios','otherLabs'],['Imagem','imaging'],['ECG/eco/POCUS','ecgEcho'],['Exames pendentes','pendingTests']].forEach(([a,b])=>{let x=fieldLine(a,b);if(x)L.push(x)});
L.push('\n\nDISPOSITIVOS / MOBILIDADE');[['Dispositivos','deviceList'],['Detalhes dos dispositivos','deviceDetails'],['Mobilidade','mobility'],['Pele e cuidados','skinCare']].forEach(([a,b])=>{let x=fieldLine(a,b);if(x)L.push(x)});
L.push('\n\nAVALIAÇÃO / PROBLEMAS ATIVOS');[['Problemas','problemList'],['Impressão clínica','systemAssessment'],['Gravidade/escores','severity'],['Resposta ao tratamento','response']].forEach(([a,b])=>{let x=fieldLine(a,b);if(x)L.push(x)});
L.push('\n\nMETAS TERAPÊUTICAS');[['Hemodinâmica','goalHemodynamic'],['Respiratória','goalResp'],['Renal/balanço','goalRenal'],['Neurológica/sedação','goalNeuro'],['Nutrição/glicemia','goalNutrition'],['Outras','goalOther']].forEach(([a,b])=>{let x=fieldLine(a,b);if(x)L.push(x)});
L.push('\n\nCONDUTAS / PLANO');[['Dieta/nutrição/hidratação','dietPlan'],['Medicamentos','medPlan'],['TEV/anticoagulação','anticoagPlan'],['Profilaxias','prophylaxis'],['Procedimentos/pareceres','procedures'],['Exames/reavaliação','testsPlan'],['Família/objetivos de cuidado','family'],['Próximas 24h/pendências','next24'],['Perspectiva de saída','disposition']].forEach(([a,b])=>{let x=fieldLine(a,b);if(x)L.push(x)});
L.push('\n\nRASCUNHO GERADO PELO UTI CHECK — revisar, completar lacunas e validar no prontuário antes de assinar.');return L.join('\n')}
function showEvolution(){save();$('editor').classList.add('hidden');$('home').classList.add('hidden');$('evolution').classList.remove('hidden');$('evolutionText').textContent=buildEvolution();window.scrollTo(0,0)}
function archiveEvolution(){if(!cur)return;save();let text=buildEvolution();if(!confirm('Arquivar esta evolução no histórico do leito '+cur.bedNo+'? O registro ficará preservado neste aparelho.'))return;cur.history=cur.history||[];if(cur.archivedCycleId!==cur.cycleId){let rec={id:Date.now().toString(),cycleId:cur.cycleId,bedNo:cur.bedNo,archivedAt:new Date().toISOString(),label:'Evolução diária',text,form:JSON.parse(JSON.stringify(cur.f||{})),answers:JSON.parse(JSON.stringify(cur.answers||{}))};cur.history.push(rec);cur.lastArchivedAt=rec.archivedAt;cur.archivedCycleId=cur.cycleId;}persist();alert('Evolução arquivada no histórico local do leito '+cur.bedNo);home()}
function backEditor(){$('evolution').classList.add('hidden');$('editor').classList.remove('hidden')}
async function copyEvolution(){try{await navigator.clipboard.writeText($('evolutionText').textContent||buildEvolution());alert('Evolução copiada.')}catch(e){alert('Não foi possível copiar automaticamente. Selecione o texto e copie manualmente.')}}
function downloadEvolution(){let blob=new Blob([$('evolutionText').textContent||buildEvolution()],{type:'text/plain;charset=utf-8'}),a=document.createElement('a'),u=URL.createObjectURL(blob);a.href=u;a.download='evolucao-CTI-leito-'+(cur.f.bed||'sem-leito')+'.txt';a.click();URL.revokeObjectURL(u)}
function deletePatient(){if(confirm('Excluir o cadastro e todo o histórico deste leito? Recomenda-se exportar backup antes. Esta ação não pode ser desfeita.')){db.patients=db.patients.filter(p=>p.id!==cur.id);persist();cur=null;home()}}
function backup(){let b=new Blob([JSON.stringify(db,null,2)],{type:'application/json'}),a=document.createElement('a'),u=URL.createObjectURL(b);a.href=u;a.download='backup-uti-check-10-leitos-'+new Date().toISOString().slice(0,10)+'.json';a.click();URL.revokeObjectURL(u)}
function restoreData(e){let file=e.target.files[0];if(!file)return;let r=new FileReader();r.onload=()=>{try{let x=JSON.parse(r.result);if(!Array.isArray(x.patients))throw 0;x.patients.forEach((p,i)=>{p.history=p.history||[];p.bedNo=String(p.bedNo||p.f?.bed||String(i+1).padStart(2,'0')).padStart(2,'0');p.f=p.f||{};p.f.bed=p.bedNo;p.answers=p.answers||{};p.cycleStartedAt=p.cycleStartedAt||new Date().toISOString();p.cycleId=p.cycleId||p.cycleStartedAt;p.archivedCycleId=p.archivedCycleId||null});if(confirm('Substituir os dados atuais pelo backup?')){db=x;persist();renderHome();alert('Backup importado.')}}catch(_){alert('Arquivo inválido.')} };r.readAsText(file);e.target.value=''}
if('serviceWorker'in navigator)addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}));
// A inicialização autenticada é realizada por integration.js.

document.addEventListener('click',e=>{const el=e.target.closest('[data-action]');if(!el)return;const a=el.dataset.action;
if(a==='new-patient')newPatient();else if(a==='backup')backup();else if(a==='choose-restore')document.getElementById('restore').click();else if(a==='restore-data')restoreData({target:el});else if(a==='home')home();else if(a==='show-evolution')showEvolution();else if(a==='show-provisional-evolution')showProvisionalEvolution();else if(a==='start-new-evolution')startNewEvolution();else if(a==='delete-patient')deletePatient();else if(a==='move-prev')move(-1);else if(a==='move-next')move(1);else if(a==='back-editor')backEditor();else if(a==='archive-evolution')archiveEvolution();else if(a==='copy-evolution')copyEvolution();else if(a==='download-evolution')downloadEvolution();else if(a==='tab-select'){active=Number(el.dataset.index);renderTabs();renderStage();}});
document.addEventListener('input',e=>{if(e.target.matches('[data-autosave="input"],[data-f],[data-a]'))save();});
document.addEventListener('change',e=>{if(e.target.id==='restore'){restoreData({target:e.target});return;}if(e.target.matches('[data-autosave="change"],[data-f],[data-a]'))save();});
