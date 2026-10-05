import {sources} from './data.js';
import {usDependence} from './us-dependence-data.js';

export function initUSDependence(){
 const root=document.querySelector('#dependencia');
 if(!root)return;
 const $=selector=>root.querySelector(selector);
 const fmt=value=>value.toLocaleString('pt-BR',{maximumFractionDigits:2});
 let selected=2025;
 $('#us-years').innerHTML=usDependence.years.map(row=>`<button type="button" data-us-year="${row.year}" aria-pressed="false" aria-controls="us-reliance us-import-totals">${row.year}</button>`).join('');
 function render(){
  const row=usDependence.years.find(row=>row.year===selected);
  root.querySelectorAll('[data-us-year]').forEach(button=>button.setAttribute('aria-pressed',String(Number(button.dataset.usYear)===selected)));
  $('#us-reliance').innerHTML=`<div class="us-headline"><strong>${row.netImportReliance}<small>%</small></strong><p>do consumo aparente de compostos e metais coberto por <b>importações líquidas</b>.</p></div>
   <div class="us-waffle" role="img" aria-label="Dependência líquida de importações: ${row.netImportReliance}% do consumo aparente dos EUA em ${row.year}. Cada quadrado representa um ponto percentual.">${Array.from({length:100},(_,i)=>`<span class="${i<row.netImportReliance?'is-imported':''}" aria-hidden="true"></span>`).join('')}</div>
   <div class="us-waffle-caption"><span>1 quadrado = 1 ponto percentual</span><span>${selected} · USGS</span></div>`;
  $('#us-import-totals').innerHTML=`<div><strong>${fmt(row.compoundImports/1000)}<small>mil t</small></strong><span>de compostos importados</span><small>Equivalente em óxidos (REO) · ${selected}</small></div><div><strong><small>US$</small>${row.importValueMillionUSD}<small>mi</small></strong><span>em compostos e metais importados</span><small>Valor das importações · ${selected}</small></div>`;
  $('#us-announcement').textContent=`${selected}: dependência líquida de ${row.netImportReliance}%; ${fmt(row.compoundImports)} toneladas de compostos importados, em REO equivalente.`;
 }
 $('#us-years').addEventListener('click',event=>{const button=event.target.closest('[data-us-year]');if(!button)return;selected=Number(button.dataset.usYear);render();});
 $('#us-years').addEventListener('keydown',event=>{
  const button=event.target.closest('[data-us-year]');
  if(!button||!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;
  event.preventDefault();
  const buttons=[...root.querySelectorAll('[data-us-year]')],index=buttons.indexOf(button);
  const next=event.key==='Home'?0:event.key==='End'?buttons.length-1:(index+(event.key==='ArrowRight'?1:-1)+buttons.length)%buttons.length;
  buttons[next].focus();buttons[next].click();
 });
 $('#us-origin-chart').innerHTML=usDependence.origins.countries.map(country=>`<li class="us-origin-row ${country.id==='china'?'is-china':''}"><div><span>${country.name}</span><strong>${country.share}%</strong></div><div class="us-origin-track" aria-hidden="true"><span style="width:${country.share}%"></span></div></li>`).join('');
 $('#us-origin-period').textContent=usDependence.origins.period;
 $('#us-import-source').href=sources[usDependence.source].url;
 $('#us-risk-source').href=sources[usDependence.risk.source].url;
 $('#us-risk-value').textContent=fmt(usDependence.risk.minimumTrillionUSD);
 render();
}
