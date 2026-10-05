// Adamas Intelligence market analysis in the Songwe Hill technical report,
// dated 2026-04-29, pp. 54–55. Published endpoints only; no interpolated years.
export const futureDemand = {
  source: 'adamasFuture', published: '2026-04-29', retrieved: '2026-10-05',
  rawData: 'assets/adamas-rare-earth-demand-2040.csv',
  unit: 'mil t de óxidos de terras raras por ano',
  scope: 'Demanda global de óxidos de terras raras (TREO), em todas as categorias de uso do estudo.',
  coverageNote: 'A documentação pública não estabelece uma cobertura individual dos 17 elementos.',
  chartMaximum: 700,
  baseline: {year: 2024, total: 234, status: 'estimate'},
  projection: {year: 2040, total: 607, status: 'projection'},
  note: 'Projeção de mercado da Adamas Intelligence, contratada pela Mkango, publicada no relatório técnico Songwe Hill de 2026. Massa de óxidos, que inclui oxigênio; não é massa dos elementos, dos ímãs ou de minério. Os dois valores são pontos publicados, sem interpolação. Não representa uma garantia nem um déficit de oferta.',
  drivers: [
    {id: 'ev', title: 'Veículos elétricos', prefix: '', value: '2–4', unit: 'kg',
      description: 'de ímãs por motor de tração com NdFeB',
      note: 'Massa de ímãs, não de terras raras puras.',
      source: 'ieaMotors', sourceLabel: 'IEA · 2026', minimum: 2, maximum: 4, measurement: 'kg de ímãs por motor'},
    {id: 'wind', title: 'Turbinas eólicas', prefix: 'até', value: '600', unit: 'kg/MW',
      description: 'de ímãs de neodímio por capacidade instalada',
      note: 'O uso varia conforme o tipo e o porte da turbina.',
      source: 'jrcMagnets', sourceLabel: 'JRC · 2023', maximum: 600, measurement: 'kg de ímãs por MW'},
    {id: 'robotics', title: 'Robótica industrial', prefix: 'em 2029', value: '806', unit: 'mil',
      description: 'novos robôs por ano, no mundo',
      note: 'Projeção de instalações, não de consumo mineral.',
      source: 'ifrFuture', sourceLabel: 'IFR · projeção de 2026', valueUnits: 806000, year: 2029, measurement: 'instalações anuais de robôs'},
  ],
};

export function futureMetrics() {
  const {baseline, projection} = futureDemand;
  return {
    totalMultiple: projection.total / baseline.total,
    totalGrowth: (projection.total / baseline.total - 1) * 100,
    additionalDemand: projection.total - baseline.total,
  };
}
