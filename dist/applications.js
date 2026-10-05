import {rareEarths,minerals,sources} from './data.js';
import {applications} from './applications-data.js';

export function initApplications(){
 const root=document.querySelector('.applications-explorer');
 const $=selector=>root.querySelector(selector);
 const isRare=symbol=>rareEarths.some(e=>e[0]===symbol);
 const sourceLink=key=>`<a class="source-link" href="${sources[key].url}" target="_blank" rel="noopener">${key==='reeeduca'?'SGB · elementos e usos':'DOE · materiais e tecnologias'} ↗</a>`;
 let selected='ev';
 $('#application-nav').innerHTML=applications.map(a=>`<button data-tech="${a.id}" aria-pressed="false" aria-controls="application-materials">${a.name}</button>`).join('');
 function render(){
  const app=applications.find(a=>a.id===selected);
  root.querySelectorAll('[data-tech]').forEach(button=>{
   const active=button.dataset.tech===selected;
   button.classList.toggle('active',active);button.setAttribute('aria-pressed',String(active));
  });
  $('#application-kicker').textContent=app.category;
  $('#application-title').textContent=app.name;
  $('#application-summary').textContent=app.summary;
  const rareCount=app.materials.filter(m=>isRare(m.symbol)).length;
  $('#application-count').innerHTML=`<strong>${app.materials.length}</strong><span>${app.materials.length===1?'material neste recorte':'materiais neste recorte'}<small>${rareCount?`${rareCount} ${rareCount===1?'terra rara':'terras raras'}`:'Nenhuma terra rara neste exemplo'}</small></span>`;
  $('#application-materials').innerHTML=app.materials.map(material=>{
   const e=rareEarths.find(e=>e[0]===material.symbol),m=minerals.find(m=>m.symbol===material.symbol);
   const name=e?.[2]??(material.symbol==='Al'?'Alumínio':m.name);
   return `<button class="application-material ${e?'rare':''}" ${e?'data-element-detail':'data-mineral-detail'}="${material.symbol}" aria-label="${name}: ${material.description} Abrir ficha e fontes."><span class="material-symbol"><small>${e?.[1]??m.number}</small><strong>${material.symbol}</strong></span><span class="material-copy"><span class="material-use">${material.use}</span><strong>${name}<span aria-hidden="true">↗</span></strong><span class="material-description">${material.description}</span></span></button>`;
  }).join('');
  $('#application-note').textContent=app.note??'';
  $('#application-note').hidden=!app.note;
  $('#application-sources').innerHTML=[...new Set(['reeeduca',app.source])].map(sourceLink).join('');
  $('#application-announcement').textContent=`${app.name}: ${app.materials.length} ${app.materials.length===1?'material exibido':'materiais exibidos'}, ${rareCount} ${rareCount===1?'terra rara':'terras raras'}.`;
 }
 $('#application-nav').addEventListener('click',event=>{
  const button=event.target.closest('[data-tech]');if(!button||button.dataset.tech===selected)return;
  selected=button.dataset.tech;render();
  const overview=$('.application-overview');
  if(overview.getBoundingClientRect().top<$('#application-nav').getBoundingClientRect().bottom)overview.scrollIntoView({block:'start',behavior:'auto'});
 });
 render();
}
