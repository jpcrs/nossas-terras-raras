import {test,before} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {JSDOM} from 'jsdom';
import * as d3 from 'd3';
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
test('technology choices change materials instead of implying every technology uses rare earths',()=>{
 change('#motor-type','induction');assert.equal($('#tech-detail [data-element-detail="Nd"]'),null);assert.match($('#tech-detail').textContent,/dispensar ímãs/);
 change('#battery-type','lfp');assert.equal($('#tech-detail [data-mineral-detail="Ni"]'),null);assert.match($('#tech-detail').textContent,/Não depende de níquel/);
 click('[data-tech="wind"]');assert.match($('#tech-detail h3').textContent,/Gerador/);
 click('[data-tech="solar"]');assert.match($('#tech-detail h3').textContent,/Células/);assert($('#tech-detail [data-mineral-detail="Si"]'));
 click('[data-component="3"]');assert.equal($('#tech-detail h3').textContent,'Moldura');
});
test('all indicators render, while undisclosed, zero and wholly missing data remain distinct',()=>{
 for(const o of $('#metric-select').options){change('#metric-select',o.value);assert($('#metric-chart svg').getAttribute('aria-label').length>0);}
 change('#metric-select','li-p');assert.match($('#metric-chart svg').getAttribute('aria-label'),/Dado sigiloso \(W\)/);
 change('#metric-select','nb-p');assert.match($('#metric-chart svg').getAttribute('aria-label'),/Estados Unidos: 0 t de Nb/);
 change('#metric-select','u-res');assert.equal(document.querySelectorAll('#metric-chart .data-row').length,3);assert.equal($('#metric-chart svg').getAttribute('aria-label').includes('NaN'),false);
});
