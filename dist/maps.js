import {projects,rareEarths,sources} from './data.js';
import {projectFacts,locations,stages,kinds,stateNames,coverageScales,fmt,gradePercent,resourceBreakdown,coverageFeatures,normalizeWinding} from './editorial.js';
const d3=window.d3;
const $=s=>document.querySelector(s);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const link=(key,label)=>`<a class="source-link" href="${sources[key].url}" target="_blank" rel="noopener">${label||sources[key].name} ↗</a>`;
let layer='projects', selected='serra', scale=100000, year=2025;
let states,towns,coverage,svg,viewport,path,projection,zoom,markers,coverageGroup,municipalityGroup,labelGroup;
let transform=d3.zoomIdentity,mapReady=false,coveragePromise,selectedSheet=null;
const W=820,H=650;
const sheetName=f=>[f.properties.NOME_FOLHA,f.properties.COD_FOLHA,f.properties.PROJETO].find(v=>v?.trim())?.trim()||`Registro SGB ${f.id??f.properties.OBJECTID}`;
const locationData=[];
const announcement=text=>{$('#announcement').textContent=text;};
const safeURL=url=>{try{const u=new URL(url);return u.protocol==='https:'?u.href:null;}catch{return null;}};
export function getMapState(){return {layer,selected,scale,year};}
export function selectProject(id,{switchLayer=true,focus=false}={}){
 if(!projectFacts[id])return;
 const previous=selected;
 selected=id;
 hideTooltip();
 if(switchLayer&&layer==='coverage')layer='projects';
 renderControls();
 renderInspector();updateMap();renderProjectList();
 if(mapReady&&previous!==id&&transform.k>1.05)zoomProject();
 const p=projects.find(p=>p.id===id);announcement(`${p.name}, ${p.region}. ${p.status}.`);
 if(focus){$('#explorar').scrollIntoView({behavior:motion()?'smooth':'instant'});}
}
function motion(){return !matchMedia('(prefers-reduced-motion: reduce)').matches;}
function elementChip(symbol){const e=rareEarths.find(e=>e[0]===symbol);return `<button class="element-chip" data-element-detail="${symbol}" aria-label="Conhecer ${e?.[2]||'Nióbio'}"><small>${e?.[1]||41}</small><b>${symbol}</b></button>`;}
function stageLabel(p){const s=stages[projectFacts[p.id].stage];return `<span class="status-label" style="--color:${s.color}"><i class="legend-dot" style="--color:${s.color}"></i>${esc(p.status)}</span>`;}
function geologyCutaway(kind){return `<div class="geology-cutaway ${kind}"><div class="cutaway-soil">SOLO E VEGETAÇÃO</div><div class="cutaway-clay"><span class="cutaway-label">${kind==='clay'?'ARGILAS · ÍONS ADSORVIDOS':'MINERALIZAÇÃO · ROCHA / ALTERAÇÃO'}</span><div class="cutaway-ions">${['Nd','Pr','Dy','Tb','Nd','Pr'].map(s=>`<span>${s}</span>`).join('')}</div></div><div class="cutaway-rock">ROCHA DE ORIGEM</div></div>`;}
function renderInspector(){
 const panel=$('#map-inspector');
 panel.scrollTop=0;
 if(layer==='coverage'){renderCoverageInspector();return;}
 const p=projects.find(p=>p.id===selected),f=projectFacts[selected];
 const peers=projects.filter(x=>projectFacts[x.id].municipality===f.municipality);
 const breakdown=resourceBreakdown(selected);
 panel.innerHTML=`<div class="inspector-kicker"><span class="eyebrow">${p.state} / ${layer==='geology'?'GEOLOGIA':'PROJETO SELECIONADO'}</span>${stageLabel(p)}</div>${peers.length>1?`<div class="cluster-tabs" role="group" aria-label="Projetos na região de Poços de Caldas">${peers.map(x=>`<button data-select-project="${x.id}" class="${x.id===selected?'active':''}" aria-pressed="${x.id===selected}">${projectFacts[x.id].short}</button>`).join('')}</div>`:''}<h3>${f.short}</h3><p class="project-region">${p.region}</p>${layer==='geology'?`${geologyCutaway(f.kind)}<p class="small">${f.kind==='clay'?'Nas argilas iônicas, parte das terras raras está adsorvida nas partículas. A recuperação depende da química e dos testes de cada depósito.':'Em sistemas de rocha e alteração, as terras raras estão associadas a minerais. Beneficiamento e separação dependem da mineralogia local.'}</p><p class="small">Esquema conceitual. Não representa uma seção medida deste projeto nem sua composição elementar.</p>`:''}<p class="eyebrow element-label">ELEMENTOS DESTACADOS NA FONTE</p><div class="element-chips">${f.elements.length?f.elements.map(elementChip).join(''):'<span class="small">ETR não individualizadas · tório associado</span>'}</div><div class="project-geology"><strong>${p.type}</strong></div><div class="resource-stat"><span class="eyebrow">${f.amountLabel}</span>${f.amount!==null?`<strong>${fmt(f.amount)}</strong><span class="unit">${f.unit==='Mt de material'?'milhões de t · material':'milhões de t · TREO contidos'}</span>`:'<p class="no-resource">Quantidade não disponível</p>'}</div><p class="resource-note">${f.resourceNote}</p>${breakdown?`<div class="resource-stack" role="img" aria-label="${fmt(breakdown.measuredIndicated)} Mt medidos e indicados; ${fmt(breakdown.inferred)} Mt inferidos"><span style="width:${breakdown.measuredIndicated/breakdown.total*100}%"></span><span style="width:${breakdown.inferred/breakdown.total*100}%"></span></div><div class="resource-stack-labels"><span>${fmt(breakdown.measuredIndicated)} Mt<br>Medidos + indicados</span><span>${fmt(breakdown.inferred)} Mt<br>Inferidos</span></div>`:''}<div class="grade"><div class="grade-header"><span><abbr title="Óxidos totais de terras raras">TREO</abbr> · teor médio</span><strong>${f.grade!==null?fmt(f.grade)+' ppm':'Não comparável'}</strong></div>${f.grade!==null?`<div class="grade-strip" role="img" aria-label="Teor ${fmt(gradePercent(f.grade),4)} por cento. Escala visual de zero a um por cento"><span style="width:${gradePercent(f.grade)*100}%"></span></div><div class="grade-endpoints"><span>0%</span><span>escala ampliada · 1%</span></div><div class="grade-conversion"><span>1 t de material →</span><strong>${fmt(f.grade/1000,3)} kg de TREO</strong></div><p class="grade-note">${fmt(gradePercent(f.grade),4)}% de óxidos no material.<br>Conteúdo químico, não recuperação industrial.</p>`:`<p class="resource-note">${p.grade}</p>`}</div><div class="inspector-actions"><button class="text-button" data-project-full="${p.id}">Ficha e fontes ↗</button><button class="text-button" id="zoom-project">Ampliar região ⤢</button></div><div class="project-source">${esc(p.operator)}<br>REFERÊNCIA · ${esc(p.date)}<br>${link(p.source,'Fonte do projeto')}${p.extraSource?' · '+link(p.extraSource,'Referência do recurso'):''}</div>`;
 panel.querySelectorAll('[data-select-project]').forEach(b=>b.onclick=()=>selectProject(b.dataset.selectProject));
 $('#zoom-project').onclick=zoomProject;
}
function renderProjectList(){
 const focusId=document.activeElement?.dataset.project;
 $('#project-list').innerHTML=projects.map(p=>`<button data-project="${p.id}" class="${p.id===selected?'active':''}" aria-pressed="${p.id===selected}"><i class="legend-dot" style="--color:${stages[projectFacts[p.id].stage].color}"></i>${projectFacts[p.id].short}</button>`).join('');
 $('#project-list').querySelectorAll('button').forEach(b=>b.onclick=()=>selectProject(b.dataset.project));
 if(focusId)$('#project-list').querySelector(`[data-project="${focusId}"]`)?.focus({preventScroll:true});
}
function renderControls(){
 const focusScale=document.activeElement?.dataset.scale;
 document.querySelectorAll('[data-layer]').forEach(b=>{b.classList.toggle('active',b.dataset.layer===layer);b.setAttribute('aria-pressed',b.dataset.layer===layer);});
 $('.atlas-body').classList.toggle('coverage-mode',layer==='coverage');
 if(layer==='coverage'){
  $('#map-controls').innerHTML=`<div class="scale-controls" role="group" aria-label="Escala dos mapas geológicos">${[1000000,250000,100000].map(s=>`<button data-scale="${s}" class="${scale===s?'active':''}" aria-pressed="${scale===s}">${coverageScales[s].short}<small>1:${fmt(s,0)}</small></button>`).join('')}</div>`;
  $('#map-controls').querySelectorAll('button').forEach(b=>b.onclick=()=>{scale=Number(b.dataset.scale);selectedSheet=null;renderControls();renderInspector();updateCoverage();announcement(`Escala 1 para ${fmt(scale)}. ${coverageScales[scale].label}.`);});
  $('#map-note').textContent='Polígonos oficiais das folhas geológicas publicadas até 2025, consultados no inventário SGB em 05/10/2026. Sobreposições preservadas. Os percentuais nacionais vêm separadamente do Panorama SGB 2026.';
 }else{
  $('#map-controls').replaceChildren();
  $('#map-note').textContent='Os pontos localizam municípios de referência, não jazidas. A área destacada é a malha municipal IBGE. Três registros compartilham a referência de Poços de Caldas. Esta seleção não é um inventário nacional completo.';
 }
 renderLegend();
 if(focusScale)$('#map-controls').querySelector(`[data-scale="${focusScale}"]`)?.focus({preventScroll:true});
}
function renderLegend(){
 if(layer==='coverage')$('#map-legend').innerHTML=`<span class="legend-entry"><i class="legend-swatch" style="--color:${coverageScales[scale].color}"></i>Folhas publicadas até ${year}</span><span class="legend-entry"><i class="legend-swatch" style="--color:#e0e5d7"></i>Sem folha exibida</span>`;
 else $('#map-legend').innerHTML=Object.values(layer==='geology'?kinds:stages).map(s=>`<span class="legend-entry"><i class="legend-dot" style="--color:${s.color}"></i>${s.label}</span>`).join('');
}
export function setLayer(next){
 layer=next;selectedSheet=null;hideTooltip();renderControls();renderInspector();updateMap();
 if(layer==='coverage')loadCoverage();
 announcement(layer==='coverage'?'Camada de mapeamento geológico. Escolha a escala e o ano.':layer==='geology'?'Camada de tipos de depósito.':'Camada de projetos e minerais.');
}
function renderCoverageInspector(){
 const s=coverageScales[scale];
 $('#map-inspector').innerHTML=`<div class="inspector-kicker"><span class="eyebrow">O QUE JÁ FOI MAPEADO</span><span class="eyebrow">SGB · ATÉ 2025</span></div><h3>${s.label}</h3><p class="project-region">Escala 1:${fmt(scale,0)} · ${s.detail}</p>${s.rate?`<div class="coverage-big"><strong>${s.rate}%</strong><span>do território<br>com mapas nessa escala</span></div><div class="coverage-rail" role="img" aria-label="${s.rate} por cento mapeado no balanço nacional até 2025"><span style="width:${s.rate}%"></span></div><p class="small coverage-explanation">Cerca de <strong>${fmt(8.51*s.rate/100)} milhões de km²</strong>. Outras áreas podem ter mapas em escalas diferentes.</p>`:'<p class="small coverage-explanation">Uma visão de integração nacional. Mapas gerais reúnem levantamentos de diferentes épocas; não significam pesquisa detalhada em todo o território.</p>'}<div class="coverage-year"><label for="coverage-year">MOSTRAR FOLHAS ATÉ <output id="year-output" for="coverage-year">${year}</output></label><input id="coverage-year" type="range" min="1969" max="2025" value="${year}" step="1"><div class="range-labels"><span>1969</span><span>2025</span></div></div><p class="coverage-count" id="coverage-count">${coverage?'':'Carregando polígonos oficiais…'}</p><p class="small coverage-warning">O ano filtra as folhas deste inventário. ${s.rate?'O percentual acima é o balanço nacional de 2025 e não muda com o filtro.':'Folhas podem se sobrepor e não medem a cobertura do território por simples contagem.'}</p><div class="sheet-detail" id="sheet-detail"><span class="eyebrow">LEIA O MAPA</span><h4>Selecione uma área verde.</h4><p>Veja o nome da folha, a instituição e o ano de publicação.</p></div><div class="project-source">GEOMETRIAS · INVENTÁRIO SGB<br>PERCENTUAIS · PANORAMA 2026, ATÉ 2025<br>${link('panorama','Balanço nacional')} · ${link('mapping','Mapa do SGB')}</div>`;
 $('#coverage-year').oninput=e=>{year=Number(e.target.value);$('#year-output').textContent=year;selectedSheet=null;updateCoverage();renderLegend();};
 $('#coverage-year').onchange=()=>announcement(`${year}. ${coverage?coverageFeatures(coverage,scale,year).length:0} folhas publicadas no inventário.`);
 updateCoverageCount();
}
function showSheet(f){
 selectedSheet=f.id??f.properties.OBJECTID;
 const p=f.properties;const url=safeURL(p.URL_RIGEO);
 $('#sheet-detail').innerHTML=`<span class="eyebrow">FOLHA ${esc(p.COD_FOLHA?.trim()||'CÓDIGO NÃO INFORMADO')}</span><h4>${esc(sheetName(f))}</h4><p>${esc(p.EXECUCAO||'Instituição não informada')} · ${esc(p.ANO_MAPA)}</p><p>Escala 1:${fmt(Number(p.ESCALA),0)} · ${esc(p.SITUACAO)}</p>${url?`<a class="source-link" href="${esc(url)}" target="_blank" rel="noopener">Consultar folha original ↗</a>`:''}`;
 coverageGroup?.selectAll('path').classed('is-selected',d=>(d.id??d.properties.OBJECTID)===selectedSheet);
 announcement(`${sheetName(f)}, folha ${p.COD_FOLHA}, publicada em ${p.ANO_MAPA}.`);
}
async function loadCoverage(){
 if(coverage){updateCoverage();return;}
 if(!coveragePromise)coveragePromise=fetch('assets/geological-coverage.geojson').then(r=>{if(!r.ok)throw Error('coverage');return r.json();}).then(j=>{coverage=normalizeWinding(j,d3);updateCoverage();}).catch(()=>{coveragePromise=null;if(layer==='coverage'){$('#coverage-count').innerHTML='Não foi possível carregar as folhas. <button id="retry-coverage" class="text-button">Tentar novamente</button>';$('#retry-coverage').onclick=loadCoverage;}});
 await coveragePromise;
}
function updateCoverageCount(){if(layer!=='coverage'||!coverage)return;const count=coverageFeatures(coverage,scale,year).length;$('#coverage-count').textContent=`${fmt(count,0)} folhas publicadas neste recorte`;}
function updateCoverage(){
 if(!mapReady||!coverage||layer!=='coverage')return;
 const features=coverageFeatures(coverage,scale,year);
 coverageGroup.attr('display',null).style('--coverage-color',coverageScales[scale].color);
 coverageGroup.selectAll('path').data(features,d=>d.id??d.properties.OBJECTID).join('path').attr('d',path).attr('class','coverage-sheet').attr('role','button').attr('tabindex',-1).attr('aria-label',d=>`Folha ${sheetName(d)}, ${d.properties.ANO_MAPA}`).on('pointermove',(e,d)=>showTooltip(e,esc(sheetName(d)),`${esc(d.properties.COD_FOLHA)} · ${esc(d.properties.ANO_MAPA)}`)).on('pointerleave',hideTooltip).on('click',(e,d)=>{e.stopPropagation();showSheet(d);hideTooltip();});
 // Hundreds of sheets stay out of the tab order; a synchronized selector provides keyboard access.
 if($('#sheet-picker'))$('#sheet-picker').remove();
 const picker=document.createElement('div');picker.className='sheet-detail';picker.id='sheet-picker';picker.innerHTML=`<label class="eyebrow" for="coverage-sheet-select">OU ESCOLHA UMA FOLHA</label><select id="coverage-sheet-select" aria-label="Selecionar folha geológica"><option value="">Selecione uma folha…</option>${features.slice().sort((a,b)=>sheetName(a).localeCompare(sheetName(b),'pt-BR')).map(f=>`<option value="${f.id??f.properties.OBJECTID}">${esc(sheetName(f))} · ${esc(f.properties.ANO_MAPA)}</option>`).join('')}</select>`;
 $('#sheet-detail').after(picker);
 $('#coverage-sheet-select').onchange=e=>{const f=features.find(f=>String(f.id??f.properties.OBJECTID)===e.target.value);if(f)showSheet(f);};
 if(!selectedSheet)$('#sheet-detail').innerHTML='<span class="eyebrow">LEIA O MAPA</span><h4>Selecione uma área verde.</h4><p>Veja o nome da folha, a instituição e o ano de publicação.</p>';
 updateCoverageCount();
}
function showTooltip(event,title,detail){const tip=$('#map-tooltip');const box=$('.map-stage').getBoundingClientRect();tip.innerHTML=`<strong>${title}</strong><span>${detail}</span>`;tip.hidden=false;tip.style.left=Math.max(10,Math.min(event.clientX-box.left+14,box.width-245))+'px';tip.style.top=Math.max(80,Math.min(event.clientY-box.top+14,box.height-90))+'px';}
function hideTooltip(){$('#map-tooltip').hidden=true;}
function updateMap(){
 if(!mapReady)return;
 coverageGroup.attr('display',layer==='coverage'?null:'none');
 if(layer==='coverage'){updateCoverage();municipalityGroup.attr('display','none');}else{
  municipalityGroup.attr('display',null).selectAll('path').data(towns.features.filter(f=>String(f.properties.codarea)===projectFacts[selected].municipality)).join('path').attr('class','municipality').attr('d',path);
 }
 markers.classed('is-selected',d=>d.ids.includes(selected))
 .attr('aria-pressed',d=>d.ids.includes(selected)).style('--color',d=>{const id=d.ids.includes(selected)?selected:d.ids[0];return layer==='geology'?kinds[projectFacts[id].kind].color:stages[projectFacts[id].stage].color;});
 renderLegend();
}
function applyTransform(t){
 transform=t;viewport.attr('transform',t);
 markers.attr('transform',d=>`translate(${d.point[0]},${d.point[1]}) scale(${1/t.k})`);
 labelGroup.selectAll('text').style('font-size',`${(matchMedia('(max-width:600px)').matches?14:10)/t.k}px`).style('opacity',t.k>3?.35:1);
 $('#zoom-out').disabled=t.k<=1.01;$('#zoom-in').disabled=t.k>=7.99;
 hideTooltip();
}
function zoomTo(t){if(!mapReady)return;svg.interrupt();if(motion())svg.transition().duration(600).call(zoom.transform,t);else svg.call(zoom.transform,t);}
function zoomProject(){if(!mapReady)return;const f=towns.features.find(f=>String(f.properties.codarea)===projectFacts[selected].municipality);const [[x0,y0],[x1,y1]]=path.bounds(f);const k=Math.min(6,.55/Math.max((x1-x0)/W,(y1-y0)/H));zoomTo(d3.zoomIdentity.translate(W/2,H/2).scale(k).translate(-(x0+x1)/2,-(y0+y1)/2));}
export async function initMap(){
 renderControls();renderInspector();renderProjectList();
 document.querySelectorAll('[data-layer]').forEach(b=>b.onclick=()=>setLayer(b.dataset.layer));
 $('#zoom-in').onclick=()=>{if(mapReady)svg.transition().duration(motion()?350:0).call(zoom.scaleBy,2,[W/2,H/2]);};
 $('#zoom-out').onclick=()=>{if(mapReady)svg.transition().duration(motion()?350:0).call(zoom.scaleBy,.5,[W/2,H/2]);};
 $('#zoom-reset').onclick=()=>zoomTo(d3.zoomIdentity);
 try{
  const geometry=await Promise.all(['brazil-states','project-municipalities'].map(n=>fetch(`assets/${n}.geojson`).then(r=>{if(!r.ok)throw Error(n);return r.json();})));
  states=normalizeWinding(geometry[0],d3);towns=normalizeWinding(geometry[1],d3);
  projection=d3.geoConicConformal().parallels([-2,-22]).rotate([54,0]).fitExtent([[90,70],[W-83,H-60]],states);
  path=d3.geoPath(projection);
  $('#map').innerHTML='';svg=d3.select('#map').append('svg').attr('viewBox',`0 0 ${W} ${H}`).attr('role','group').attr('aria-label','Brasil: estados, referências municipais e folhas geológicas. Use Tab e Enter ou os botões de projetos para explorar por teclado.');
  svg.append('defs').append('clipPath').attr('id','brazil-clip').selectAll('path').data(states.features).join('path').attr('d',path);
  viewport=svg.append('g');
  viewport.append('path').datum(d3.geoGraticule().extent([[-79,-38],[-31,10]]).step([10,10])()).attr('class','graticule').attr('d',path);
  viewport.append('g').selectAll('path').data(states.features).join('path').attr('class','state-shape').attr('d',path).append('title').text(d=>stateNames[d.properties.codarea]?.[1]||'Brasil');
  coverageGroup=viewport.append('g').attr('clip-path','url(#brazil-clip)').attr('display','none');
  viewport.append('g').selectAll('path').data(states.features).join('path').attr('class','state-outline').attr('d',path);
  municipalityGroup=viewport.append('g');
  labelGroup=viewport.append('g');
  labelGroup.selectAll('text').data(states.features.filter(f=>!['53','27','28','25','24','32','33'].includes(String(f.properties.codarea)))).join('text').attr('class','state-label').attr('transform',d=>`translate(${path.centroid(d)})`).text(d=>stateNames[d.properties.codarea]?.[0]);
  const ocean=projection([-35,-23]);viewport.append('text').attr('class','ocean-label').attr('x',ocean[0]).attr('y',ocean[1]).attr('transform',`rotate(-62,${ocean})`).text('OCEANO ATLÂNTICO');
  const equator=projection([-73,0]);viewport.append('text').attr('class','equator-label').attr('x',equator[0]-40).attr('y',equator[1]-8).text('EQUADOR');
  for(const l of locations){const f=towns.features.find(f=>String(f.properties.codarea)===l.code);const b=d3.geoBounds(f);const coordinate=[(b[0][0]+b[1][0])/2,(b[0][1]+b[1][1])/2];locationData.push({...l,point:projection(coordinate)});}
  markers=viewport.append('g').selectAll('g').data(locationData).join('g').attr('class','map-location').attr('role','button').attr('tabindex',0).attr('aria-label',d=>`${d.label}, ${d.state}. ${d.ids.length>1?d.ids.length+' registros. ':''}Referência municipal.`).attr('transform',d=>`translate(${d.point})`);
  markers.append('circle').attr('class','location-ring').attr('r',21);
  markers.append('path').attr('class','location-leader').attr('d',d=>`M0,0 L${d.offset[0]*.65},${d.offset[1]} H${d.offset[0]}`);
  markers.append('circle').attr('r',24).attr('fill','transparent');
  markers.append('circle').attr('class','location-core').attr('r',6);
  markers.append('text').attr('class','location-label').attr('x',d=>d.offset[0]).attr('y',d=>d.offset[1]-7).text(d=>d.label);
  markers.append('text').attr('class','location-label location-sub').attr('x',d=>d.offset[0]).attr('y',d=>d.offset[1]+9).text(d=>d.ids.length>1?'MG · 3 REGISTROS':d.state+' · '+projectFacts[d.ids[0]].elements.join(' / '));
  const activate=(e,d)=>{e.stopPropagation();selectProject(d.ids.includes(selected)?selected:d.ids[0]);};
  markers.on('click',activate).on('keydown',(e,d)=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();activate(e,d);}}).on('pointermove',(e,d)=>showTooltip(e,d.label,'Referência municipal · '+(d.ids.length>1?'clique para ver 3 registros':projects.find(p=>p.id===d.ids[0]).status))).on('pointerleave',hideTooltip);
  zoom=d3.zoom().scaleExtent([1,8]).extent([[0,0],[W,H]]).translateExtent([[-W/2,-H/2],[W*1.5,H*1.5]]).filter(e=>(e.type!=='wheel'||e.ctrlKey)&&(!e.button||e.type==='wheel')).on('zoom',e=>applyTransform(e.transform));
  svg.call(zoom).on('dblclick.zoom',null);mapReady=true;applyTransform(d3.zoomIdentity);updateMap();
  if(typeof ResizeObserver!=='undefined'){const observer=new ResizeObserver(()=>{
   const box=$('#map').getBoundingClientRect();const k=Math.min(box.width/W,box.height/H)||1;
   markers.selectAll('.location-label:not(.location-sub)').style('font-size',`${(box.width<600?11:12)/k}px`);
   markers.selectAll('.location-sub').style('font-size',`${(box.width<600?8:9)/k}px`);
   labelGroup.selectAll('text').style('font-size',`${7.5/k/transform.k}px`);
  });observer.observe($('#map'));}
  if(layer==='coverage')loadCoverage();
 }catch(error){$('#map').innerHTML='<div class="map-error"><p>O mapa não carregou. Você ainda pode explorar os sete registros nos botões abaixo.</p><button id="retry-map">Tentar novamente</button></div>';$('#retry-map').onclick=()=>{locationData.length=0;initMap();};console.error('Falha ao carregar geometrias',error);}
}
