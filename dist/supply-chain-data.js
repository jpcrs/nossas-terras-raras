// Transcribed from the IEA chart's data-chart-csv, preserved verbatim in assets/.
// Published zeros are kept as zero; rounded shares are not renormalised.
export const supplyChain = {
  year: 2024,
  unit: '% da produção mundial',
  elements: ['Nd', 'Pr', 'Dy', 'Tb'],
  source: 'ieaSupply',
  rawData: 'assets/iea-magnet-supply-2024.csv',
  retrieved: '2026-10-05',
  licence: 'IEA · CC BY 4.0',
  countryOrder: ['China', 'Estados Unidos'],
  zeroNote: '0,0% é o valor publicado pela IEA na série com uma casa decimal. Não significa necessariamente ausência de atividade no país.',
  roundingNote: 'As parcelas originais somam 99,9% na extração e 100,0% nas outras etapas. O atlas preserva os valores, sem ajustar o arredondamento. O recorte mostra China e Estados Unidos como parcelas do total mundial, não da soma dos dois países.',
  stages: [
    {
      id: 'mining', number: '01', name: 'Extração', output: 'Do minério ao concentrado',
      description: 'A mineração e o beneficiamento obtêm um concentrado de terras raras.',
      implication: 'Mountain Pass, na Califórnia, fornece sobretudo terras raras leves. Extrair esse minério não substitui as etapas químicas e industriais seguintes.',
      values: [58.9, 9.6],
    },
    {
      id: 'refining', number: '02', name: 'Separação e refino', output: 'Do concentrado aos óxidos',
      description: 'Os elementos são separados e purificados para fornecer óxidos à indústria.',
      implication: 'Aqui a diferença se amplia: separar elementos quimicamente semelhantes exige processos especializados. Uma mina não entrega, por si só, óxidos prontos para uso.',
      values: [91.3, 1.2],
    },
    {
      id: 'magnets', number: '03', name: 'Fabricação de ímãs', output: 'Dos materiais ao componente',
      description: 'Após a produção de metais e ligas, são fabricados os ímãs permanentes sinterizados.',
      implication: 'É o componente que chega a motores, eletrônicos e sistemas de defesa. A concentração nesta etapa mantém a dependência industrial mesmo onde há mineração.',
      values: [94.4, 0],
    },
  ],
  metallurgy: {
    name: 'Metalização e ligas',
    chinaMetalShare: 90,
    chinaAlloyShare: 90,
    usaShare: null,
    year: null,
    source: 'nrcanMagnets',
    published: '2025-01-09',
    note: 'A fonte informa 90% para metais e 90% para ligas, sem explicitar o ano-base ou uma participação dos EUA. Não integra a série IEA de 2024.',
  },
  totalMining: {
    year: 2025,
    estimated: true,
    values: [270000, 51000],
    world: 390000,
    unit: 't de REO',
    source: 'usgsREE',
    note: 'Recorte de terras raras da tabela USGS, mais amplo que Nd, Pr, Dy e Tb. Participações calculadas sobre o total mundial arredondado; não são pontos da série IEA de 2024.',
  },
  usProgress: {
    year: 2025,
    ndprOxideTonnes: 2599,
    metalProductionStarted: '2025-01',
    firstMagnetsOnCommercialEquipment: '2025-Q4',
    sources: ['mpMetal2025', 'mpResults2025'],
    note: 'Marcos divulgados pela MP Materials. Produção de óxidos de NdPr, metal e primeiros ímãs não são volumes intercambiáveis nem uma estimativa da participação mundial dos EUA.',
  },
};

export const supplyPercent = value => value.toLocaleString('pt-BR', {
  minimumFractionDigits: 1, maximumFractionDigits: 1,
}) + '%';
