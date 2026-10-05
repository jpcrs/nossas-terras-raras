// USGS MCS 2026, Rare Earths, version 1.2. Quantities are REO equivalent.
// Import reliance and supplier shares have different denominators and periods.
export const usDependence = {
  source: 'usgsImports', retrieved: '2026-10-05',
  rawData: 'assets/us-rare-earth-imports-2026.csv',
  scope: 'Compostos e metais de terras raras. Inclui lantanídeos e ítrio; exclui a maior parte do escândio e não contabiliza toda a dependência embutida em produtos acabados.',
  years: [
    {year: 2024, netImportReliance: 53, apparentConsumption: 9010, compoundImports: 8120, importValueMillionUSD: 168},
    {year: 2025, netImportReliance: 67, apparentConsumption: 27000, compoundImports: 21000, importValueMillionUSD: 165},
  ],
  origins: {
    period: '2021–2024',
    countries: [
      {id: 'china', name: 'China', share: 71},
      {id: 'malaysia', name: 'Malásia', share: 13},
      {id: 'japan', name: 'Japão', share: 5},
      {id: 'estonia', name: 'Estônia', share: 5},
      {id: 'other', name: 'Outros', share: 6},
    ],
    note: 'China inclui Hong Kong. Países fornecedores podem processar materiais originários da China, Austrália e outros países; origem comercial não equivale à origem mineral.',
  },
  risk: {
    source: 'ieaUSRisk', country: 'Estados Unidos', baselineYear: 2025,
    minimumTrillionUSD: 1.5, relation: 'greater-than', annual: true,
    scenario: 'Implementação integral dos controles de exportação de terras raras anunciados pela China em 2025.',
    note: 'Estimativa condicional de perdas econômicas diretas nos EUA. Não é perda realizada nem projeção de queda do PIB. Os controles ampliados de outubro de 2025 foram suspensos por um ano em novembro de 2025.',
  },
};
