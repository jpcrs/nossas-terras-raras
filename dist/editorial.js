// Structured presentation values, transcribed from the existing sourced project records.
// Never aggregate unlike units, resource classes or disclosure dates.
export const projectFacts = {
  serra: {municipality:'5213087',short:'Serra Verde',elements:['Nd','Pr','Dy','Tb'],stage:'production',kind:'clay',amount:911,unit:'Mt de material',amountLabel:'Recurso histórico · 2017',grade:1200,year:'2017',resourceNote:'Classes não discriminadas no quadro do SGB. Não é uma declaração atual do operador.'},
  caldeira: {municipality:'3151800',short:'Caldeira',elements:['Nd','Pr','Dy','Tb'],stage:'development',kind:'clay',amount:1631,unit:'Mt de material',amountLabel:'Recurso · julho de 2026',grade:2317,year:'2026',inferred:928,resourceNote:'Medidos, indicados e inferidos. Reserva separada: 151 Mt de minério a 3.524 ppm TREO.'},
  araxa: {municipality:'3104007',short:'Araxá',elements:['Nd','Pr','Nb'],stage:'development',kind:'rock',amount:3.98,unit:'Mt de TREO contidos',amountLabel:'Conteúdo no recurso · agosto de 2026',grade:null,year:'2026',resourceNote:'Aproximadamente 68% da tonelagem nas classes medida e indicada. Corte de 2% TREO não é teor médio.'},
  carina: {municipality:'5214903',short:'Carina',elements:['Dy','Tb','Nd','Pr'],stage:'development',kind:'clay',amount:298,unit:'Mt de material',amountLabel:'Recurso histórico · novembro de 2025',grade:1452,year:'2025',resourceNote:'Indicados + inferidos, segundo compilação do SGB. Consulte a declaração atual do operador.'},
  colossus: {municipality:'3151800',short:'Colossus',elements:['Nd','Pr','Dy','Tb'],stage:'development',kind:'clay',amount:493,unit:'Mt de material',amountLabel:'Recurso histórico · janeiro de 2025',grade:2508,year:'2025',resourceNote:'Medidos, indicados e inferidos. A reserva separada de 200,1 Mt tem outra data e não se soma ao recurso.'},
  morro: {municipality:'3151800',short:'Morro do Ferro',elements:[],stage:'occurrence',kind:'rock',amount:null,grade:null,amountLabel:'Sem recurso atual classificado',resourceNote:'Referência geológica de 2013. Tório associado; elementos individuais de ETR não discriminados nesta seleção.'},
  pitinga: {municipality:'1303536',short:'Pitinga',elements:['Y','Dy','Er','Yb'],stage:'occurrence',kind:'rock',amount:null,grade:null,amountLabel:'Sem recurso atual classificado',resourceNote:'Distrito produtor de outros metais. Produção comercial de terras raras não confirmada nesta seleção.'}
};
export const locations = [
 {code:'1303536',label:'Pitinga',state:'AM',ids:['pitinga'],offset:[-110,-38]},
 {code:'5213087',label:'Serra Verde',state:'GO',ids:['serra'],offset:[-158,-45]},
 {code:'5214903',label:'Carina',state:'GO',ids:['carina'],offset:[95,-72]},
 {code:'3104007',label:'Araxá',state:'MG',ids:['araxa'],offset:[92,10]},
 {code:'3151800',label:'Poços de Caldas',state:'MG',ids:['caldeira','colossus','morro'],offset:[-170,55]}
];
export const stages = {production:{label:'Em produção',color:'#24675a'},development:{label:'Em desenvolvimento',color:'#bb5738'},occurrence:{label:'Ocorrência estudada',color:'#7b756b'}};
export const kinds = {clay:{label:'Argilas iônicas',color:'#b27036'},rock:{label:'Rocha / alteração',color:'#686d8c'}};
export const stateNames = {'11':['RO','Rondônia'],'12':['AC','Acre'],'13':['AM','Amazonas'],'14':['RR','Roraima'],'15':['PA','Pará'],'16':['AP','Amapá'],'17':['TO','Tocantins'],'21':['MA','Maranhão'],'22':['PI','Piauí'],'23':['CE','Ceará'],'24':['RN','Rio Grande do Norte'],'25':['PB','Paraíba'],'26':['PE','Pernambuco'],'27':['AL','Alagoas'],'28':['SE','Sergipe'],'29':['BA','Bahia'],'31':['MG','Minas Gerais'],'32':['ES','Espírito Santo'],'33':['RJ','Rio de Janeiro'],'35':['SP','São Paulo'],'41':['PR','Paraná'],'42':['SC','Santa Catarina'],'43':['RS','Rio Grande do Sul'],'50':['MS','Mato Grosso do Sul'],'51':['MT','Mato Grosso'],'52':['GO','Goiás'],'53':['DF','Distrito Federal']};
export const coverageScales={1000000:{label:'Visão nacional',short:'Geral',detail:'1 cm = 10 km',rate:null,color:'#758a85'},250000:{label:'Estudo regional',short:'Regional',detail:'1 cm = 2,5 km',rate:50,color:'#609284'},100000:{label:'Estudo detalhado',short:'Detalhado',detail:'1 cm = 1 km',rate:28,color:'#286d5c'}};
export const fmt=(n,d=2)=>n.toLocaleString('pt-BR',{maximumFractionDigits:d});
export function gradePercent(ppm){return ppm===null?null:ppm/10000;}
export function resourceBreakdown(id){const f=projectFacts[id];if(!f?.inferred)return null;return {measuredIndicated:f.amount-f.inferred,inferred:f.inferred,total:f.amount};}
export function coverageFeatures(collection,scale,year=2025){return collection.features.filter(f=>Number(f.properties.ESCALA)===Number(scale)&&Number(f.properties.ANO_MAPA)<=year&&f.properties.SITUACAO==='Publicado');}
export function normalizeWinding(collection,d3){const copy=structuredClone(collection);for(const f of copy.features){const polygons=f.geometry.type==='MultiPolygon'?f.geometry.coordinates:[f.geometry.coordinates];for(const rings of polygons){if(d3.geoArea({type:'Polygon',coordinates:rings})>2*Math.PI)rings.forEach(r=>r.reverse());}}return copy;}
