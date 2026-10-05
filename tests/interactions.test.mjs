import {test,before} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {JSDOM} from 'jsdom';
import * as d3 from 'd3';
import {mineralComparisonCSV} from '../dist/mineral-comparisons.js';
let dom,document;
const $=s=>document.querySelector(s);
const click=s=>{const el=$(s);assert(el,`Missing control ${s}`);el.click();};
const change=(s,value,event='change')=>{const el=$(s);assert(el,`Missing control ${s}`);el.value=value;el.dispatchEvent(new dom.window.Event(event,{bubbles:true}));};
const tick=()=>new Promise(resolve=>setTimeout(resolve,30));
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
test('map renders actual state and municipal geometries, with five references for seven project records',()=>{
 assert.equal(document.querySelectorAll('.state-shape').length,27);
 assert.equal(document.querySelectorAll('.map-location').length,5);
 assert.equal(document.querySelectorAll('#project-list button').length,7);
 assert.equal($('.map-location.is-selected').getAttribute('aria-label'),'Serra Verde, GO. Referência municipal.');
 assert(!$('#map svg').innerHTML.includes('NaN'));
});
test('all seven project cards select, grouped records remain distinct, oxide units stay distinct',()=>{
 for(const id of ['pitinga','morro','colossus','carina','araxa','caldeira','serra']){
  click(`#project-list [data-project="${id}"]`);
  assert.equal($(`#project-list [data-project="${id}"]`).getAttribute('aria-pressed'),'true');
  assert($('#map-inspector h3').textContent.length>0);
 }
 click('#project-list [data-project="caldeira"]');
 assert.equal(document.querySelectorAll('.cluster-tabs button').length,3);
 assert.match($('.resource-stack').getAttribute('aria-label'),/703 Mt medidos e indicados; 928 Mt inferidos/);
 click('[data-select-project="morro"]');assert.match($('#map-inspector').textContent,/Quantidade não disponível/);
 click('#project-list [data-project="araxa"]');assert.match($('.resource-stat').textContent,/3,98.*TREO contidos/);
 assert.match($('.grade').textContent,/Não comparável/);
});
test('map markers select projects by pointer and keyboard without stale hover overlays',()=>{
 assert.equal($('#map-controls select'),null);
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
test('coverage uses official polygons, filters scale and year, and exposes source metadata',async()=>{
 click('[data-layer="coverage"]');await tick();
 assert.equal(document.querySelectorAll('.coverage-sheet').length,511);
 assert.match($('.coverage-big').textContent,/28%/);
 change('#coverage-year','1969','input');assert.equal(document.querySelectorAll('.coverage-sheet').length,0);
 assert.match($('.coverage-big').textContent,/28%/,'national 2025 figure must stay separate from the historical vector filter');
 change('#coverage-year','2025','input');click('[data-scale="250000"]');
 assert.equal(document.querySelectorAll('.coverage-sheet').length,318);assert.match($('.coverage-big').textContent,/50%/);
 const options=[...$('#coverage-sheet-select').options];assert(options.every(o=>o.textContent.trim()&&!/^·/.test(o.textContent.trim())));
 change('#coverage-sheet-select',options[1].value);assert.match($('#sheet-detail').textContent,/Publicado/);
 click('[data-scale="1000000"]');assert.equal(document.querySelectorAll('.coverage-sheet').length,45);assert.equal($('.coverage-big'),null);
 click('[data-layer="geology"]');assert($('.geology-cutaway'));assert.equal($('.atlas-body').classList.contains('coverage-mode'),false);
 click('[data-layer="projects"]');
});
test('resource grade is converted into concentration, not inflated into recovered output',()=>{
 click('#project-list [data-project="caldeira"]');
 assert.match($('.grade-conversion').textContent,/2,317 kg de TREO/);
 assert.match($('.grade-strip').getAttribute('aria-label'),/0,2317.*zero a um/);
 assert(Math.abs(parseFloat($('.grade-strip span').style.width)-23.17)<0.001);
});
test('project and element dialogs contain traceable details and can be closed',()=>{
 click('[data-project-full="caldeira"]');assert.equal($('#detail-dialog').open,true);assert.match($('#dialog-content').textContent,/Não há decomposição da quantidade por elemento/);assert($('#dialog-content a').href.startsWith('https://'));
 click('.dialog-close');assert.equal($('#detail-dialog').open,false);
 click('[data-element-detail="Nd"]');assert.match($('#dialog-title').textContent,/Neodímio/);click('.dialog-close');
});
test('reserve editions and production switch actual chart data and disclosures',async()=>{
 change('#reserve-edition','revised');assert.match($('#comparison-takeaway').textContent,/11 Mt/);assert.match($('#country-chart svg').getAttribute('aria-label'),/Brasil: 11/);
 click('[data-comparison="production"]');assert.match($('#comparison-takeaway').textContent,/0,5%/);assert.match($('#country-chart svg').getAttribute('aria-label'),/Brasil: 2.000 t/);
 click('[data-comparison="reserve"]');change('#reserve-edition','historical');assert.match($('#country-chart svg').getAttribute('aria-label'),/Brasil: 21/);
 await tick();assert.equal(document.querySelectorAll('#country-chart .data-row').length,4);
});
test('all rare earth elements retain their own applications and map links',()=>{
 for(const b of document.querySelectorAll('[data-element]')){b.click();assert.equal(b.getAttribute('aria-pressed'),'true');assert($('#element-detail h3').textContent.length>0);}
 click('[data-element="Pm"]');assert.match($('#element-detail').textContent,/Não individualizado/);
 click('[data-element="Nd"]');click('[data-element-project="araxa"]');assert.equal($('#map-inspector h3').textContent,'Araxá');
});
test('element and application selections stay connected, including cases with no rare earths',()=>{
 click('[data-element="Er"]');assert.equal($('#application-title').textContent,'Fibra óptica');assert.equal($('#tech-detail h4').textContent,'Amplificação óptica');
 assert.equal($('#periodic-grid [data-element="Er"]').classList.contains('related'),true);
 click('[data-element="Eu"]');assert.equal($('#application-title').textContent,'Telas e vidros');assert.equal($('#tech-detail h4').textContent,'Fósforos');
 click('[data-element="Pm"]');assert.equal(document.querySelectorAll('[data-tech][aria-pressed="true"]').length,0);assert.equal(document.querySelectorAll('[data-part]').length,0);assert.match($('#tech-detail').textContent,/não integra uma cadeia mineral comum/);
 click('[data-tech="ev"]');assert.equal($('#tech-detail h4').textContent,'Motor');assert.equal($('#periodic-grid [data-element="Nd"]').getAttribute('aria-pressed'),'true');
 click('[data-choice="motor"][data-value="induction"]');assert.equal($('#tech-detail [data-material="Nd"]'),null);assert.match($('#tech-detail').textContent,/dispensar ímãs/);assert.equal(document.querySelectorAll('#periodic-grid .related').length,0);
 click('[data-element="Dy"]');assert.equal($('[data-choice="motor"][data-value="magnet"]').getAttribute('aria-pressed'),'true');assert.equal($('#tech-detail [data-material="Dy"]').getAttribute('aria-pressed'),'true');
 click('[data-component="1"]');assert($('#tech-detail [data-mineral-detail="Co"]'));
 click('[data-choice="battery"][data-value="lfp"]');assert.equal($('#tech-detail [data-mineral-detail="Ni"]'),null);assert.equal($('#tech-detail [data-mineral-detail="Co"]'),null);assert.match($('#tech-detail').textContent,/Não depende de níquel/);
 click('[data-tech="wind"]');assert.equal($('#tech-detail h4').textContent,'Gerador');
 click('[data-choice="motor"][data-value="induction"]');assert.equal(document.querySelectorAll('#tech-detail [data-material]').length,0);
 click('[data-tech="solar"]');assert.equal($('#tech-detail h4').textContent,'Células');assert($('#tech-detail [data-mineral-detail="Si"]'));assert.equal(document.querySelectorAll('#periodic-grid .related').length,0);
 click('[data-component="3"]');assert.equal($('#tech-detail h4').textContent,'Moldura');
});
test('illustrated components work by pointer and keyboard, preserve focus, and expose material sources',()=>{
 for(const tech of ['ev','wind','optics','fiber','laser','alloys','special','solar']){
  click(`[data-tech="${tech}"]`);
  const count=document.querySelectorAll('[data-component]').length;
  for(let i=0;i<count;i++){
   const shape=$(`[data-part="${i}"]`);shape.focus();shape.dispatchEvent(new dom.window.KeyboardEvent('keydown',{key:'Enter',bubbles:true}));
   assert.equal(document.activeElement.dataset.part,String(i));assert.equal($(`[data-part="${i}"]`).getAttribute('aria-pressed'),'true');assert.equal($(`[data-component="${i}"]`).getAttribute('aria-pressed'),'true');
  }
  assert($('#application-sources a').href.startsWith('https://'));
 }
 click('[data-tech="ev"]');const structure=$('[data-part="0"]');structure.dispatchEvent(new dom.window.MouseEvent('click',{bubbles:true}));assert.equal($('#tech-detail h4').textContent,'Estrutura');
 click('[data-component="2"]');click('[data-choice="motor"][data-value="magnet"]');click('[data-material="Pr"]');assert.equal($('#element-detail h3').textContent,'Praseodímio');
 click('#element-detail [data-element-detail="Pr"]');assert.equal($('#dialog-title').textContent,'Praseodímio');click('.dialog-close');
 click('[data-element-project="araxa"]');assert.equal($('#map-inspector h3').textContent,'Araxá');
});
test('mineral tiles update production and reserves together without opening a dialog',async()=>{
 assert.equal($('#outros-minerais select'),null);
 assert.equal($('#outros-minerais').nextElementSibling.id,'cadeia');
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
 click('[data-mineral="ETR"]');assert.match($('#reserve-period').textContent,/HISTÓRICO/);assert.match($('#reserve-note').textContent,/anterior à revisão/);
 click('[data-mineral="U"]');assert.match($('#reserve-note').textContent,/Recursos não são reservas/);assert.equal(document.querySelectorAll('#reserve-chart .chart-grid text').length,0);
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
