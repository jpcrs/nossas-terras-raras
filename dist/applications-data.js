// Application examples reuse the sourced element descriptions and technology mappings
// in data.js. They describe possible compositions, never a product bill of materials.
const piece=(name,materials,text)=>({name,materials,text});
export const applications=[
 {id:'ev',name:'Carro elétrico',category:'MOBILIDADE',defaultPart:2,source:'doe2023'},
 {id:'wind',name:'Eólica',category:'ENERGIA',defaultPart:1,source:'doe2023'},
 {id:'optics',name:'Telas e vidros',category:'LUZ & ÓPTICA',defaultPart:0,source:'reeeduca'},
 {id:'fiber',name:'Fibra óptica',category:'COMUNICAÇÃO',defaultPart:0,source:'reeeduca'},
 {id:'laser',name:'Lasers',category:'APLICAÇÕES ÓPTICAS',defaultPart:0,source:'reeeduca'},
 {id:'alloys',name:'Ligas metálicas',category:'MATERIAIS',defaultPart:0,source:'reeeduca'},
 {id:'special',name:'Usos especiais',category:'APLICAÇÕES ESPECIALIZADAS',defaultPart:0,source:'reeeduca'},
 {id:'solar',name:'Painel solar',category:'ENERGIA',defaultPart:1,source:'doe2023'},
];
export function applicationParts(id,{motor='magnet',battery='nmc'}={}){
 const magnetic=motor==='magnet';
 const motorMaterials=magnetic?['Nd','Pr','Dy','Tb','Cu','Fe']:['Cu','Al','Fe'];
 const motorText=magnetic?'Neodímio e praseodímio participam dos ímãs NdFeB. Disprósio e térbio podem aumentar a resistência à desmagnetização em altas temperaturas; seu uso depende da formulação.':'Motores de indução podem dispensar ímãs permanentes de terras raras. O campo magnético é produzido por correntes elétricas.';
 if(id==='ev')return [
  piece('Estrutura',['Fe','Al','Nb'],'Aços e alumínio formam a estrutura. Nióbio pode aumentar a resistência de alguns aços, conforme a especificação.'),
  piece('Bateria',battery==='nmc'?['Li','Ni','Mn','Co','C','Cu','Al']:['Li','C','Cu','Al','Fe'],battery==='nmc'?'O cátodo NMC usa níquel, manganês e cobalto. Grafita, cobre e alumínio têm outras funções na bateria.':'O cátodo LFP usa fosfato de ferro e lítio. Não depende de níquel ou cobalto no cátodo. Grafita, cobre e alumínio continuam relevantes.'),
  piece('Motor',motorMaterials,motorText),
  piece('Eletrônica',['Si','Cu','Ta'],'Semicondutores controlam a energia. Silício, cobre e tântalo têm funções distintas nos circuitos e componentes.'),
 ];
 if(id==='wind')return [
  piece('Rotor',['Fe'],'As pás e o rotor transformam vento em movimento. Os compósitos das pás estão fora deste catálogo mineral.'),
  piece('Gerador',motorMaterials,magnetic?'Alguns geradores eólicos usam ímãs NdFeB. Nd e Pr participam do ímã; Dy e Tb podem melhorar seu desempenho térmico. Outras arquiteturas dispensam esses ímãs.':'Geradores sem ímãs permanentes usam excitação elétrica ou indução. A composição depende da arquitetura.'),
  piece('Torre',['Fe','Nb'],'A torre usa aço. Nióbio pode integrar aços de alta resistência, conforme a especificação.'),
  piece('Conexões',['Cu','Al'],'Cabos e conexões conduzem a eletricidade. A escolha de cobre ou alumínio depende da aplicação.'),
 ];
 if(id==='optics')return [
  piece('Fósforos',['Eu','Y'],'Európio e ítrio têm aplicações em fósforos: materiais usados para emitir luz. A composição depende da tecnologia de iluminação ou de tela.'),
  piece('Vidros ópticos',['La'],'Lantânio tem aplicações em vidros ópticos. Sua presença depende da composição do vidro.'),
  piece('Polimento',['Ce'],'Compostos de cério são usados no polimento de vidro. Aqui, o material participa da fabricação; isso não significa que integre o vidro acabado.'),
 ];
 if(id==='fiber')return [piece('Amplificação óptica',['Er'],'Érbio tem aplicação na amplificação de sinais ópticos, incluindo fibras de telecomunicações. Sua função está no amplificador, não em toda a extensão do cabo.')];
 if(id==='laser')return [
  piece('Lasers de fibra',['Yb'],'Itérbio tem aplicação em lasers de fibra. O elemento usado varia conforme a tecnologia do laser.'),
  piece('Outros lasers',['Ho','Tm'],'Hólmio e túlio têm aplicações em lasers especializados. São exemplos de materiais para tecnologias diferentes, não uma mistura obrigatória.'),
 ];
 if(id==='alloys')return [
  piece('Ligas alumínio–escândio',['Sc','Al'],'Escândio tem aplicação em ligas de alumínio. É um dos elementos associados à família das terras raras, embora não seja um lantanídeo.'),
  piece('Outras ligas',['La','Y','Yb'],'Lantânio, ítrio e itérbio têm aplicações em ligas. Cada elemento pode integrar formulações diferentes; não se trata de uma liga única com todos eles.'),
 ];
 if(id==='special')return [
  piece('Ímãs SmCo',['Sm','Co'],'Samário participa de ímãs samário–cobalto, inclusive para ambientes de alta temperatura. São uma família diferente dos ímãs NdFeB.'),
  piece('Aplicações magnéticas',['Gd'],'Gadolínio apresenta propriedades magnéticas. Algumas classificações o incluem entre as terras raras médias.'),
  piece('Cintiladores',['Lu'],'Lutécio tem aplicações em cintiladores e em tecnologias médicas. O elemento participa de materiais específicos, conforme o equipamento.'),
 ];
 if(id==='solar')return [
  piece('Cobertura e vidro',['Si'],'Sílica é matéria-prima do vidro. Sua composição e processamento diferem do silício das células.'),
  piece('Células',['Si'],'Silício de alta pureza converte luz em eletricidade. Prata também é relevante, embora esteja fora deste catálogo. Este exemplo de módulo de silício não depende de terras raras nas peças mostradas.'),
  piece('Interconexões',['Cu'],'Condutores conectam as células. A metalização pode usar diferentes materiais e rotas.'),
  piece('Moldura',['Al'],'Alumínio protege e sustenta o módulo.'),
 ];
 return [];
}

// Keep every selectable composition in the downloadable research snapshot.
export const applicationExamples=applications.map(application=>{
 const configurations=application.id==='ev'
  ?['magnet','induction'].flatMap(motor=>['nmc','lfp'].map(battery=>({motor,battery})))
  :application.id==='wind'?['magnet','induction'].map(motor=>({motor})):[{}];
 return {...application,variants:configurations.map(configuration=>({configuration,components:applicationParts(application.id,configuration)}))};
});
