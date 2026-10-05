import {supplyChain, supplyPercent} from './supply-chain-data.js';

const countries = [
  {name: 'China', color: '#ac452e', key: 'china'},
  {name: 'Estados Unidos', color: '#536b80', key: 'usa'},
];

export function initSupplyChain() {
  const d3 = window.d3;
  const {stages} = supplyChain;
  const root = d3.select('#supply-chart');
  const detail = d3.select('#supply-detail');
  let selected = 'magnets';
  let chartWidth = 0;
  let x;
  const buttons = d3.select('#supply-stages').selectAll('button')
    .data(stages).join('button')
    .attr('type', 'button').attr('data-supply-stage', d => d.id)
    .attr('aria-controls', 'supply-detail supply-chart')
    .html(d => `<span>${d.number} <i aria-hidden="true">→</i></span><strong>${d.name}</strong>`)
    .on('click', (_, d) => selectStage(d.id))
    .on('keydown', (event, d) => {
      if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
      event.preventDefault();
      const index = event.key === 'Home' ? 0 : event.key === 'End' ? stages.length - 1
        : (stages.indexOf(d) + (event.key === 'ArrowRight' ? 1 : -1) + stages.length) % stages.length;
      buttons.nodes()[index].focus();
      selectStage(stages[index].id);
    });

  const svg = root.append('svg').attr('class', 'supply-profile')
    .attr('role', 'img').attr('aria-labelledby', 'supply-chart-title supply-chart-desc');
  svg.append('title').attr('id', 'supply-chart-title').text('Da extração aos ímãs: participação mundial em 2024');
  svg.append('desc').attr('id', 'supply-chart-desc').text(stages.map(s =>
    `${s.name}: ${countries.map((c, i) => `${c.name} ${supplyPercent(s.values[i])}`).join(', ')}.`
  ).join(' ') + ' Os valores de zero são os publicados pela IEA, com uma casa decimal.');
  const defs = svg.append('defs');
  const gradient = defs.append('linearGradient').attr('id', 'supply-wash').attr('x1', '0').attr('x2', '0').attr('y1', '0').attr('y2', '1');
  gradient.append('stop').attr('offset', '0%').attr('stop-color', countries[0].color).attr('stop-opacity', .12);
  gradient.append('stop').attr('offset', '100%').attr('stop-color', countries[0].color).attr('stop-opacity', 0);
  const plot = svg.append('g').attr('aria-hidden', 'true');
  const active = plot.append('rect').attr('class', 'supply-active-column');
  const grid = plot.append('g').attr('class', 'supply-grid');
  const area = plot.append('path').attr('class', 'supply-area').attr('fill', 'url(#supply-wash)');
  const series = plot.selectAll('.supply-series').data(countries).join('g').attr('class', d => `supply-series supply-${d.key}`);
  series.append('path').attr('class', 'supply-line').attr('fill', 'none').attr('stroke', d => d.color);
  const labels = plot.append('g').attr('class', 'supply-labels');
  const hitAreas = plot.append('g').attr('class', 'supply-hit-areas');

  function draw() {
    const width = Math.round(root.node().getBoundingClientRect().width) || 760;
    if (width === chartWidth) return;
    chartWidth = width;
    const compact = width < 480;
    const height = compact ? 310 : 360;
    const top = 36, bottom = height - 44, left = 38, right = 12;
    // Equal stage columns align with the HTML controls; every series uses 0–100%.
    const column = (width - left - right) / stages.length;
    x = d3.scalePoint().domain(stages.map(s => s.id)).range([left + column / 2, width - right - column / 2]);
    const y = d3.scaleLinear().domain([0, 100]).range([bottom, top]);
    svg.attr('viewBox', `0 0 ${width} ${height}`);
    root.node().parentElement.style.setProperty('--supply-chart-left', `${left}px`);
    root.node().parentElement.style.setProperty('--supply-chart-right', `${right}px`);
    active.attr('y', 8).attr('width', column).attr('height', height - 17);
    const ticks = grid.selectAll('g').data([0, 25, 50, 75, 100]).join('g');
    ticks.selectAll('line').data(v => [v]).join('line').attr('x1', left).attr('x2', width - right)
      .attr('y1', y).attr('y2', y).attr('class', d => d === 0 ? 'supply-baseline' : null);
    ticks.selectAll('text').data(v => [v]).join('text').attr('x', left - 10).attr('y', v => y(v) + 4)
      .attr('text-anchor', 'end').text(v => v);
    const line = d3.line().x(d => x(d.id)).y(d => y(d.value));
    // Straight segments connect stage shares; they do not imply a continuous flow.
    area.attr('d', d3.area().x(d => x(d.id)).y0(bottom).y1(d => y(d.values[0]))(stages));
    series.each(function(country, countryIndex) {
      const group = d3.select(this);
      const points = stages.map(s => ({id: s.id, value: s.values[countryIndex]}));
      group.select('.supply-line').attr('d', line(points));
      group.selectAll('path.supply-point').data(points).join('path')
        .attr('class', 'supply-point').attr('data-stage', d => d.id)
        .attr('transform', d => `translate(${x(d.id)},${y(d.value)})`)
        .attr('d', d3.symbol().type(d3.symbolCircle).size(66))
        .attr('fill', 'var(--paper)').attr('stroke', country.color).attr('stroke-width', 2);
    });
    const values = stages.flatMap(s => s.values.map((value, i) => ({id: s.id, value, country: i})));
    labels.selectAll('text').data(values).join('text')
      .attr('class', d => `supply-value supply-${countries[d.country].key}`)
      .attr('x', d => x(d.id)).attr('text-anchor', 'middle')
      .attr('y', d => y(d.value) - (d.country === 0 ? 16 : 13))
      .text(d => supplyPercent(d.value) + (d.value === 0 ? '*' : ''));
    hitAreas.selectAll('rect').data(stages).join('rect')
      .attr('x', d => x(d.id) - column / 2).attr('y', 0).attr('width', column).attr('height', height)
      .attr('fill', 'transparent').attr('data-supply-hit', d => d.id)
      .on('click', (_, d) => selectStage(d.id));
    moveHighlight(false);
  }

  function moveHighlight(animate) {
    if (!x) return;
    const width = +active.attr('width');
    active.interrupt();
    if (animate && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
      active.transition().duration(250).attr('x', x(selected) - width / 2);
    } else active.attr('x', x(selected) - width / 2);
    svg.attr('data-selected-stage', selected);
    svg.selectAll('.supply-point').classed('is-active', d => d.id === selected);
  }

  function selectStage(id, announce = true) {
    selected = id;
    const stage = stages.find(s => s.id === id);
    buttons.attr('aria-pressed', d => String(d.id === id));
    detail.html(`<p class="eyebrow">${stage.number} / ${stage.output.toUpperCase()}</p>
      <h3 id="supply-detail-title">${stage.name}</h3><p class="supply-description">${stage.description}</p>
      <div class="supply-country-rows"></div>
      <p class="supply-zero-note">${stage.values.includes(0) ? '* ' + supplyChain.zeroNote : 'As barras usam a mesma escala, de 0 a 100%.'}</p>`);
    const rows = countries.map((c, i) => ({...c, value: stage.values[i]}));
    const row = detail.select('.supply-country-rows').selectAll('.supply-country-row').data(rows).join('div')
      .attr('class', d => `supply-country-row supply-${d.key}`).attr('data-country', d => d.key);
    row.append('div').attr('class', 'supply-country-label').html(d =>
      `<span>${d.name}</span><strong>${supplyPercent(d.value)}${d.value === 0 ? '*' : ''}</strong>`);
    const bars = row.append('svg').attr('viewBox', '0 0 240 6').attr('preserveAspectRatio', 'none').attr('aria-hidden', 'true');
    bars.append('rect').attr('width', 240).attr('height', 6).attr('fill', '#e9e7de');
    bars.append('rect').attr('class', 'supply-share-bar').attr('width', d => 240 * d.value / 100)
      .attr('height', 6).attr('fill', d => d.color);
    moveHighlight(announce);
    if (announce) d3.select('#supply-announcement').text(`${stage.name}. ${rows.map(r => `${r.name}: ${supplyPercent(r.value)}`).join('; ')}.`);
  }

  d3.select('#supply-data').html(`<div class="supply-table-wrap"><table>
    <caption>Participação mundial em 2024 (%)</caption><thead><tr><th scope="col">País</th>${stages.map(s => `<th scope="col">${s.name}</th>`).join('')}</tr></thead>
    <tbody>${countries.map((c, i) => `<tr><th scope="row">${c.name}</th>${stages.map(s => `<td>${supplyPercent(s.values[i])}${s.values[i] === 0 ? '*' : ''}</td>`).join('')}</tr>`).join('')}</tbody></table></div>
    <p>* ${supplyChain.zeroNote} ${supplyChain.roundingNote} A cesta de elementos difere da estatística geral de terras raras do USGS.</p>
    <p>Fonte: IEA, <i>Share of global supply of magnet rare earths and magnet manufacturing, 2024</i>. Licença CC BY 4.0. Visualização adaptada pelo atlas.</p>
    <a href="${supplyChain.rawData}" class="source-link" download>Baixar a série original da IEA · CSV ↓</a>`);
  draw();
  selectStage(selected, false);
  if (typeof ResizeObserver !== 'undefined') new ResizeObserver(draw).observe(root.node());
}
