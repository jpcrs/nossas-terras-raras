// Sourced examples of uses, not a universal bill of materials. Descriptions reuse
// the element and mineral profiles in data.js and the cited application sources.
const material=(symbol,use,description)=>({symbol,use,description});
export const applications=[
 {id:'ev',name:'Carro elétrico',category:'MOBILIDADE',source:'doe2023',summary:'Do motor à bateria, passando pela estrutura e pela eletrônica.',materials:[
  material('Nd','Motor','Forma ímãs NdFeB usados em alguns motores elétricos.'),
  material('Pr','Motor','Combina-se com neodímio em ímãs de alto desempenho.'),
  material('Dy','Motor','Pode aumentar a resistência dos ímãs à desmagnetização em altas temperaturas.'),
  material('Tb','Motor','Pode melhorar o desempenho térmico dos ímãs, conforme a formulação.'),
  material('Li','Bateria','Transporta carga nas baterias de íons de lítio.'),
  material('Ni','Bateria','Integra cátodos NMC. Não é usado no cátodo LFP.'),
  material('Mn','Bateria','Participa do cátodo de baterias NMC; não do LFP convencional.'),
  material('Co','Bateria','Compõe cátodos NMC. Baterias LFP dispensam cobalto no cátodo.'),
  material('C','Bateria','A grafita é usada no ânodo, um dos eletrodos da bateria.'),
  material('Cu','Condução elétrica','Conduz eletricidade no motor, na fiação e em componentes da bateria.'),
  material('Al','Estrutura e bateria','Forma peças da carroceria e componentes da bateria.'),
  material('Fe','Estrutura, motor e bateria','É a base do aço e participa de motores e de cátodos LFP.'),
  material('Nb','Estrutura','Pequenas adições podem aumentar a resistência de alguns aços.'),
  material('Si','Eletrônica','Forma semicondutores que controlam a energia do veículo.'),
  material('Ta','Eletrônica','É empregado em capacitores de circuitos eletrônicos.'),
 ]},
 {id:'wind',name:'Eólica',category:'ENERGIA',source:'doe2023',summary:'Materiais para o gerador, a torre e as conexões elétricas.',materials:[
  material('Nd','Gerador','Forma ímãs NdFeB usados em alguns geradores eólicos.'),
  material('Pr','Gerador','Participa, com neodímio, dos ímãs de certos geradores.'),
  material('Dy','Gerador','Pode aumentar a resistência térmica dos ímãs, conforme o projeto.'),
  material('Tb','Gerador','Pode melhorar o desempenho dos ímãs em altas temperaturas.'),
  material('Cu','Condução elétrica','É usado no gerador, nos cabos e nas conexões.'),
  material('Al','Condução elétrica','Pode ser usado em cabos e conexões, conforme a aplicação.'),
  material('Fe','Torre e rotor','É a base dos aços usados na estrutura e em componentes mecânicos.'),
  material('Nb','Torre','Pode integrar aços de alta resistência, conforme a especificação.'),
 ]},
 {id:'optics',name:'Telas e vidros',category:'LUZ & ÓPTICA',source:'reeeduca',summary:'Elementos que participam da emissão de luz e da fabricação de vidros.',materials:[
  material('Eu','Emissão de luz','Tem aplicação em fósforos, materiais usados para emitir luz.'),
  material('Y','Emissão de luz','Participa de fósforos usados em tecnologias de iluminação e telas.'),
  material('La','Vidros ópticos','Integra algumas formulações de vidro para aplicações ópticas.'),
  material('Ce','Polimento de vidro','Seus compostos ajudam a polir o vidro durante a fabricação; não necessariamente ficam no produto.'),
 ]},
 {id:'fiber',name:'Fibra óptica',category:'COMUNICAÇÃO',source:'reeeduca',summary:'A amplificação permite que o sinal óptico siga pelo sistema de comunicação.',materials:[
  material('Er','Amplificação óptica','Amplifica sinais em sistemas de fibras de telecomunicações. Sua função está no amplificador, não em toda a extensão do cabo.'),
 ]},
 {id:'laser',name:'Lasers',category:'APLICAÇÕES ÓPTICAS',source:'reeeduca',summary:'Diferentes elementos atendem a diferentes tecnologias de laser.',materials:[
  material('Yb','Lasers de fibra','Tem aplicação em lasers de fibra, conforme a tecnologia do equipamento.'),
  material('Ho','Lasers especializados','É usado em aplicações específicas de laser.'),
  material('Tm','Lasers especializados','Tem aplicação em lasers especializados; não precisa estar combinado com os demais elementos.'),
 ]},
 {id:'alloys',name:'Ligas metálicas',category:'MATERIAIS',source:'reeeduca',summary:'Elementos que entram em formulações de ligas diferentes.',materials:[
  material('Sc','Ligas de alumínio','É adicionado a ligas alumínio–escândio.'),
  material('Al','Metal de base','É o metal de base das ligas alumínio–escândio.'),
  material('La','Ligas','Tem aplicações em ligas, dependendo da formulação.'),
  material('Y','Ligas','Integra formulações de ligas para aplicações específicas.'),
  material('Yb','Ligas especiais','Tem aplicação em ligas especiais. Os elementos desta seleção não formam uma única receita.'),
 ]},
 {id:'special',name:'Usos especiais',category:'APLICAÇÕES ESPECIALIZADAS',source:'reeeduca',summary:'Materiais para ímãs, aplicações magnéticas e cintiladores.',materials:[
  material('Sm','Ímãs SmCo','Forma ímãs samário–cobalto, inclusive para ambientes de alta temperatura.'),
  material('Co','Ímãs SmCo','Combina-se com samário nessa família de ímãs.'),
  material('Gd','Aplicações magnéticas','É utilizado por suas propriedades magnéticas.'),
  material('Lu','Cintiladores','Participa de cintiladores e de tecnologias médicas, conforme o equipamento.'),
 ]},
 {id:'solar',name:'Painel solar',category:'ENERGIA',source:'doe2023',summary:'Neste exemplo de módulo de silício, os materiais destacados não são terras raras.',materials:[
  material('Si','Células e vidro','Silício de alta pureza converte luz em eletricidade. A sílica é matéria-prima do vidro de proteção.'),
  material('Cu','Interconexões','Conduz eletricidade nas conexões entre as células.'),
  material('Al','Moldura','Protege e sustenta o módulo.'),
 ],note:'Prata também é relevante para as células, mas não tem ficha individual neste atlas.'},
];
export const applicationExamples=applications;
