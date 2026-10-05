import {rareEarths,sources} from './data.js';
import {applications,applicationSourceKeys} from './applications-data.js';
import {applicationIcon} from './application-icons.js';

export function initApplications(){
 const root=document.querySelector('.applications-explorer');
 const $=selector=>root.querySelector(selector);
 const sourceLink=key=>`<a class="source-link" href="${sources[key].url}" target="_blank" rel="noopener">${key==='reeeduca'?'SGB · elementos e usos':sources[key].name} ↗</a>`;
 let selected='phone';
 $('#application-total').textContent=`${applications.length} APLICAÇÕES PARA EXPLORAR`;
 $('#application-nav').innerHTML=applications.map(a=>`<button type="button" data-tech="${a.id}" aria-pressed="false" aria-controls="application-materials application-title application-sources">${applicationIcon(a.id)}<span class="application-label">${a.name}</span></button>`).join('');
 function render(){
  const app=applications.find(a=>a.id===selected);
  root.querySelectorAll('[data-tech]').forEach(button=>{
   const active=button.dataset.tech===selected;
   button.classList.toggle('active',active);button.setAttribute('aria-pressed',String(active));
  });
  $('#application-kicker').textContent=app.category;
  $('#application-title').textContent=app.name;
  $('#application-summary').textContent=app.summary;
  const rareCount=app.materials.length;
  $('#application-count').innerHTML=`<strong>${rareCount}</strong><span>${rareCount===1?'terra rara neste recorte':'terras raras neste recorte'}<small>Usos documentados</small></span>`;
  $('#application-materials').innerHTML=app.materials.map(material=>{
   const e=rareEarths.find(e=>e[0]===material.symbol);
   const name=e[2];
   return `<button class="application-material rare" data-application="${app.id}" data-element-detail="${material.symbol}" aria-label="${name}: ${material.description}${material.scope?` ${material.scope}.`:''} Abrir ficha e fontes."><span class="material-symbol"><small>${e[1]}</small><strong>${material.symbol}</strong></span><span class="material-copy"><span class="material-use">${material.use}</span><strong>${name}<span aria-hidden="true">↗</span></strong><span class="material-description">${material.description}</span>${material.scope?`<span class="material-scope">${material.scope}</span>`:''}</span></button>`;
  }).join('');
  $('#application-note').textContent=app.note??'';
  $('#application-note').hidden=!app.note;
  $('#application-sources').innerHTML=applicationSourceKeys(app).map(sourceLink).join('');
  $('#application-announcement').textContent=`${app.name}: ${rareCount} ${rareCount===1?'terra rara exibida':'terras raras exibidas'}.`;
 }
 function selectApplication(button){
  if(!button||button.dataset.tech===selected)return;
  selected=button.dataset.tech;render();
  const overview=$('.application-overview');
  if(overview.getBoundingClientRect().top<$('#application-nav').getBoundingClientRect().bottom)overview.scrollIntoView({block:'start',behavior:'auto'});
 }
 $('#application-nav').addEventListener('click',event=>selectApplication(event.target.closest('[data-tech]')));
 $('#application-nav').addEventListener('keydown',event=>{
  const current=event.target.closest('[data-tech]');
  if(!current||!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;
  event.preventDefault();
  const buttons=[...root.querySelectorAll('[data-tech]')],index=buttons.indexOf(current);
  const next=event.key==='Home'?0:event.key==='End'?buttons.length-1:(index+(event.key==='ArrowRight'?1:-1)+buttons.length)%buttons.length;
  const button=buttons[next];button.focus({preventScroll:true});
  button.scrollIntoView({block:'nearest',inline:'nearest',behavior:'auto'});
  selectApplication(button);
 });
 const setNavHeight=()=>root.style.setProperty('--application-nav-height',`${$('#application-nav').getBoundingClientRect().height}px`);
 setNavHeight();
 if(typeof ResizeObserver!=='undefined')new ResizeObserver(setNavHeight).observe($('#application-nav'));
 render();
}
