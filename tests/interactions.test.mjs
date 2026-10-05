import {test,before} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {JSDOM} from 'jsdom';
import * as d3 from 'd3';
import {projects} from '../dist/data.js';
import {projectFacts,locations} from '../dist/editorial.js';
import {applications} from '../dist/applications-data.js';
import {mineralComparisonCSV} from '../dist/mineral-comparisons.js';
import {supplyChain, supplyPercent} from '../dist/supply-chain-data.js';
let dom,document;
const $=s=>document.querySelector(s);
const click=s=>{const el=$(s);assert(el,`Missing control ${s}`);el.click();};
const tick=()=>new Promise(resolve=>setTimeout(resolve,30));
test('supply chain selects real country shares by stage and preserves rounded zeros',()=>{
 assert.equal($('#supply-chart svg').getAttribute('data-selected-stage'),'magnets');
 assert.equal(document.querySelectorAll('.chain-dots').length,0);
 assert.deepEqual([...document.querySelectorAll('.supply-legend li')].map(el=>el.textContent),['China','Estados Unidos']);
 assert.equal(document.querySelectorAll('.supply-series').length,2);
 assert.doesNotMatch($('#cadeia').textContent,/Brasil|Demais países/);
 for(const stage of supplyChain.stages){
  click(`[data-supply-stage="${stage.id}"]`);
  assert.equal($('#supply-detail-title').textContent,stage.name);
  assert.equal($(`[data-supply-stage="${stage.id}"]`).getAttribute('aria-pressed'),'true');
  assert.equal(document.querySelectorAll('[data-supply-stage][aria-pressed="true"]').length,1);
  assert.equal($('#supply-chart svg').getAttribute('data-selected-stage'),stage.id);
  assert.equal(document.querySelectorAll('.supply-point.is-active').length,2);
  for(const [i,key] of ['china','usa'].entries()){
   const row=$(`#supply-detail [data-country="${key}"]`);
   assert(row.textContent.includes(supplyPercent(stage.values[i])));
   assert(Math.abs(Number(row.querySelector('.supply-share-bar').getAttribute('width'))-2.4*stage.values[i])<1e-9);
  }
  if(stage.values.includes(0))assert.match($('.supply-zero-note').textContent,/Não significa necessariamente ausência/);
  else assert.equal($('.supply-zero-note'),null);
  assert($('#supply-announcement').textContent.includes(stage.name));
  assert.equal(document.querySelectorAll('#supply-detail .supply-country-row').length,2);
  assert.doesNotMatch($('#supply-announcement').textContent,/Brasil|Demais países/);
 }
 assert.equal($('.supply-chart-caption'),null);
 assert.equal($('.supply-method'),null);
});
test('supply chain keyboard and direct chart selection update the same accessible state',()=>{
 const key=(selector,key)=>$(selector).dispatchEvent(new dom.window.KeyboardEvent('keydown',{key,bubbles:true,cancelable:true}));
 key('[data-supply-stage="magnets"]','Home');
 assert.equal(document.activeElement,$('[data-supply-stage="mining"]'));
 assert.equal($('#supply-chart svg').getAttribute('data-selected-stage'),'mining');
 key('[data-supply-stage="mining"]','ArrowRight');
 assert.equal(document.activeElement,$('[data-supply-stage="refining"]'));
 assert.equal($('#supply-detail-title').textContent,'Separação e refino');
 key('[data-supply-stage="refining"]','End');
 key('[data-supply-stage="magnets"]','ArrowRight');
 assert.equal(document.activeElement,$('[data-supply-stage="mining"]'));
 key('[data-supply-stage="mining"]','ArrowLeft');
 assert.equal(document.activeElement,$('[data-supply-stage="magnets"]'));
 $('[data-supply-hit="refining"]').dispatchEvent(new dom.window.MouseEvent('click',{bubbles:true}));
 assert.equal($('[data-supply-stage="refining"]').getAttribute('aria-pressed'),'true');
 assert(!$('#supply-chart svg').innerHTML.includes('NaN'));
 assert.match($('#supply-chart-desc').textContent,/China 58,9%.*Estados Unidos 9,6%/);
});
before(async()=>{
 const html=await fs.readFile(new URL('../dist/index.html',import.meta.url),'utf8');
 dom=new JSDOM(html,{url:'http://localhost:4174/',pretendToBeVisual:true});
 document=dom.window.document;
 for(const key of ['window','document','HTMLElement','SVGElement','Element'])globalThis[key]=dom.window[key];
 Object.defineProperty(globalThis,'navigator',{value:dom.window.navigator,configurable:true});
 dom.window.d3=d3;
 globalThis.matchMedia=()=>({matches:true});
 globalThis.fetch=async url=>{try{return {ok:true,json:async()=>JSON.parse(await fs.readFile(new URL('../dist/'+url,import.meta.url),'utf8'))};}catch{return {ok:false};}};
 dom.window.HTMLElement.prototype.scrollIntoView=function(){};
 if(!dom.window.HTMLDialogElement.prototype.showModal){dom.window.HTMLDialogElement.prototype.showModal=function(){this.open=true;};dom.window.HTMLDialogElement.prototype.close=function(){this.open=false;};}
 const app=await import('../dist/app.js');await app.mapInitialized;await tick();
});
test('map renders actual state and municipal geometries, with all municipal references and project records',()=>{
 assert.equal(document.querySelectorAll('.state-shape').length,27);
 assert.equal(document.querySelectorAll('.map-location').length,locations.length);
 assert.equal(document.querySelectorAll('#project-list button').length,projects.length);
 assert.equal($('.map-location.is-selected').getAttribute('aria-label'),'Serra Verde, GO. Referência municipal.');
 assert(!$('#map svg').innerHTML.includes('NaN'));
});
test('all project cards select, grouped records remain distinct, oxide units stay distinct',()=>{
 for(const {id} of projects){
  click(`#project-list [data-project="${id}"]`);
  assert.equal($(`#project-list [data-project="${id}"]`).getAttribute('aria-pressed'),'true');
  assert($('#map-inspector h3').textContent.length>0);
 }
 click('#project-list [data-project="caldeira"]');
 assert.equal($('.resource-stat .unit').textContent,'milhões de toneladas · material');
 assert.equal(document.querySelectorAll('.cluster-tabs button').length,4);
 assert.match($('.resource-stack').getAttribute('aria-label'),/703 Mt medidos e indicados; 928 Mt inferidos/);
 click('[data-select-project="morro"]');assert.match($('#map-inspector').textContent,/Quantidade não disponível/);
 click('#project-list [data-project="araxa"]');assert.match($('.resource-stat').textContent,/3,98.*TREO contidos/);
 assert.equal($('.resource-stat .unit').textContent,'milhões de toneladas · TREO contidos');
 assert.match($('.grade').textContent,/Não comparável/);
});
test('map markers select projects by pointer and keyboard without stale hover overlays',()=>{
 assert.equal($('#map-controls select'),null);
 assert.equal($('#map-note').hidden,true);assert.equal($('#map-note').textContent,'');
 const araxa=$('.map-location[aria-label^="Araxá,"]');
 araxa.focus();
 araxa.dispatchEvent(new dom.window.MouseEvent('pointermove',{bubbles:true,clientX:100,clientY:100}));
 assert.equal($('#map-tooltip').hidden,false);
 araxa.dispatchEvent(new dom.window.MouseEvent('click',{bubbles:true}));
 assert.equal($('#map-inspector h3').textContent,'Araxá');
 assert.equal($('#map-tooltip').hidden,true);
 assert.equal(document.activeElement,araxa);
 assert.equal(araxa.getAttribute('aria-pressed'),'true');
 const pitinga=$('.map-location[aria-label^="Pitinga,"]');
 pitinga.focus();
 pitinga.dispatchEvent(new dom.window.KeyboardEvent('keydown',{key:'Enter',bubbles:true}));
 assert.equal($('#map-inspector h3').textContent,'Pitinga');
 assert.equal(pitinga.getAttribute('tabindex'),'0');
 assert.equal(araxa.getAttribute('aria-pressed'),'false');
});
test('coverage shows the current snapshot and selects sheets directly on the map by pointer and keyboard',async()=>{
 click('[data-layer="coverage"]');await tick();
 assert.equal($('#map-note').hidden,false);assert.match($('#map-note').textContent,/Polígonos oficiais/);
 assert.equal(document.querySelectorAll('.coverage-sheet').length,511);
 assert.match($('.coverage-big').textContent,/28%/);
 assert.equal($('#coverage-year'),null);
 assert.equal($('#coverage-sheet-select'),null);
 assert.match($('#map-legend').textContent,/Folhas publicadas até 2025/);
 click('[data-scale="250000"]');
 assert.equal(document.querySelectorAll('.coverage-sheet').length,318);assert.match($('.coverage-big').textContent,/50%/);
 const sheets=[...document.querySelectorAll('.coverage-sheet')];
 const key=(node,key)=>node.dispatchEvent(new dom.window.KeyboardEvent('keydown',{key,bubbles:true,cancelable:true}));
 assert.equal(document.querySelectorAll('.coverage-sheet[tabindex="0"]').length,1);
 sheets[1].dispatchEvent(new dom.window.MouseEvent('pointermove',{bubbles:true,clientX:100,clientY:100}));
 sheets[1].dispatchEvent(new dom.window.MouseEvent('click',{bubbles:true}));
 assert.equal(sheets[1].getAttribute('aria-pressed'),'true');
 assert.equal($('#map-tooltip').hidden,true);
 assert.match($('#sheet-detail').textContent,/Publicado/);
 assert.equal(document.querySelectorAll('.coverage-sheet[tabindex="0"]').length,1);
 sheets[1].focus();key(sheets[1],'ArrowRight');
 assert.equal(document.activeElement,sheets[2]);
 key(sheets[2],'Enter');
 assert.equal(sheets[1].getAttribute('aria-pressed'),'false');
 assert.equal(sheets[2].getAttribute('aria-pressed'),'true');
 assert($('#sheet-detail h4').textContent.length>0);
 assert($('#announcement').textContent.includes($('#sheet-detail h4').textContent));
 key(sheets[2],'End');assert.equal(document.activeElement,sheets.at(-1));
 key(sheets.at(-1),'ArrowRight');assert.equal(document.activeElement,sheets[0]);
 key(sheets[0],' ');assert.equal(sheets[0].getAttribute('aria-pressed'),'true');
 click('[data-scale="1000000"]');assert.equal(document.querySelectorAll('.coverage-sheet').length,45);assert.equal($('.coverage-big'),null);
 assert.equal(document.querySelectorAll('.coverage-sheet[aria-pressed="true"]').length,0);
 assert.equal(document.querySelectorAll('.coverage-sheet[tabindex="0"]').length,1);
 click('[data-layer="geology"]');assert($('.geology-cutaway'));assert.equal($('.atlas-body').classList.contains('coverage-mode'),false);
 click('[data-layer="projects"]');
});
test('resource grade is converted into concentration, not inflated into recovered output',()=>{
 click('#project-list [data-project="caldeira"]');
 assert.match($('.grade-conversion').textContent,/2,317 kg de TREO/);
 assert.match($('.grade-strip').getAttribute('aria-label'),/0,2317.*zero a 1/);
 assert(Math.abs(parseFloat($('.grade-strip span').style.width)-23.17)<0.001);
});
test('new resources keep their source classes, dates and high-grade scales readable',()=>{
 assert.equal($('#project-count').textContent,'EXPLORE OS 16 REGISTROS');
 for(const id of ['ema','tiros','caladao','pch','montealto','sulista','alpha','constellation','itarantim']){
  click(`#project-list [data-project="${id}"]`);
  assert.equal($('#map-inspector h3').textContent,projectFacts[id].short);
  assert.equal($('.resource-stat .unit').textContent,'milhões de toneladas · material');
  const width=parseFloat($('.grade-strip span').style.width);assert(width>0&&width<=100);
  click(`[data-project-full="${id}"]`);
  assert($('#dialog-content').textContent.includes(projects.find(p=>p.id===id).resource));
  assert($('#dialog-content a').href.startsWith('https://'));click('.dialog-close');
 }
 click('#project-list [data-project="montealto"]');
 assert.match($('.grade-strip').getAttribute('aria-label'),/11,26.*zero a 20/);
 assert(Math.abs(parseFloat($('.grade-strip span').style.width)-56.3)<.001);
 assert.match($('.grade-conversion').textContent,/112,6 kg/);
 click('#project-list [data-project="alpha"]');assert.equal($('.resource-stack'),null);assert.match($('.resource-note').textContent,/inferidos/);
 click('#project-list [data-project="constellation"]');
 assert.equal(document.querySelectorAll('.cluster-tabs button').length,4);
 click('[data-select-project="caldeira"]');assert.equal($('#map-inspector h3').textContent,'Caldeira');
});
test('project and element dialogs contain traceable details and can be closed',()=>{
 click('[data-project-full="caldeira"]');assert.equal($('#detail-dialog').open,true);assert.match($('#dialog-content').textContent,/Não há decomposição da quantidade por elemento/);assert($('#dialog-content a').href.startsWith('https://'));
 click('.dialog-close');assert.equal($('#detail-dialog').open,false);
 click('[data-element-detail="Nd"]');assert.match($('#dialog-title').textContent,/Neodímio/);click('.dialog-close');
});
test('reserve and production controls preserve their data after removing revision controls',async()=>{
 assert.equal($('#reserve-edition'),null);assert.equal($('.revision'),null);
 assert.equal($('#comparison-caption').hidden,true);
 assert.match($('#comparison-takeaway').textContent,/estimativa histórica/);
 click('[data-comparison="production"]');assert.match($('#comparison-takeaway').textContent,/0,5%/);assert.match($('#country-chart svg').getAttribute('aria-label'),/Brasil: 2.000 t/);
 click('[data-comparison="reserve"]');assert.match($('#country-chart svg').getAttribute('aria-label'),/Brasil: 21/);
 await tick();assert.equal(document.querySelectorAll('#country-chart .data-row').length,4);
});
test('item selection shows all its materials and uses without component controls',()=>{
 assert.equal(document.querySelector('.applications-explorer svg'),null);
 assert.equal($('.application-footnote>p'),null);
 assert.equal(document.querySelector('.applications-explorer [data-part], .applications-explorer [data-component], .applications-explorer [data-choice]'),null);
 assert(!$('.applications-explorer').textContent.includes('Também nesta peça'));
 for(const app of applications){
  const button=$(`[data-tech="${app.id}"]`);button.focus();button.click();
  assert.equal(document.activeElement,button);assert.equal(button.getAttribute('aria-pressed'),'true');
  assert.equal(document.querySelectorAll('[data-tech][aria-pressed="true"]').length,1);
  assert.equal($('#application-title').textContent,app.name);
  assert.equal(document.querySelectorAll('#application-materials .application-material').length,app.materials.length);
  assert.equal($('#detail-dialog').open,false);
  for(const material of app.materials){
   const card=$(`#application-materials [data-element-detail="${material.symbol}"], #application-materials [data-mineral-detail="${material.symbol}"]`);
   assert(card);assert.match(card.textContent,new RegExp(material.use));assert(card.textContent.includes(material.description));
  }
  assert($('#application-sources a').href.startsWith('https://'));
 }
 click('[data-tech="ev"]');
 assert.equal(document.querySelectorAll('#application-materials .rare').length,4);
 assert($('#application-materials [data-element-detail="Nd"]'));
 assert($('#application-materials [data-mineral-detail="Co"]'));
 assert($('#application-materials [data-mineral-detail="Cu"]'));
 assert.match($('#application-materials [data-mineral-detail="Ni"]').textContent,/NMC.*LFP/);
 assert.equal($('[data-tech="solar"]'),null);
});
test('material cards open the correct sourced profile and can navigate to project records',()=>{
 click('[data-tech="ev"]');click('#application-materials [data-element-detail="Pr"]');
 assert.equal($('#dialog-title').textContent,'Praseodímio');assert($('#dialog-content a').href.startsWith('https://'));
 click('[data-dialog-project="araxa"]');assert.equal($('#detail-dialog').open,false);assert.equal($('#map-inspector h3').textContent,'Araxá');
 click('#application-materials [data-mineral-detail="Cu"]');assert.equal($('#dialog-title').textContent,'Cobre');click('.dialog-close');
 assert.equal($('#application-title').textContent,'Carro elétrico');
});
test('the optional reference preserves all 17 elements without changing the selected item',()=>{
 const reference=$('.rare-earth-library');assert.equal(reference.open,false);reference.open=true;
 const buttons=[...document.querySelectorAll('#rare-earth-reference button')];assert.equal(buttons.length,17);
 for(const button of buttons){button.click();assert($('#dialog-title').textContent.length>0);click('.dialog-close');}
 click('#rare-earth-reference [data-element-detail="Pm"]');assert.match($('#dialog-content').textContent,/Não integra uma cadeia mineral comum/);assert.match($('#dialog-content').textContent,/Não individualizado/);click('.dialog-close');
 assert.equal($('#application-title').textContent,'Carro elétrico');reference.open=false;
});
test('mineral tiles update production and reserves together without opening a dialog',async()=>{
 assert.equal($('#outros-minerais select'),null);
 assert.equal($('#outros-minerais').nextElementSibling.id,'cadeia');
 assert.deepEqual([...document.querySelectorAll('#mineral-grid [data-mineral]')].map(tile=>tile.dataset.mineral),['Nb','ETR','Li','C','Ni','Mn','Si','Ta','V','Cu','Fe','Al']);
 assert.equal($('#mineral-count').textContent,'12 PERFIS · PRODUÇÃO E RESERVAS');
 for(const tile of document.querySelectorAll('#mineral-grid [data-mineral]')){
  tile.focus();tile.click();
  assert.equal(tile.getAttribute('aria-pressed'),'true');assert.equal(document.activeElement,tile);
  assert.equal(document.querySelectorAll('#mineral-grid [aria-pressed="true"]').length,1);
  assert.equal($('#detail-dialog').open,false);
  for(const type of ['production','reserve']){
   assert.equal(document.querySelectorAll(`#${type}-chart .data-row`).length,3);
   assert($(`#${type}-chart svg`).getAttribute('aria-label').length>0);
   assert(!$(`#${type}-chart svg`).innerHTML.includes('NaN'));
   assert($(`#${type}-source a`).getAttribute('href'));
  }
 }
 click('[data-mineral="Li"]');assert.match($('#production-chart svg').getAttribute('aria-label'),/Dado sigiloso \(W\)/);assert.match($('#reserve-chart svg').getAttribute('aria-label'),/Brasil: 540.000 t de Li/);
 click('[data-mineral="Nb"]');assert.match($('#production-chart svg').getAttribute('aria-label'),/Estados Unidos: 0 t de Nb/);assert.match($('#reserve-chart svg').getAttribute('aria-label'),/Brasil: 14 Mt de Nb/);assert.match($('#reserve-chart svg').getAttribute('aria-label'),/China: Fora deste recorte/);
 assert.equal($('#production-note').hidden,true);assert.equal($('#reserve-note').hidden,true);
 assert.equal($('#production-note').textContent,'');assert.equal($('#reserve-note').textContent,'');
 click('[data-mineral="ETR"]');assert.match($('#reserve-period').textContent,/HISTÓRICO/);assert.equal($('#reserve-note').textContent,'');assert.equal($('#reserve-note').hidden,true);
 click('[data-mineral="Si"]');assert.match($('#reserve-note').textContent,/Não há um total de reservas comparável/);assert.equal(document.querySelectorAll('#reserve-chart .chart-grid text').length,0);
 await tick();assert([...document.querySelectorAll('#reserve-chart .data-bar')].every(b=>Number(b.getAttribute('width'))===0));
 click('[data-mineral="V"]');click('#mineral-profile');assert.equal($('#dialog-title').textContent,'Vanádio');click('.dialog-close');
});
test('comparison CSV exports both selected series with nulls, zero and provenance intact',()=>{
 const lithium=mineralComparisonCSV('Li');
 assert.equal(lithium.split('\r\n').length,7);
 assert.match(lithium,/Lítio · produção/);assert.match(lithium,/Lítio · reservas/);
 assert.match(lithium,/"Estados Unidos";"Lítio · produção";"";"t de Li contido";"Dado sigiloso \(W\)"/);
 assert.match(mineralComparisonCSV('Nb'),/"Estados Unidos";"Nióbio · produção";"0"/);
 assert.match(mineralComparisonCSV('U'),/Recursos não são reservas/);
 assert.match(lithium,/https:\/\/pubs.usgs.gov/);
});
