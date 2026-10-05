import {sources,minerals,projects,rareEarths,usgsUrl} from './data.js';
import {projectFacts,locations,fmt} from './editorial.js';
import {initMap,selectProject} from './maps.js';
import {initApplications} from './applications.js';
import {applications,materialSourceKeys} from './applications-data.js';
import {initSupplyChain} from './supply-chain.js';
import {initFuture} from './future.js';
import {initUSDependence} from './us-dependence.js';
import {initNavigation} from './navigation.js';
initNavigation();
const d3=window.d3,$=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const motion=()=>!matchMedia('(prefers-reduced-motion: reduce)').matches;
const link=(key,label)=>`<a class="source-link" href="${sources[key].url}" target="_blank" rel="noopener">${label||sources[key].name} ↗</a>`;
function pressed(selector,key,value){$$(selector).forEach(b=>{const on=b.dataset[key]===value;b.classList.toggle('active',on);b.setAttribute('aria-pressed',String(on));});}
function openDialog(html){$('#dialog-content').innerHTML=html;$('#detail-dialog').showModal();$('#detail-dialog').scrollTop=0;}
$('.dialog-close').onclick=()=>$('#detail-dialog').close();
$('#detail-dialog').addEventListener('click',e=>{if(e.target!==$('#detail-dialog'))return;const r=e.target.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)e.target.close();});
function projectDialog(id){const p=projects.find(p=>p.id===id),f=projectFacts[id];openDialog(`<p class="eyebrow">FICHA DO PROJETO · ${p.state} · ${p.date}</p><h2 id="dialog-title">${p.name}</h2><p>${p.detail}</p><dl><dt>LOCALIZAÇÃO DE REFERÊNCIA</dt><dd>${p.region}. A malha no atlas é municipal, não o perímetro de uma jazida.</dd><dt>OPERADOR</dt><dd>${p.operator}</dd><dt>ESTÁGIO E GEOLOGIA</dt><dd>${p.status} · ${p.type}</dd><dt>RECURSO DECLARADO NA FONTE</dt><dd>${p.resource}</dd><dt>TEOR</dt><dd>${p.grade}</dd><dt>ELEMENTOS DESTACADOS</dt><dd>${p.key}</dd><dt>O QUE ESTA FICHA NÃO INFORMA</dt><dd>Não há decomposição da quantidade por elemento neste recorte. O teor total de TREO não pode ser dividido igualmente entre ${f.elements.length?f.elements.join(', '):'os elementos'}. Recursos e reservas de datas ou classes distintas não se somam.</dd></dl><div class="source-row">${link(p.source)}${p.extraSource?link(p.extraSource):''}</div>`);}
function applicationContext(symbol,id){
 const app=applications.find(a=>a.id===id),material=app?.materials.find(m=>m.symbol===symbol);
 if(!material)return '';
 return `<div class="application-dialog-context"><h3>${app.name} · ${material.use}</h3>${material.scope?`<p class="material-scope">${material.scope}</p>`:''}<p>${material.description}</p><div class="source-row" aria-label="Fontes deste uso">${materialSourceKeys(app,material).map(key=>link(key)).join('')}</div></div>`;
}
function mineralDialog(symbol,applicationId){const m=minerals.find(m=>m.symbol===symbol);if(!m)return;openDialog(`<p class="eyebrow">MINERAL ESTRATÉGICO · ${m.group.toUpperCase()}</p><span class="dialog-symbol">${m.symbol}</span><h2 id="dialog-title">${m.name}</h2><p>${m.desc}</p>${applicationContext(symbol,applicationId)}<dl><dt>USOS</dt><dd>${m.uses}</dd><dt>${m.kind||'RESERVAS'}</dt><dd>${m.reserve}</dd><dt>PRODUÇÃO BRASILEIRA · 2025 ESTIMADO</dt><dd>${m.production}</dd><dt>PRODUÇÃO MUNDIAL · MESMA UNIDADE DA FONTE</dt><dd>${m.world}</dd><dt>LOCALIZAÇÕES DE REFERÊNCIA</dt><dd>${m.location}</dd><dt>DA EXTRAÇÃO À INDÚSTRIA</dt><dd>${m.processing}</dd></dl><div class="source-row">${m.source?`<a class="source-link" href="${usgsUrl(m.source)}" target="_blank" rel="noopener">USGS · ${m.name} ↗</a>`:link(m.sourceKey)}${m.geoSource?link(m.geoSource,'Fonte geográfica'):''}</div>`);}
function elementDialog(symbol,applicationId){if(symbol==='Nb'){mineralDialog('Nb',applicationId);return;}const e=rareEarths.find(e=>e[0]===symbol);if(!e)return;const records=projects.filter(p=>projectFacts[p.id].elements.includes(symbol));openDialog(`<p class="eyebrow">TERRAS RARAS · NÚMERO ATÔMICO ${e[1]}</p><span class="dialog-symbol">${e[0]}</span><h2 id="dialog-title">${e[2]}</h2><p>${e[4]}</p>${applicationContext(symbol,applicationId)}<h3>Onde aparece neste atlas</h3><p>${records.length?records.map(p=>`<button class="text-button" data-dialog-project="${p.id}">${projectFacts[p.id].short} (${p.state}) ↗</button>`).join(' · '):'Não individualizado nos registros selecionados. Isso não indica ausência no Brasil.'}</p><p class="small">As fichas identificam elementos citados, sem quantidades individuais recuperáveis. A classificação leve/pesada é uma convenção; algumas fontes usam categorias intermediárias.</p><div class="source-row">${link('reeeduca','SGB · família das terras raras')}${link('doe2023','DOE · aplicações')}</div>`);}
document.addEventListener('click',e=>{const location=e.target.closest('[data-dialog-project]');if(location){$('#detail-dialog').close();selectProject(location.dataset.dialogProject,{focus:true});return;}const p=e.target.closest('[data-project-full]');if(p)projectDialog(p.dataset.projectFull);const el=e.target.closest('[data-element-detail]');if(el)elementDialog(el.dataset.elementDetail,el.dataset.application);const m=e.target.closest('[data-mineral-detail]');if(m)mineralDialog(m.dataset.mineralDetail,m.dataset.application);});
$('#map-help').onclick=()=>openDialog(`<p class="eyebrow">GUIA DE LEITURA</p><h2 id="dialog-title">O que o mapa mostra.</h2><h3>Projetos e minerais</h3><p>Os ${projects.length} registros usam ${locations.length} municípios do IBGE como referência. Os pontos ficam nos centros das caixas geográficas municipais; as áreas destacadas são limites municipais. Projetos na mesma referência municipal têm fichas separadas. Não são coordenadas ou perímetros medidos de jazidas.</p><p>Cores indicam o estágio do projeto de terras raras. Os círculos têm tamanho fixo: não representam volume, valor ou área mineralizada.</p><h3>Quanto conhecemos</h3><p>Os polígonos vêm do inventário oficial de folhas geológicas do SGB. Troque a escala e selecione uma folha diretamente no mapa. O recorte exibe as folhas publicadas até 2025. Áreas em branco podem ter levantamentos em outra escala ou fora deste inventário. Não são necessariamente desconhecidas.</p><p>Os 28% e 50% são o balanço nacional até 2025 publicado no Panorama SGB 2026, calculado separadamente dos polígonos exibidos. Não são percentuais exclusivos da Amazônia.</p><h3>Como explorar</h3><p>Arraste para mover o mapa. Use + e − para ampliar, ou Ctrl + rolagem. O botão ⌂ retorna ao Brasil. Para explorar as folhas por teclado, use Tab para entrar no mapa, as setas para percorrê-las e Enter ou espaço para selecionar. Selecione os projetos diretamente no mapa. Para pontos com várias fichas, escolha o projeto no painel de detalhes.</p><div class="source-row">${link('cartography','IBGE · malhas')}${link('mapping','SGB · inventário')}${link('panorama','SGB · balanço')}</div>`);

// The horizontal bars always share a zero baseline. Missing values never become zero-length bars.
export function drawBarChart(target,rows,{unit='',max=null,labelWidth=128,ariaLabel='Comparação por país'}={}){
 const width=590,rowHeight=59,left=labelWidth,right=107,top=25,bottom=25,height=top+rows.length*rowHeight+bottom;
 const maxValue=max??d3.max(rows,r=>r.value??0)??0;
 const x=d3.scaleLinear().domain([0,maxValue||1]).range([left,width-right]);
 const root=d3.select(target);let svg=root.select('svg');if(svg.empty())svg=root.append('svg').attr('class','country-chart');
 svg.attr('viewBox',`0 0 ${width} ${height}`).attr('role','img').attr('aria-label',ariaLabel+': '+rows.map(r=>`${r.name}: ${r.value===null?r.missing||'não disponível':fmt(r.value)+' '+unit}`).join('; '));
 const ticks=rows.some(r=>r.value!==null)?(maxValue?x.ticks(4):[0]):[];
 const grid=svg.selectAll('g.chart-grid').data([null]).join('g').attr('class','chart-grid');
 grid.selectAll('line').data(ticks).join('line').attr('x1',x).attr('x2',x).attr('y1',top-10).attr('y2',height-bottom-9).attr('stroke','#d5d9cd').attr('stroke-dasharray',d=>d===0?'0':'2 4');
 grid.selectAll('text').data(ticks).join('text').attr('class','chart-axis').attr('x',x).attr('y',height-5).attr('text-anchor','middle').text(v=>v>=1000000?fmt(v/1000000)+' mi':v>=1000?fmt(v/1000)+' mil':fmt(v));
 const row=svg.selectAll('g.data-row').data(rows,r=>r.name).join(enter=>{const g=enter.append('g').attr('class','data-row');g.append('rect').attr('class','data-bar');g.append('text').attr('class','chart-country');g.append('text').attr('class','chart-value');return g;});
 row.attr('transform',(r,i)=>`translate(0,${top+i*rowHeight})`);
 row.select('rect').attr('x',left).attr('y',5).attr('height',25).attr('fill',r=>r.name==='Brasil'?'#b55336':'#bccaba').interrupt().transition().duration(motion()?550:0).attr('width',r=>r.value===null?0:x(r.value)-left);
 row.select('.chart-country').attr('class',r=>'chart-country'+(r.name==='Brasil'?' brazil':'')).attr('x',left-15).attr('y',22).attr('text-anchor','end').text(r=>r.name);
 row.select('.chart-value').attr('class',r=>'chart-value'+(r.name==='Brasil'?' brazil':'')).attr('x',r=>r.value===null?left+8:x(r.value)+9).attr('y',22).attr('font-size',r=>r.value===null?10:12).text(r=>r.value===null?r.missing||'Não divulgado':fmt(r.value));
 row.selectAll('title').data(r=>[r]).join('title').text(r=>`${r.name}: ${r.value===null?r.missing||'Não disponível':fmt(r.value)+' '+unit}`);
}
let comparison='reserve';
function renderComparison(){
 const reserve=comparison==='reserve';const brazil=21;
 const rows=reserve?[{name:'China',value:44},{name:'Brasil',value:brazil},{name:'Austrália',value:6.3},{name:'Estados Unidos',value:1.9}]:[{name:'China',value:270000},{name:'Estados Unidos',value:51000},{name:'Austrália',value:29000},{name:'Brasil',value:2000}];
 drawBarChart('#country-chart',rows,{unit:reserve?'Mt de REO':'t de REO',ariaLabel:reserve?'Reservas de terras raras':'Produção mineral estimada de 2025'});
 $('#comparison-unit').textContent=reserve?'MILHÕES DE TONELADAS · REO':'TONELADAS · REO · 2025e';
 $('#comparison-takeaway').innerHTML=reserve?`<strong>${brazil} Mt</strong><span>de óxidos de terras raras em reservas brasileiras.<br><small>USGS · estimativa histórica de 2026</small></span>`:'<strong>0,5%</strong><span>da produção mundial estimada em 2025 veio do Brasil.</span>';
 $('#comparison-caption').hidden=reserve;
 $('#comparison-caption').textContent=reserve?'':'Produção de 2025 estimada pelo USGS. Brasil: 2 mil t de um total mundial de 390 mil t. A participação é arredondada. Escala começa em zero.';
 $('#comparison-source').innerHTML=reserve?link('reeHistorical','USGS · tabela histórica preservada'):`<a class="source-link" href="${usgsUrl('rare-earths')}" target="_blank" rel="noopener">USGS · produção de terras raras ↗</a>`;
 pressed('[data-comparison]','comparison',comparison);
}
$$('[data-comparison]').forEach(b=>b.onclick=()=>{comparison=b.dataset.comparison;renderComparison();});renderComparison();

initApplications();

initSupplyChain();
initUSDependence();
initFuture();

$('#source-directory').innerHTML=Object.values(sources).map(s=>`<a href="${s.url}" target="_blank" rel="noopener">${s.name} ↗<small>${s.date}</small></a>`).join('')+`<a href="assets/geological-coverage.geojson" download>Folhas geológicas · polígonos do SGB ↓<small>GeoJSON · consulta de 05/10/2026 · publicadas até 2025</small></a>`;
export const mapInitialized=initMap();
