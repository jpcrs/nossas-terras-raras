import {metrics,minerals,sources,usgsUrl} from './data.js';

export const comparisonCountries=['Brasil','China','Estados Unidos'];
const series=id=>metrics.find(m=>m.id===id);
const catalogSeries=(symbol,type,unit,brazil,note)=>{
 const mineral=minerals.find(m=>m.symbol===symbol);
 return {
  id:`${symbol.toLowerCase()}-${type==='production'?'p':'r'}-catalog`,
  name:`${mineral.name} · ${type==='production'?'produção':'reservas'}`,
  type,unit,values:[brazil,null,null],source:mineral.source||null,sourceKey:mineral.sourceKey||null,
  period:type==='production'?'2025 estimado':'USGS MCS 2026',
  nodata:[brazil===null?'Não harmonizado':null,'Fora deste recorte','Fora deste recorte'],
  note,
  ...(note===partial?{chartNote:''}:{}),
 };
};
const partial='Valor brasileiro transcrito da ficha deste atlas. Os valores de China e EUA não estão incluídos neste recorte.';
// Supplement the original comparative series only with figures already in the
// sourced mineral profiles. Missing comparisons are not inferred from world totals.
export const mineralComparisons={
 Nb:{production:series('nb-p'),reserve:catalogSeries('Nb','reserve','Mt de Nb',14,partial)},
 ETR:{production:series('ree-p'),reserve:series('ree-r')},
 Li:{production:series('li-p'),reserve:series('li-r')},
 C:{production:series('gr-p'),reserve:series('gr-r')},
 Ni:{production:catalogSeries('Ni','production','t de Ni',70000,partial),reserve:series('ni-r')},
 Mn:{production:catalogSeries('Mn','production','t de Mn',800000,partial),reserve:series('mn-r')},
 Si:{production:series('si-p'),reserve:catalogSeries('Si','reserve','',null,'Não há um total de reservas comparável nesta seleção. Sílica, silício metálico e silício de grau eletrônico são produtos distintos.')},
 Ta:{production:catalogSeries('Ta','production','t de Ta',190,partial),reserve:series('ta-r')},
 Ti:{production:catalogSeries('Ti','production','',null,'Ilmenita e rutilo são séries distintas. A produção não foi harmonizada neste recorte.'),reserve:catalogSeries('Ti','reserve','',null,'Reservas de ilmenita e rutilo devem ser consultadas separadamente. Não há uma série harmonizada neste recorte.')},
 V:{production:catalogSeries('V','production','t de V',5300,partial),reserve:catalogSeries('V','reserve','t de V',94000,partial)},
 Cu:{production:{...catalogSeries('Cu','production','t de Cu',null,'Brasil não individualizado na tabela selecionada. China e EUA não transcritos neste recorte; o total mundial não foi distribuído entre países.'),nodata:['Não individualizado','Fora deste recorte','Fora deste recorte']},reserve:series('cu-r')},
 U:{production:{...catalogSeries('U','production','t de U',null,'Produção não harmonizada nesta seleção.'),period:'Período não harmonizado'},reserve:{...catalogSeries('U','reserve','t de U',null,'A ficha informa cerca de 250 mil t de U em recursos brasileiros (IEN, 2026). Recursos não são reservas e não são convertidos em uma barra de reservas.'),period:'IEN · 2026 · recursos, não reservas'}},
 Fe:{production:series('fe-p'),reserve:series('fe-r')},
 Al:{production:series('al-p'),reserve:series('al-r')},
 Co:{production:catalogSeries('Co','production','t de Co',null,'Produção não harmonizada nesta seleção. Consulte a ficha e a tabela original.'),reserve:catalogSeries('Co','reserve','t de Co',null,'Não há uma comparação quantitativa de reservas transcrita neste recorte. Consulte a classificação na fonte.')},
};

export const comparisonSource=m=>m.source?usgsUrl(m.source):sources[m.sourceKey].url;
export const comparisonMissing=(m,i)=>m.nodata?.[i]||'Não individualizado';
export function mineralComparisonCSV(symbol){
 const quote=value=>'"'+String(value??'').replaceAll('"','""')+'"';
 const rows=[['País','Indicador','Valor','Unidade','Status','Período','Fonte','Nota']];
 for(const m of Object.values(mineralComparisons[symbol])){
  comparisonCountries.forEach((country,i)=>rows.push([country,m.name,m.values[i],m.unit,m.values[i]===null?comparisonMissing(m,i):'Informado',m.period||(m.type==='production'?'2025 estimado':'USGS MCS 2026'),comparisonSource(m),m.note||'']));
 }
 return '\uFEFF'+rows.map(row=>row.map(quote).join(';')).join('\r\n');
}
