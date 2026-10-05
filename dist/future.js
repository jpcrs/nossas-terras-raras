import {futureDemand, futureMetrics} from './future-data.js';
import {sources} from './data.js';

export function initFuture() {
  const d3 = window.d3;
  const {baseline, projection} = futureDemand;
  const rows = [baseline, projection];
  const format = (value, digits = 0) => value.toLocaleString('pt-BR', {minimumFractionDigits: digits, maximumFractionDigits: digits});
  const {totalMultiple, totalGrowth, additionalDemand} = futureMetrics();
  const root = d3.select('#future-chart');
  const svg = root.append('svg').attr('role', 'img').attr('aria-labelledby', 'future-chart-title future-chart-desc');
  svg.append('title').attr('id', 'future-chart-title').text('Demanda mundial por óxidos de terras raras, 2024 e 2040');
  svg.append('desc').attr('id', 'future-chart-desc').text(
    `Adamas Intelligence. Demanda anual: ${baseline.total} mil toneladas de óxidos de terras raras em ${baseline.year} (estimativa), ` +
    `${projection.total} mil toneladas em ${projection.year} (projeção). ${format(totalMultiple, 1)} vezes a demanda inicial, ` +
    `aumento de ${format(totalGrowth)}%. Mercado agregado; a fonte não estabelece cobertura individual dos 17 elementos.`
  );
  const plot = svg.append('g').attr('aria-hidden', 'true');

  d3.select('#future-takeaway').html(`<span class="eyebrow">DEMANDA MUNDIAL · ATÉ ${projection.year}</span>
    <strong class="future-multiplier">${format(totalMultiple, 1)}<small>×</small></strong>
    <p>a demanda anual de ${baseline.year}</p>
    <div class="future-total-growth"><strong>+${format(totalGrowth)}%</strong><span>de crescimento<br>projetado em ${projection.year - baseline.year} anos</span></div>
    <p class="future-additional">Mais <strong>${additionalDemand} mil t</strong> por ano.</p>`);
  d3.select('#future-source').attr('href', sources[futureDemand.source].url);

  d3.select('#future-drivers').selectAll('article').data(futureDemand.drivers).join('article')
    .attr('class', 'future-driver').html(d => `<h3>${d.title}</h3>
      <div class="future-driver-number"><span class="future-driver-prefix">${d.prefix || '&nbsp;'}</span><strong>${d.value}<small>${d.unit}</small></strong></div>
      <p class="future-driver-description">${d.description}</p><p class="future-driver-note">${d.note}</p>
      <a href="${sources[d.source].url}" target="_blank" rel="noopener">${d.sourceLabel}</a>`);

  function draw() {
    const width = Math.round(root.node().getBoundingClientRect().width) || 700;
    const compact = width < 450;
    const height = compact ? 300 : 330;
    const margin = {top: 30, right: 8, bottom: 60, left: 35};
    const bottom = height - margin.bottom;
    const x = d3.scaleBand().domain(rows.map(r => r.year)).range([margin.left, width - margin.right]).padding(.5);
    const y = d3.scaleLinear().domain([0, futureDemand.chartMaximum]).range([bottom, margin.top]);
    svg.attr('viewBox', `0 0 ${width} ${height}`).attr('data-maximum', futureDemand.chartMaximum);
    const ticks = plot.selectAll('.future-grid').data([0, 200, 400, 600]).join('g').attr('class', 'future-grid');
    ticks.selectAll('line').data(v => [v]).join('line').attr('x1', margin.left).attr('x2', width - margin.right)
      .attr('y1', y).attr('y2', y).attr('class', v => v === 0 ? 'future-baseline' : null);
    ticks.selectAll('text').data(v => [v]).join('text').attr('x', margin.left - 8).attr('y', v => y(v) + 4)
      .attr('text-anchor', 'end').text(v => v);
    const bars = plot.selectAll('.future-bar').data(rows, r => r.year).join('g').attr('class', 'future-bar')
      .attr('data-year', r => r.year).attr('data-status', r => r.status).attr('transform', r => `translate(${x(r.year)},0)`);
    bars.selectAll('.future-total-bar').data(r => [r]).join('rect').attr('class', 'future-total-bar')
      .attr('width', x.bandwidth()).attr('y', r => y(r.total)).attr('height', r => bottom - y(r.total));
    bars.selectAll('.future-total-label').data(r => [r]).join('text').attr('class', 'future-total-label')
      .attr('x', x.bandwidth() / 2).attr('y', r => y(r.total) - 12).attr('text-anchor', 'middle').text(r => r.total);
    bars.selectAll('.future-year').data(r => [r]).join('text').attr('class', 'future-year')
      .attr('x', x.bandwidth() / 2).attr('y', bottom + 26).attr('text-anchor', 'middle').text(r => r.year);
    bars.selectAll('.future-status').data(r => [r]).join('text').attr('class', 'future-status')
      .attr('x', x.bandwidth() / 2).attr('y', bottom + 45).attr('text-anchor', 'middle')
      .text(r => r.status === 'projection' ? 'PROJEÇÃO' : 'ESTIMATIVA');
  }

  draw();
  if (typeof ResizeObserver !== 'undefined') new ResizeObserver(draw).observe(root.node());
}
