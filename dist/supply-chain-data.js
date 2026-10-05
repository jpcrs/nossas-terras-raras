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
      values: [58.9, 9.6],
    },
    {
      id: 'refining', number: '02', name: 'Separação e refino', output: 'Do concentrado aos óxidos',
      description: 'Os elementos são separados e purificados para fornecer óxidos à indústria.',
      values: [91.3, 1.2],
    },
    {
      id: 'magnets', number: '03', name: 'Fabricação de ímãs', output: 'Dos materiais ao componente',
      description: 'Após a produção de metais e ligas, são fabricados os ímãs permanentes sinterizados.',
      values: [94.4, 0],
    },
  ],
};

export const supplyPercent = value => value.toLocaleString('pt-BR', {
  minimumFractionDigits: 1, maximumFractionDigits: 1,
}) + '%';
