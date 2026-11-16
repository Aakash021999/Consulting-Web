const explorer = document.querySelector<HTMLElement>('[data-results-explorer]');
const engagement = explorer?.querySelector<HTMLSelectElement>('[data-engagement]');
const metric = explorer?.querySelector<HTMLSelectElement>('[data-metric]');
const title = explorer?.querySelector<HTMLElement>('[data-chart-title]');
const bars = explorer?.querySelector<HTMLElement>('[data-bars]');
const change = explorer?.querySelector<HTMLElement>('[data-change]');

const studies = Array.from(document.querySelectorAll<HTMLTableElement>('.engagement-table'), (table) => ({
  name: document.getElementById(table.getAttribute('aria-labelledby') ?? '')?.textContent?.trim() ?? '',
  rows: Array.from(table.querySelectorAll<HTMLTableRowElement>('tbody tr'), (row) =>
    Array.from(row.cells, (cell) => cell.textContent?.trim() ?? ''),
  ),
}));

function numeric(value: string) {
  // Accept a number only when the complete label represents a measured value.
  const match = value.match(/^₹?([+−-]?\d+(?:\.\d+)?)(?:Cr|%| days|\/month)?$/);
  return match ? Number(match[1].replace('−', '-')) : null;
}

if (explorer && engagement && metric && title && bars && change && studies.length) {
  const controls = { explorer, engagement, metric, title, bars, change };

  function renderChart() {
    const { metric, engagement, title, bars, change } = controls;
    const [label, before, after, delta] = studies[engagement.selectedIndex].rows[metric.selectedIndex];
    const values = [numeric(before), numeric(after)];
    const comparable = values.every((value) => value !== null && value >= 0);
    const max = Math.max(1e-9, ...values.map((value) => value ?? 0));
    title.textContent = label;
    bars.setAttribute('aria-label', `${label}. Before ${before}. After ${after}.`);
    bars.replaceChildren(...[before, after].map((value, index) => {
      const row = document.createElement('div');
      row.className = 'results-bar-row';
      const label = document.createElement('span');
      label.textContent = index === 0 ? 'Before' : 'After';
      const amount = document.createElement('strong');
      amount.textContent = value;
      row.append(label, amount);
      if (comparable) {
        const track = document.createElement('div');
        track.className = 'results-track';
        const fill = document.createElement('span');
        fill.style.width = `${((values[index] ?? 0) / max) * 100}%`;
        track.append(fill);
        row.append(track);
      }
      return row;
    }));
    change.textContent = `Change: ${delta}${comparable ? '' : ' · No numeric baseline for comparison'}`;
  }

  function updateMetrics() {
    const { metric, engagement } = controls;
    metric.replaceChildren(...studies[engagement.selectedIndex].rows.map(([label]) => new Option(label)));
    renderChart();
  }

  engagement.replaceChildren(...studies.map(({ name }) => new Option(name)));
  engagement.addEventListener('change', updateMetrics);
  metric.addEventListener('change', renderChart);
  updateMetrics();
  explorer.hidden = false;
}
