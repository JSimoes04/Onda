import { rate, formatDay, formatMoment } from './surf.js';

class WaveChart extends HTMLElement {
  show(spot, hours) {
    this.hours = hours;

    const top = Math.max(2, Math.ceil(Math.max(...hours.map((hour) => hour.waveHeight))));
    const line = hours.map((hour, i) => `${i},${top - hour.waveHeight}`).join(' L');
    const last = hours.length - 1;

    this.innerHTML = `
			<div class="chart-plot">
				<svg viewBox="0 0 ${last} ${top}" preserveAspectRatio="none" aria-hidden="true">
					<path class="chart-area" d="M${line} V${top} H0 Z"/>
					<path class="chart-line" d="M${line}"/>
				</svg>
				<span class="chart-top">${top} m</span>
				<span class="chart-handle"></span>
				<input type="range" min="0" max="${last}" aria-label="Hour of the forecast">
			</div>
			<div class="chart-ratings" title="Rating of each hour: the stronger the colour, the better the surf"></div>
			<ol class="chart-days"></ol>`;

    this.style.setProperty('--top', top);
    this.querySelector('.chart-ratings').style.background = ratingStripes(spot, hours);
    this.querySelector('.chart-days').append(...bestHours(spot, hours).map((best) => this.createDay(best)));

    this.range = this.querySelector('input');
    this.range.addEventListener('input', () => this.moveHandle());
  }

  get hour() {
    return this.hours[this.range.value];
  }

  select(hour) {
    this.range.value = this.hours.indexOf(hour);
    this.range.dispatchEvent(new Event('input', { bubbles: true }));
  }

  moveHandle() {
    const label = `${formatMoment(this.hour.time)} · ${this.hour.waveHeight.toFixed(1)} m`;

    this.style.setProperty('--at', this.range.value / this.range.max);
    this.style.setProperty('--height', this.hour.waveHeight);
    this.querySelector('.chart-handle').dataset.label = label;
    this.range.setAttribute('aria-valuetext', label);
  }

  createDay(best) {
    const item = document.createElement('li');
    const button = document.createElement('button');

    button.type = 'button';
    button.innerHTML = `${formatDay(best.time)} <b>${best.waveHeight.toFixed(1)} m</b>`;
    button.addEventListener('click', () => this.select(best));

    item.append(button);
    return item;
  }
}

function bestHours(spot, hours) {
  const days = Object.values(Object.groupBy(hours, (hour) => formatDay(hour.time)));

  return days.map((day) => day.slice(8, 18).toSorted((a, b) => rate(spot, b) - rate(spot, a))[0]);
}

function ratingStripes(spot, hours) {
  const width = 100 / hours.length;
  const stripes = hours.map((hour, i) => {
    const colour = `color-mix(in oklab, var(--accent) ${rate(spot, hour) * 20}%, transparent)`;
    return `${colour} ${i * width}% ${(i + 1) * width}%`;
  });

  return `linear-gradient(to right, ${stripes})`;
}

customElements.define('wave-chart', WaveChart);
