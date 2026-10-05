import {rareEarths,projects,minerals,sources} from './data.js';
import {projectFacts} from './editorial.js';
import {applications,applicationParts} from './applications-data.js';
import {diagram,applicationIcon} from './diagrams.js';

export function initApplications({selectProject}){
 const root=document.querySelector('.applications-explorer');
 const $=selector=>root.querySelector(selector);
 const $$=selector=>[...root.querySelectorAll(selector)];
 const isRare=symbol=>rareEarths.some(e=>e[0]===symbol);
 const sourceLink=key=>`<a class="source-link" href="${sources[key].url}" target="_blank" rel="noopener">${key==='reeeduca'?'SGB · elementos e usos':'DOE · materiais e tecnologias'} ↗</a>`;
 let tech='ev',part=2,selectedElement='Nd';
 const choices={motor:'magnet',battery:'nmc'};
 const setPressed=(node,on)=>{node.classList.toggle('active',on);node.setAttribute('aria-pressed',String(on));};
 $('#application-nav').innerHTML=applications.map(a=>`<button data-tech="${a.id}" aria-pressed="false">${applicationIcon(a.id)}<span>${a.name}</span><i aria-hidden="true"></i></button>`).join('');
 $('#periodic-grid').innerHTML=rareEarths.map(e=>`<button data-element="${e[0]}" aria-label="${e[2]}, ${e[0]}, número atômico ${e[1]}" aria-pressed="false" title="${e[2]}"><small>${e[1]}</small><strong>${e[0]}</strong><span>${e[2]}</span></button>`).join('');

 function selectElement(symbol,keepComponent=false){
  selectedElement=symbol;
  if(!keepComponent){
   // Choosing a magnetic element explicitly selects the architecture that can use it.
   if(['Nd','Pr','Dy','Tb'].includes(symbol))choices.motor='magnet';
   const current=applicationParts(tech,choices).findIndex(p=>p.materials.includes(symbol));
   if(current>=0)part=current;
   else{
    const match=applications.find(a=>applicationParts(a.id,choices).some(p=>p.materials.includes(symbol)));
    tech=match?.id??null;
    part=match?applicationParts(tech,choices).findIndex(p=>p.materials.includes(symbol)):0;
   }
  }
  render();
 }
 function selectPart(index){
  part=index;
  const materials=applicationParts(tech,choices)[part].materials;
  if(!materials.includes(selectedElement))selectedElement=materials.find(isRare)??null;
  render();
 }
 function render(){
  const focus=document.activeElement;
  const focusKey=focus?.dataset.part!==undefined?['part',focus.dataset.part]:focus?.dataset.component!==undefined?['component',focus.dataset.component]:focus?.dataset.material?['material',focus.dataset.material]:focus?.dataset.choice?['choice',focus.dataset.choice,focus.dataset.value]:null;
  const app=applications.find(a=>a.id===tech),parts=applicationParts(tech,choices),component=parts[part];
  const related=component?.materials.filter(isRare)??[];
  $$('[data-tech]').forEach(b=>{
   setPressed(b,b.dataset.tech===tech);
   b.classList.toggle('connected',Boolean(selectedElement&&applicationParts(b.dataset.tech,choices).some(p=>p.materials.includes(selectedElement))));
  });
  $$('[data-element]').forEach(b=>{setPressed(b,b.dataset.element===selectedElement);b.classList.toggle('related',related.includes(b.dataset.element));});
  $('#application-kicker').textContent=app?.category??'UM CASO DIFERENTE';
  $('#application-title').textContent=app?.name??'Fora da cadeia mineral comum.';
  $('#application-index').textContent=app?`${String(applications.indexOf(app)+1).padStart(2,'0')} / 08`:'61 / Pm';
  $('#tech-diagram').innerHTML=diagram(tech??'none',part,parts);
  $('#component-nav').innerHTML=parts.map((p,i)=>`<button data-component="${i}" class="${part===i?'active':''}" aria-pressed="${part===i}"><span>${i+1}</span>${p.name}</button>`).join('');
  $('.drawing-caption').hidden=!app;
  $('#tech-detail').innerHTML=component?`<span class="eyebrow">${String(part+1).padStart(2,'0')} — A PEÇA POR DENTRO</span><h4>${component.name}</h4><p class="component-description">${component.text}</p><span class="material-label eyebrow">${related.length?'TERRAS RARAS NESTA APLICAÇÃO':'OUTROS MATERIAIS NESTA PEÇA'}</span><div class="component-materials">${component.materials.filter(s=>related.length?isRare(s):true).map(materialButton).join('')}</div>${related.length&&component.materials.some(s=>!isRare(s))?`<div class="other-materials"><span>Também nesta peça</span>${component.materials.filter(s=>!isRare(s)).map(s=>`<button data-mineral-detail="${s}">${s} ↗</button>`).join('')}</div>`:''}${!related.length?'<p class="no-rare-earths">Nenhuma terra rara indicada para esta peça neste exemplo.</p>':''}`:'<span class="eyebrow">PROMÉCIO</span><h4>Radioativo.<br>Sem isótopos estáveis.</h4><p class="component-description">O promécio faz parte da família, mas não integra uma cadeia mineral comum. Por isso, não é ligado a um dos objetos desta seleção.</p>';
  const control=(key,label,options)=>`<fieldset><legend>${label}</legend><div class="architecture-options">${options.map(([value,text])=>`<button data-choice="${key}" data-value="${value}" aria-pressed="${choices[key]===value}" class="${choices[key]===value?'active':''}">${text}</button>`).join('')}</div></fieldset>`;
  $('#tech-controls').innerHTML=tech==='ev'&&part===1?control('battery','COMPARE A QUÍMICA DA BATERIA',[['nmc','NMC'],['lfp','LFP']]):(tech==='ev'&&part===2)||(tech==='wind'&&part===1)?control('motor',`COMPARE ${tech==='wind'?'O GERADOR':'O MOTOR'}`,[['magnet','Com ímãs'],['induction','Sem ímãs']]):'';
  renderElement();
  $('#application-sources').innerHTML=[...new Set(['reeeduca',app?.source??'reeeduca'])].map(sourceLink).join('');
  $('#application-announcement').textContent=[app?.name??'Promécio',component?.name,selectedElement?`Elemento selecionado: ${rareEarths.find(e=>e[0]===selectedElement)[2]}`:'Nenhuma terra rara indicada nesta peça'].filter(Boolean).join('. ');
  if(focusKey){const [key,value,extra]=focusKey;root.querySelector(`[data-${key}="${value}"]${extra?`[data-value="${extra}"]`:''}`)?.focus({preventScroll:true});}
 }
 function materialButton(symbol){
  const e=rareEarths.find(e=>e[0]===symbol),m=minerals.find(m=>m.symbol===symbol);
  const optional=['Dy','Tb'].includes(symbol)&&['ev','wind'].includes(tech);
  return `<button ${e?`data-material="${symbol}" aria-pressed="${selectedElement===symbol}"`:`data-mineral-detail="${symbol}"`} class="component-material ${e?'rare ':''}${symbol===selectedElement?'active':''}"><strong>${symbol}</strong><span>${e?.[2]??(symbol==='Al'?'Alumínio':m?.name)??symbol}</span><small>${optional?'Conforme a formulação':e?'Explorar elemento →':'Ver ficha ↗'}</small></button>`;
 }
 function renderElement(){
  const e=rareEarths.find(e=>e[0]===selectedElement);
  if(!e){$('#element-detail').innerHTML='<div class="element-empty"><span>↖</span><p>As tecnologias combinam materiais diferentes.<br><strong>Escolha uma terra rara acima para descobrir suas aplicações.</strong></p></div>';return;}
  const found=projects.filter(p=>projectFacts[p.id].elements.includes(e[0]));
  $('#element-detail').innerHTML=`<div class="element-identity"><strong>${e[0]}</strong><div><h3>${e[2]}</h3><span class="eyebrow">${e[3]==='outra'?'ELEMENTO ASSOCIADO':'TERRA RARA '+e[3].toUpperCase()}</span></div></div><div class="element-summary"><p>${e[4]}</p><button class="text-button" data-element-detail="${e[0]}">Ficha e fontes ↗</button></div><div class="element-origins"><span class="eyebrow">NOS REGISTROS DO ATLAS</span><div class="element-projects">${found.length?found.map(p=>`<button data-element-project="${p.id}">${projectFacts[p.id].short} ↗</button>`).join(''):'<span class="small">Não individualizado nas fichas. Isso não significa ausência no Brasil.</span>'}</div></div>`;
 }
 root.addEventListener('click',e=>{
  const b=e.target.closest('button,[data-part]');if(!b)return;
  if(b.dataset.tech){tech=b.dataset.tech;part=applications.find(a=>a.id===tech).defaultPart;selectPart(part);}
  else if(b.dataset.element){
   selectElement(b.dataset.element);
   const scene=$('.application-scene');
   if(e.detail>0&&scene.getBoundingClientRect().bottom<120)scene.scrollIntoView({block:'start',behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});
  }
  else if(b.dataset.material)selectElement(b.dataset.material,true);
  else if(b.dataset.component!==undefined||b.dataset.part!==undefined)selectPart(Number(b.dataset.component??b.dataset.part));
  else if(b.dataset.choice){choices[b.dataset.choice]=b.dataset.value;selectPart(part);}
  else if(b.dataset.elementProject)selectProject(b.dataset.elementProject,{focus:true});
 });
 root.addEventListener('keydown',e=>{const g=e.target.closest('[data-part]');if(g&&(e.key==='Enter'||e.key===' ')){e.preventDefault();selectPart(Number(g.dataset.part));}});
 render();
}
