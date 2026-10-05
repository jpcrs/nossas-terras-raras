import {test,before} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {JSDOM} from 'jsdom';
import * as d3 from 'd3';
import {projects} from '../dist/data.js';
import {projectFacts,locations} from '../dist/editorial.js';
import {applications,applicationSourceKeys,materialSourceKeys} from '../dist/applications-data.js';
import {sources} from '../dist/data.js';
import {mineralComparisonCSV} from '../dist/mineral-comparisons.js';
import {supplyChain, supplyPercent} from '../dist/supply-chain-data.js';
let dom,document;
const $=s=>document.querySelector(s);
const click=s=>{const el=$(s);assert(el,`Missing control ${s}`);el.click();};
const tick=()=>new Promise(resolve=>setTimeout(resolve,30));
const selectOnMap=id=>{
 const location=locations.find(l=>l.ids.includes(id));assert(location,`Missing location for ${id}`);
 const marker=$(`.map-location[aria-label^="${location.label},"]`);assert(marker);
 marker.dispatchEvent(new dom.window.MouseEvent('click',{bubbles:true}));
 if(location.ids.length>1)click(`[data-select-project="${id}"]`);
 assert.equal(marker.getAttribute('aria-pressed'),'true');
 assert.equal($('#map-inspector h3').textContent,projectFacts[id].short);
};
test('mobile navigation dismisses with Escape, outside clicks and section selection, preserving keyboard focus',()=>{
 const toggle=$('.nav-toggle'),nav=$('#primary-navigation');
 assert.equal(toggle.hidden,false);
 assert.equal(toggle.getAttribute('aria-expanded'),'false');
 click('.nav-toggle');
 assert.equal(toggle.getAttribute('aria-expanded'),'true');
 assert.equal(toggle.getAttribute('aria-label'),'Fechar menu');
 nav.querySelector('a').focus();
 nav.dispatchEvent(new dom.window.KeyboardEvent('keydown',{key:'Escape',bubbles:true,cancelable:true}));
 assert.equal(toggle.getAttribute('aria-expanded'),'false');
 assert.equal(document.activeElement,toggle);
 click('.nav-toggle');click('#title');
 assert.equal(toggle.getAttribute('aria-expanded'),'false');
 click('.nav-toggle');click('#primary-navigation a[href="#dependencia"]');
 assert.equal(toggle.getAttribute('aria-expanded'),'false');
 assert.equal(document.activeElement,$('#dependencia'));
 toggle.focus();
 assert.equal($('#dependencia').hasAttribute('tabindex'),false);
 click('.nav-toggle');nav.querySelector('a').focus();
 $('footer a').focus();
 assert.equal(toggle.getAttribute('aria-expanded'),'false');
 assert.deepEqual([...nav.querySelectorAll('a')].map(a=>a.hash),['#explorar','#elementos','#cadeia','#dependencia','#dimensao','#futuro','#fontes']);
});
test('US year selection updates import dependence while preserving the distinct supplier period',()=>{
 assert.equal($('#cadeia').nextElementSibling.id,'dependencia');
 assert.equal($('#dependencia').nextElementSibling.id,'dimensao');
 assert(document.querySelector('.masthead a[href="#dependencia"]'));
 assert.match($('#futuro .section-heading').textContent,/06 —/);
 const suppliers=$('#us-origin-chart').innerHTML;
 assert.equal($('#us-origin-period').textContent,'2021–2024');
 assert.equal($('#us-reliance .us-waffle').querySelectorAll('.is-imported').length,67);
 assert.match($('#us-import-totals').textContent,/21mil t/);
 click('[data-us-year="2024"]');
 assert.equal($('#us-reliance .us-waffle').querySelectorAll('span').length,100);
 assert.equal($('#us-reliance .us-waffle').querySelectorAll('.is-imported').length,53);
 assert.match($('#us-import-totals').textContent,/8,12mil t/);
 assert.match($('#us-import-totals').textContent,/168/);
 assert.match($('#us-consumption-note').textContent,/9\.010/);
 assert.equal($('#us-origin-chart').innerHTML,suppliers);
 $('[data-us-year="2024"]').dispatchEvent(new dom.window.KeyboardEvent('keydown',{key:'ArrowRight',bubbles:true,cancelable:true}));
 assert.equal(document.activeElement,$('[data-us-year="2025"]'));
 assert.equal($('[data-us-year="2025"]').getAttribute('aria-pressed'),'true');
 assert.match($('#us-announcement').textContent,/2025: dependência líquida de 67%/);
 assert.match($('#us-reliance .us-waffle').getAttribute('aria-label'),/67%.*2025/);
 assert.equal($('#us-origin-chart').innerHTML,suppliers);
 assert.match($('.us-risk').textContent,/potenciais sob controles integrais/);
 assert.match($('.us-method').textContent,/não uma perda já ocorrida/);
 assert.equal($('#us-import-source').getAttribute('href'),sources.usgsImports.url);
});
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
test('future demand uses sourced oxide endpoints and proportional bars without unrelated scenarios',()=>{
 assert.equal($('#dimensao').nextElementSibling.id,'futuro');
 assert.equal($('#dependencia').nextElementSibling.id,'dimensao');
 assert.match($('#futuro .section-heading').textContent,/06 —/);
 assert.match($('#dimensao .section-heading').textContent,/05 —/);
 assert.match($('#dependencia .section-heading').textContent,/04 —/);
 const bars=[...document.querySelectorAll('.future-bar')];
 assert.deepEqual(bars.map(bar=>[bar.dataset.year,bar.dataset.status]),[['2024','estimate'],['2040','projection']]);
 assert.deepEqual(bars.map(bar=>bar.querySelector('.future-total-label').textContent),['234','607']);
 assert.deepEqual(bars.map(bar=>bar.querySelector('.future-status').textContent),['ESTIMATIVA','PROJEÇÃO']);
 const heights=bars.map(bar=>Number(bar.querySelector('rect').getAttribute('height')));
 assert(Math.abs(heights[1]/heights[0]-607/234)<1e-9);
 const bottoms=bars.map((bar,i)=>Number(bar.querySelector('rect').getAttribute('y'))+heights[i]);
 assert.equal(bottoms[0],bottoms[1]);
 assert.equal($('.future-multiplier').textContent,'2,6×');
 assert.equal($('.future-total-growth strong').textContent,'+159%');
 assert.match($('.future-additional').textContent,/373 mil t/);
 assert.match($('#future-chart-desc').textContent,/234 mil toneladas de óxidos de terras raras em 2024.*607 mil toneladas em 2040/);
 assert.match($('.future-chart-unit').textContent,/Mil toneladas por ano.*TREO/);
 assert.equal($('#future-source').href,sources.adamasFuture.url);
 assert.equal(document.querySelectorAll('[data-future-scenario], .future-clean-bar').length,0);
 assert(!$('#future-chart svg').innerHTML.includes('NaN'));
 assert.equal(document.querySelectorAll('#future-drivers article a[href^="https://"]').length,3);
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
 assert.equal($('#project-list'),null);
 assert.equal($('.project-strip'),null);
 assert.match($('#map-scope-note').textContent,/não um inventário completo das reservas do Brasil/);
 assert.equal($('#map-scope-note').hidden,false);
 assert.equal($('.map-location.is-selected').getAttribute('aria-label'),'Serra Verde, GO. Referência municipal.');
 assert(!$('#map svg').innerHTML.includes('NaN'));
});
test('all projects select through the map, grouped records remain distinct, oxide units stay distinct',()=>{
 for(const {id} of projects){
  selectOnMap(id);
  assert($('#map-inspector h3').textContent.length>0);
 }
 selectOnMap('caldeira');
 assert.equal($('.resource-stat .unit').textContent,'milhões de toneladas · material');
 assert.equal(document.querySelectorAll('.cluster-tabs button').length,4);
 assert.match($('.resource-stack').getAttribute('aria-label'),/703 Mt medidos e indicados; 928 Mt inferidos/);
 click('[data-select-project="morro"]');assert.match($('#map-inspector').textContent,/Quantidade não disponível/);
 selectOnMap('araxa');assert.match($('.resource-stat').textContent,/3,98.*TREO contidos/);
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
 selectOnMap('caldeira');
 assert.match($('.grade-conversion').textContent,/2,317 kg de TREO/);
 assert.match($('.grade-strip').getAttribute('aria-label'),/0,2317.*zero a 1/);
 assert(Math.abs(parseFloat($('.grade-strip span').style.width)-23.17)<0.001);
});
test('new resources keep their source classes, dates and high-grade scales readable',()=>{
 for(const id of ['ema','tiros','caladao','pch','montealto','sulista','alpha','constellation','itarantim']){
  selectOnMap(id);
  assert.equal($('#map-inspector h3').textContent,projectFacts[id].short);
  assert.equal($('.resource-stat .unit').textContent,'milhões de toneladas · material');
  const width=parseFloat($('.grade-strip span').style.width);assert(width>0&&width<=100);
  click(`[data-project-full="${id}"]`);
  assert($('#dialog-content').textContent.includes(projects.find(p=>p.id===id).resource));
  assert($('#dialog-content a').href.startsWith('https://'));click('.dialog-close');
 }
 selectOnMap('montealto');
 assert.match($('.grade-strip').getAttribute('aria-label'),/11,26.*zero a 20/);
 assert(Math.abs(parseFloat($('.grade-strip span').style.width)-56.3)<.001);
 assert.match($('.grade-conversion').textContent,/112,6 kg/);
 selectOnMap('alpha');assert.equal($('.resource-stack'),null);assert.match($('.resource-note').textContent,/inferidos/);
 selectOnMap('constellation');
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
 assert.equal(document.querySelectorAll('#application-nav svg[aria-hidden="true"]').length,15);
 assert.equal($('.application-footnote>p'),null);
 assert.equal(document.querySelector('.applications-explorer [data-part], .applications-explorer [data-component], .applications-explorer [data-choice]'),null);
 assert(!$('.applications-explorer').textContent.includes('Também nesta peça'));
 for(const app of applications){
  const button=$(`[data-tech="${app.id}"]`);button.focus();
  assert.equal(button.textContent,app.name);
  button.querySelector('svg').dispatchEvent(new dom.window.MouseEvent('click',{bubbles:true}));
  assert.equal(document.activeElement,button);assert.equal(button.getAttribute('aria-pressed'),'true');
  assert.equal(document.querySelectorAll('[data-tech][aria-pressed="true"]').length,1);
  assert.equal($('#application-title').textContent,app.name);
  assert.equal(document.querySelectorAll('#application-materials .application-material').length,app.materials.length);
  assert.equal(document.querySelectorAll('#application-materials .rare').length,app.materials.length);
  assert.equal($('#application-materials [data-mineral-detail]'),null);
  assert.equal($('#detail-dialog').open,false);
  for(const material of app.materials){
   const card=$(`#application-materials [data-element-detail="${material.symbol}"]`);
   assert(card);assert.match(card.textContent,new RegExp(material.use));assert(card.textContent.includes(material.description));
  }
  assert($('#application-sources a').href.startsWith('https://'));
 }
 click('[data-tech="ev"]');
 assert.equal(document.querySelectorAll('#application-materials .rare').length,4);
 assert($('#application-materials [data-element-detail="Nd"]'));
 assert.equal($('[data-tech="solar"]'),null);
});
test('material cards open the correct sourced profile and can navigate to project records',()=>{
 click('[data-tech="ev"]');click('#application-materials [data-element-detail="Pr"]');
 assert.equal($('#dialog-title').textContent,'Praseodímio');assert($('#dialog-content a').href.startsWith('https://'));
 click('[data-dialog-project="araxa"]');assert.equal($('#detail-dialog').open,false);assert.equal($('#map-inspector h3').textContent,'Araxá');
 click('#application-materials [data-element-detail="Dy"]');assert.equal($('#dialog-title').textContent,'Disprósio');click('.dialog-close');
 assert.equal($('#application-title').textContent,'Carro elétrico');
});
test('every application material opens its own evidence and scope, without unrelated citations',()=>{
 for(const app of applications){
  click(`[data-tech="${app.id}"]`);
  const links=[...document.querySelectorAll('#application-sources a')];
  for(const key of applicationSourceKeys(app))assert(links.some(a=>a.href===sources[key].url));
  for(const material of app.materials){
   const card=$(`#application-materials [data-element-detail="${material.symbol}"]`);
   card.click();
   assert($('.application-dialog-context').textContent.includes(material.description));
   assert.deepEqual([...document.querySelectorAll('.application-dialog-context a')].map(a=>a.href),materialSourceKeys(app,material).map(key=>sources[key].url));
   if(material.scope){assert(card.textContent.includes(material.scope));assert($('.application-dialog-context').textContent.includes(material.scope));}
   if(app.note)assert($('.application-dialog-context').textContent.includes(app.note));
   click('.dialog-close');
  }
 }
 click('[data-tech="phone"]');
 click('#application-materials [data-element-detail="Nd"]');
 assert.match($('.application-dialog-context').textContent,/Smartphone.*Som e vibração/);
 assert.equal($('.application-dialog-context a').href,sources.usgsPhone.url);
 click('.dialog-close');
 click('[data-tech="mri"]');
 assert.match($('#application-note').textContent,/Contraste e ímã são aplicações separadas/);
 click('[data-tech="refining"]');
 assert.match($('#application-note').textContent,/combustível final/);
});
test('smartphone shows its rare-earth selection without the removed callout or material legend',()=>{
 click('[data-tech="phone"]');
 assert.equal($('#application-count>strong').textContent,'9');
 assert.match($('#application-count').textContent,/terras raras neste recorte/);
 assert.equal(document.querySelectorAll('#application-materials .rare').length,9);
 assert.equal($('#application-insight'),null);
 assert(!$('.applications-explorer').textContent.includes('16 de 17'));
 assert(!$('.applications-explorer').textContent.includes('Outro material'));
});
test('the expanded application selector supports keyboard navigation without losing the selection',()=>{
 assert.equal(document.querySelectorAll('[data-tech]').length,15);
 assert.match($('#application-total').textContent,/15 APLICAÇÕES/);
 const key=(id,key)=>$(`[data-tech="${id}"]`).dispatchEvent(new dom.window.KeyboardEvent('keydown',{key,bubbles:true,cancelable:true}));
 for(const [id,pressed,expected]of [['refining','Home','phone'],['phone','ArrowRight','ev'],['ev','End','special'],['special','ArrowRight','phone'],['phone','ArrowLeft','special']]){
  key(id,pressed);
  assert.equal(document.activeElement,$(`[data-tech="${expected}"]`));
  assert.equal($(`[data-tech="${expected}"]`).getAttribute('aria-pressed'),'true');
  assert.equal(document.querySelectorAll('[data-tech][aria-pressed="true"]').length,1);
  assert.equal($('#application-title').textContent,applications.find(a=>a.id===expected).name);
 }
 click('[data-tech="phone"]');
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
