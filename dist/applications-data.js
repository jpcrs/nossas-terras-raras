// Audit: 2026-10-05. Each material has contextual evidence; counts are a sourced
// selection across technologies, not a universal bill of materials. See research/APPLICATIONS-AUDIT-2026.md.
export const applications=[
 {"id":"phone","name":"Smartphone","category":"NO BOLSO","source":"usgsPhone","summary":"Ímãs, circuitos, luz e vidro: várias terras raras dividem o trabalho.","note":"A composição muda com o modelo e a geração. Os usos históricos estão identificados nos cartões.","materials":[
  {"symbol":"Nd","use":"Som e vibração","description":"Forma ímãs compactos em alto-falantes e atuadores de vibração.","sources":["usgsPhone","appleMagnets"]},
  {"symbol":"Pr","use":"Ímãs compactos","description":"Combina-se com neodímio em ímãs usados na eletrônica do aparelho.","sources":["appleMagnets","acsPhone"]},
  {"symbol":"Dy","use":"Ímãs e vibração","description":"Integra certas formulações de ímãs; ajuda a preservar o magnetismo sob calor.","sources":["appleMagnets","acsPhone","doeMagnetChemistry"]},
  {"symbol":"Tb","use":"Ímãs compactos","description":"É usado em formulações de ímãs de dispositivos Apple, conforme o componente.","sources":["appleMagnets"]},
  {"symbol":"La","use":"Circuitos e tela","description":"É associado a circuitos e telas no inventário de smartphones publicado pela ACS.","sources":["acsPhone"],"scope":"Recorte de 2014"},
  {"symbol":"Gd","use":"Alto-falantes e circuitos","description":"A ACS o identifica nesses componentes em seu inventário de smartphones.","sources":["acsPhone"],"scope":"Recorte de 2014"},
  {"symbol":"Y","use":"Materiais da tela","description":"Participa de materiais luminescentes de certas tecnologias de tela.","sources":["acsPhone"],"scope":"Recorte de 2014"},
  {"symbol":"Eu","use":"Luz vermelha","description":"Seus compostos podem produzir emissão vermelha em materiais luminescentes da tela.","sources":["acsPhone"],"scope":"Recorte de 2014"},
  {"symbol":"Ce","use":"Polimento do vidro","description":"Seu óxido é usado no polimento durante a fabricação; pode não permanecer no aparelho.","sources":["acsPhone"],"scope":"Na fabricação"}
 ]},
 {"id":"ev","name":"Carro elétrico","category":"MOBILIDADE","source":"doe2023","summary":"Ímãs de terras raras ajudam a transformar eletricidade em movimento.","note":"As quatro terras raras mostradas se referem a motores com ímãs. Há motores sem terras raras. Lantânio e cério também aparecem em uma pesquisa da Toyota (2018), sem confirmação de produção em série nessa fonte; não entram nesta contagem.","additionalSources":["toyotaMagnet"],"materials":[
  {"symbol":"Nd","use":"Motor","description":"Forma ímãs NdFeB usados em alguns motores elétricos.","sources":["doeMagnetChemistry"]},
  {"symbol":"Pr","use":"Motor","description":"Combina-se com neodímio em ímãs de alto desempenho.","sources":["doeMagnetChemistry"]},
  {"symbol":"Dy","use":"Motor","description":"Pode aumentar a resistência dos ímãs à desmagnetização em altas temperaturas.","sources":["doeMagnetChemistry"]},
  {"symbol":"Tb","use":"Motor","description":"Pode melhorar o desempenho térmico dos ímãs, conforme a formulação.","sources":["doeMagnetChemistry"]}
 ]},
 {"id":"wind","name":"Eólica","category":"ENERGIA","source":"doe2023","summary":"Ímãs de terras raras participam da geração de eletricidade em certas turbinas.","note":"Estas quatro terras raras se referem a geradores com ímãs permanentes; a combinação depende do projeto. Turbinas com outras arquiteturas podem dispensá-las.","materials":[
  {"symbol":"Nd","use":"Gerador","description":"Forma ímãs NdFeB usados em alguns geradores eólicos.","sources":["doeMagnetChemistry"]},
  {"symbol":"Pr","use":"Gerador","description":"Participa, com neodímio, dos ímãs de certos geradores.","sources":["doeMagnetChemistry"]},
  {"symbol":"Dy","use":"Gerador","description":"Pode aumentar a resistência térmica dos ímãs, conforme o projeto.","sources":["doeMagnetChemistry"]},
  {"symbol":"Tb","use":"Gerador","description":"Pode melhorar o desempenho dos ímãs em altas temperaturas.","sources":["doeMagnetChemistry"]}
 ]},
 {"id":"lighting","name":"Iluminação eficiente","category":"LUZ & ENERGIA","source":"usgsLighting","additionalSources":["doePhosphors"],"summary":"A luz branca pode combinar um LED com materiais que convertem sua cor.","note":"O conjunto reúne LEDs e fluorescentes, tecnologias com composições diferentes. Não são seis elementos obrigatórios em uma lâmpada.","materials":[
  {"symbol":"Y","use":"Matriz de fósforos","description":"Forma o cristal YAG, uma das matrizes usadas na conversão de luz em LEDs.","sources":["nichiaLED"]},
  {"symbol":"Ce","use":"Conversão de luz","description":"Ativa a luminescência do YAG:Ce, que ajuda a produzir luz branca a partir de um LED azul.","sources":["nichiaLED"]},
  {"symbol":"Eu","use":"Fósforos de iluminação","description":"É usado em materiais luminescentes de LEDs e fluorescentes; a cor depende da composição.","sources":["usgsLighting","doePhosphors"]},
  {"symbol":"Tb","use":"Fluorescentes","description":"Produz a componente verde em certas formulações de fósforos.","sources":["doePhosphors"],"scope":"Tecnologia fluorescente"},
  {"symbol":"La","use":"Matriz de fósforos","description":"Participa de fósforos de lâmpadas fluorescentes, combinando-se com outros elementos.","sources":["doePhosphors"],"scope":"Tecnologia fluorescente"},
  {"symbol":"Gd","use":"Ajuste da emissão","description":"Pode substituir parte do ítrio em fósforos de LED e deslocar a faixa de luz emitida.","sources":["nichiaLED"],"scope":"Formulações específicas"}
 ]},
 {"id":"mri","name":"Ressonância magnética","category":"SAÚDE","source":"fdaMRI","summary":"No contraste e em certos ímãs, funções diferentes ajudam a formar a imagem.","note":"Contraste e ímã são aplicações separadas. Aparelhos de alto campo com ímãs supercondutores não devem ser descritos como ímãs NdFeB ou SmCo.","additionalSources":["mriMagnets"],"materials":[
  {"symbol":"Gd","use":"Agente de contraste","description":"Seus compostos são usados no contraste de alguns exames para melhorar a diferenciação nas imagens.","sources":["fdaMRI"],"scope":"Em alguns exames"},
  {"symbol":"Nd","use":"Ímã permanente","description":"Ímãs NdFeB produzem o campo de alguns aparelhos de baixo campo.","sources":["mriMagnets"],"scope":"Aparelhos específicos"},
  {"symbol":"Sm","use":"Ímã de baixo campo","description":"Um protótipo de ressonância cerebral de 2021 usa um ímã samário–cobalto de 0,055 tesla.","sources":["mriMagnets"],"scope":"Protótipo de pesquisa"}
 ]},
 {"id":"camera","name":"Câmeras e telescópios","category":"LUZ & ÓPTICA","source":"rscLanthanum","additionalSources":["vixenOptics"],"summary":"A composição do vidro controla a óptica; o polimento dá acabamento às superfícies.","note":"São exemplos de vidros e processos ópticos. Uma câmera ou um telescópio não precisa conter todos eles, e muitas lentes são feitas de outros materiais.","materials":[
  {"symbol":"La","use":"Lentes e oculares","description":"Integra vidros ópticos e oculares comerciais de telescópios, como a linha Vixen SLV.","sources":["rscLanthanum","vixenOptics","schottGlass"]},
  {"symbol":"Gd","use":"Vidros ópticos","description":"Seu óxido integra a composição do vidro óptico SCHOTT N-LAK33B.","sources":["schottGlass"],"scope":"Formulação específica"},
  {"symbol":"Y","use":"Vidros ópticos","description":"Também compõe o N-LAK33B, junto com óxidos de lantânio e gadolínio.","sources":["schottGlass"],"scope":"Formulação específica"},
  {"symbol":"Ce","use":"Polimento de vidro","description":"Seu óxido é empregado no acabamento de superfícies de vidro; não precisa ficar na lente.","sources":["usgsPolishing"],"scope":"Na fabricação"}
 ]},
 {"id":"jet","name":"Motores a jato","category":"AVIAÇÃO CIVIL & MILITAR","source":"nasaCoatings","additionalSources":["gaoDefense"],"summary":"Terras raras ajudam a proteger turbinas e a estudar seu comportamento sob calor.","note":"A formulação varia com motor e componente. O érbio é um exemplo de diagnóstico em pesquisa, sem comprovação de uso em série em um caça específico.","materials":[
  {"symbol":"Y","use":"Barreira térmica","description":"Seu óxido estabiliza a zircônia de revestimentos que protegem componentes metálicos do calor.","sources":["nasaCoatings"]},
  {"symbol":"Yb","use":"Proteção de cerâmicas","description":"O dissilicato de itérbio forma barreiras contra a degradação de componentes de matriz cerâmica.","sources":["nasaCoatings"],"scope":"Turbinas avançadas"},
  {"symbol":"Er","use":"Medição de temperatura","description":"A NASA testa revestimentos luminescentes com érbio para medir a temperatura sem contato.","sources":["nasaCoatings"],"scope":"Em pesquisa"}
 ]},
 {"id":"guidance","name":"Guiagem de mísseis","category":"DEFESA","source":"crsDefenseFigures","summary":"Cinco terras raras são documentadas pelo CRS em famílias de ímãs de guiagem e controle.","additionalSources":["crsDefense"],"note":"A figura do CRS reúne diferentes sistemas e ligas; não informa a composição de cada míssil nem diz que todos usam os cinco elementos.","materials":[
  {"symbol":"Nd","use":"Motores e atuadores","description":"Ímãs NdFeB integram componentes compactos que movimentam sistemas de controle.","sources":["crsDefenseFigures"]},
  {"symbol":"Pr","use":"Ímãs de controle","description":"O CRS inclui praseodímio nos materiais magnéticos de motores e atuadores de guiagem.","sources":["crsDefenseFigures"]},
  {"symbol":"Sm","use":"Ímãs resistentes ao calor","description":"Forma ímãs SmCo usados em equipamentos de controle.","sources":["crsDefenseFigures","crsDefense"]},
  {"symbol":"Dy","use":"Formulações de ímãs","description":"Pode aumentar a resistência à desmagnetização de ímãs usados no controle.","sources":["crsDefenseFigures","doeMagnetChemistry"]},
  {"symbol":"Tb","use":"Formulações de ímãs","description":"É outro elemento citado pelo CRS para ímãs de sistemas de guiagem.","sources":["crsDefenseFigures"]}
 ]},
 {"id":"military-comms","name":"Comunicações militares","category":"COMUNICAÇÃO & DEFESA","source":"armyApplications","additionalSources":["crsDefense"],"summary":"Ímãs, componentes de rádio e amplificadores ópticos cumprem tarefas diferentes.","note":"São tecnologias de comunicação usadas também no setor civil. O recorte não é a lista de peças de um rádio militar específico.","materials":[
  {"symbol":"Sm","use":"Ímãs de equipamentos","description":"Ímãs SmCo têm usos em sistemas de comunicação por satélite.","sources":["armyApplications","crsDefense"]},
  {"symbol":"Nd","use":"Componentes magnéticos","description":"Ímãs NdFeB permitem componentes compactos de equipamentos de comunicação.","sources":["armyApplications","crsDefense"]},
  {"symbol":"Y","use":"Componentes de micro-ondas","description":"Forma granadas magnéticas usadas em circuladores e isoladores de radiofrequência.","sources":["exxeliaFerrites","exxeliaRF"]},
  {"symbol":"Gd","use":"Granadas de micro-ondas","description":"Integra algumas formulações dessas cerâmicas, como a família Y–Gd–Al–Co da Exxelia.","sources":["exxeliaFerrites","exxeliaRF"],"scope":"Formulações específicas"},
  {"symbol":"Er","use":"Enlaces ópticos","description":"Amplifica sinais em sistemas de fibra óptica; o uso é descrito também pelo Exército dos EUA.","sources":["armyApplications","coherentAmplifiers"]}
 ]},
 {"id":"refining","name":"Refino de petróleo","category":"INDÚSTRIA QUÍMICA","source":"usgsApplications","additionalSources":["rscLanthanum","fccRecovery"],"summary":"Aqui, a função está na química do processo de refino.","note":"O uso depende da formulação do catalisador. Os elementos participam do processo; isso não significa que sejam adicionados ao combustível final.","materials":[
  {"symbol":"La","use":"Catalisadores FCC","description":"Compostos de lantânio integram catalisadores de craqueamento catalítico do petróleo.","sources":["usgsApplications","fccRecovery"]},
  {"symbol":"Ce","use":"Catalisadores FCC","description":"Também é encontrado em catalisadores de craqueamento usados, junto com lantânio.","sources":["fccRecovery"]}
 ]},
 {"id":"optics","name":"Telas e vidros","category":"LUZ & ÓPTICA","source":"acsPhone","summary":"Fósforos de telas, vidros ópticos e materiais usados no acabamento.","note":"A lista combina famílias de telas e vidros. Fósforos de tecnologias antigas não devem ser atribuídos automaticamente a uma tela OLED atual.","materials":[
  {"symbol":"Eu","use":"Materiais luminescentes","description":"É associado à emissão de cor em tecnologias de tela com fósforos.","sources":["acsPhone"],"scope":"Tecnologias específicas"},
  {"symbol":"Tb","use":"Materiais da tela","description":"É citado entre os materiais de telas no inventário histórico da ACS.","sources":["acsPhone"],"scope":"Recorte de 2014"},
  {"symbol":"Y","use":"Fósforos e vidros","description":"Aparece em materiais de telas e em formulações comerciais de vidro óptico.","sources":["acsPhone","schottGlass"]},
  {"symbol":"La","use":"Vidros ópticos","description":"Seu óxido compõe vidros como o N-LAK33B, da SCHOTT.","sources":["schottGlass"]},
  {"symbol":"Gd","use":"Vidros ópticos","description":"Também faz parte da formulação N-LAK33B.","sources":["schottGlass"],"scope":"Formulação específica"},
  {"symbol":"Ce","use":"Polimento de vidro","description":"Seu óxido ajuda a polir vidro durante a fabricação.","sources":["usgsPolishing"],"scope":"Na fabricação"},
  {"symbol":"Pr","use":"Materiais da tela","description":"O inventário da ACS o associa a telas de smartphones.","sources":["acsPhone"],"scope":"Recorte de 2014"},
  {"symbol":"Dy","use":"Materiais da tela","description":"Também é citado no recorte histórico de telas da ACS.","sources":["acsPhone"],"scope":"Recorte de 2014"}
 ]},
 {"id":"fiber","name":"Fibra óptica","category":"COMUNICAÇÃO","source":"coherentAmplifiers","summary":"Pequenos trechos de fibra ativa recuperam a intensidade do sinal.","note":"As terras raras ficam na fibra ativa do amplificador, não em todo o cabo. Lasers de fibra com outros dopantes aparecem na aplicação Lasers.","materials":[
  {"symbol":"Er","use":"Amplificação óptica","description":"Amplifica sinais em torno de 1.550 nm em fibras ativas.","sources":["armyApplications","coherentAmplifiers"]},
  {"symbol":"Yb","use":"Fibras codopadas","description":"Combina-se com érbio em fibras comerciais para amplificadores de alta potência.","sources":["coherentAmplifiers"]},
  {"symbol":"Pr","use":"Amplificação na banda O","description":"É usado em amplificadores PDFA, em torno de 1.310 nm, como os da FiberLabs.","sources":["fiberlabsPr"]}
 ]},
 {"id":"laser","name":"Lasers","category":"APLICAÇÕES ÓPTICAS","source":"coherentLasers","summary":"Alguns elementos emitem o feixe; outros formam o cristal ou protegem o sistema.","note":"São meios ativos, cristais e componentes de lasers diferentes. Os sete elementos não precisam estar no mesmo equipamento.","materials":[
  {"symbol":"Nd","use":"Meio ativo","description":"Produz emissão laser em cristais como Nd:YAG e também em certas fibras dopadas.","sources":["synopticsCrystals","coherentLasers"]},
  {"symbol":"Er","use":"Meio ativo","description":"É usado em lasers de fibra e em cristais como Er:YAG.","sources":["synopticsCrystals","coherentLasers"]},
  {"symbol":"Yb","use":"Lasers de fibra","description":"É um dopante ativo em lasers de fibra para aplicações industriais e científicas.","sources":["coherentLasers"]},
  {"symbol":"Ho","use":"Lasers no infravermelho","description":"É um dos dopantes de fibras que emitem no infravermelho próximo.","sources":["coherentLasers"]},
  {"symbol":"Tm","use":"Lasers no infravermelho","description":"Produz emissão em outra família de lasers de fibra no infravermelho.","sources":["coherentLasers"]},
  {"symbol":"Y","use":"Cristal hospedeiro","description":"Integra a granada de ítrio e alumínio, YAG, que recebe dopantes como Nd e Er.","sources":["synopticsCrystals"]},
  {"symbol":"Tb","use":"Isoladores ópticos","description":"Cristais como TGG ajudam a proteger lasers contra luz refletida de volta ao sistema.","sources":["synopticsFaraday"]}
 ]},
 {"id":"alloys","name":"Ligas metálicas","category":"MATERIAIS","source":"rusalSc","summary":"Pequenas adições mudam o desempenho; cada liga tem sua própria composição.","note":"A lista reúne exemplos de ligas distintas. LaNi₅ é um material armazenador de hidrogênio; WE43B e Elektron 21 têm magnésio como metal de base.","materials":[
  {"symbol":"Sc","use":"Ligas de alumínio","description":"É adicionado ao alumínio para aumentar a resistência mecânica, conforme a formulação.","sources":["rusalSc"]},
  {"symbol":"Ce","use":"Ligas de alumínio","description":"Ligas Al–Ce desenvolvidas pelo ORNL mantêm estabilidade em temperaturas elevadas.","sources":["ornlCe"]},
  {"symbol":"Y","use":"Ligas de magnésio","description":"É um dos componentes especificados na liga comercial WE43B.","sources":["luxferY"]},
  {"symbol":"Nd","use":"Ligas de magnésio","description":"Compõe a liga Elektron 21, desenvolvida para aplicações aeroespaciais.","sources":["luxferNdGd"]},
  {"symbol":"Gd","use":"Ligas de magnésio","description":"Também integra a Elektron 21, junto com neodímio e outros metais.","sources":["luxferNdGd"]},
  {"symbol":"La","use":"Armazenamento de hidrogênio","description":"Forma a liga LaNi₅, capaz de absorver e liberar hidrogênio.","sources":["lani5"]}
 ]},
 {"id":"special","name":"Usos especiais","category":"APLICAÇÕES ESPECIALIZADAS","source":"lysoDetector","summary":"Luz para detectar radiação e ímãs para ambientes exigentes.","note":"Cintiladores transformam radiação em luz para os detectores. As formulações listadas são alternativas, e os ímãs SmCo são uma aplicação separada.","materials":[
  {"symbol":"Lu","use":"Detectores PET","description":"Forma, com ítrio, a matriz do cintilador LYSO:Ce usado em detectores de tomografia PET.","sources":["lysoDetector"]},
  {"symbol":"Y","use":"Matriz de cintiladores","description":"Também participa do cristal LYSO:Ce, junto com lutécio.","sources":["lysoDetector"]},
  {"symbol":"Ce","use":"Emissão em cintiladores","description":"Ativa a emissão de luz nos cristais LYSO:Ce e LaBr₃:Ce.","sources":["lysoDetector","luxiumLa"]},
  {"symbol":"La","use":"Detectores de radiação","description":"Forma o brometo de lantânio do cintilador LaBr₃:Ce.","sources":["luxiumLa"]},
  {"symbol":"Gd","use":"Detecção de raios X","description":"Forma o oxissulfeto de gadolínio usado como matriz de fósforos para raios X.","sources":["nichiaXray"]},
  {"symbol":"Tb","use":"Conversão de raios X em luz","description":"Ativa a luminescência em uma formulação Gd₂O₂S:Tb comercializada pela Nichia.","sources":["nichiaXray"]},
  {"symbol":"Pr","use":"Conversão de raios X em luz","description":"É o ativador de outra formulação, Gd₂O₂S:Pr.","sources":["nichiaXray"]},
  {"symbol":"Eu","use":"Fósforos de raios X","description":"Ativa a emissão no material BaFCl:Eu, também usado na detecção de raios X.","sources":["nichiaXray"]},
  {"symbol":"Sm","use":"Ímãs resistentes ao calor","description":"Forma ímãs samário–cobalto para ambientes exigentes.","sources":["arnoldSmCo"]}
 ]}
];
export const applicationExamples=applications;
export const materialSourceKeys=(app,material)=>material.sources??[app.source];
export const applicationSourceKeys=app=>[...new Set([app.source,...(app.additionalSources??[]),...app.materials.flatMap(material=>materialSourceKeys(app,material))])];
