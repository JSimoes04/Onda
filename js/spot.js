import { fetchSpots, fetchForecasts } from './api.js';
import { currentHour, rate, windType, compassPoint, formatMoment } from './surf.js';
import { showRating, stirSea } from './ui.js';
import './wave-chart.js';

const chart = document.querySelector('wave-chart');
const backToNow = document.querySelector('.back-to-now');

async function main() {
  const spots = await fetchSpots();
  const id = new URLSearchParams(location.search).get('id');
  const spot = spots.find((spot) => spot.id === id);

  if (!spot) return location.replace('./');

  showSpot(spot);
  showNeighbours(spots, spot);

  try {
    const [hours] = await fetchForecasts([spot], 7);
    const now = currentHour(hours);

    chart.show(spot, hours);
    chart.addEventListener('input', () => showHour(spot, chart.hour, now));
    backToNow.addEventListener('click', () => chart.select(now));
    chart.select(now);
  } catch {
    write('.moment', 'The forecast could not be loaded. Check your connection and reload the page.');
  }
}

function write(selector, text) {
  document.querySelector(selector).textContent = text;
}

function showSpot(spot) {
  document.title = `${spot.name}, ${spot.town} · Vaga`;

  const photo = document.querySelector('.spot-photo');
  photo.src = `images/spots/${spot.id}-large.webp`;
  photo.alt = spot.photo.alt;

  write('.spot-place', `${spot.town} · ${spot.region}`);
  write('.spot-name', spot.name);
  write('.spot-description', spot.description);
  write('.spot-break', spot.break);
  write('.spot-level', spot.level);

  write('.credit-link', `${spot.photo.author}, ${spot.photo.license}`);
  document.querySelector('.credit-link').href = spot.photo.source;
  document.querySelector('.compass').style.setProperty('--faces', `${spot.faces}deg`);
}

function showNeighbours(spots, spot) {
  const position = spots.indexOf(spot);
  const neighbours = { '.north': spots[position - 1], '.south': spots[position + 1] };

  for (const [selector, neighbour] of Object.entries(neighbours)) {
    if (neighbour) {
      const link = document.querySelector(selector);
      link.href = `spot.html?id=${neighbour.id}`;
      link.querySelector('span').textContent = neighbour.name;
      link.hidden = false;
    }
  }
}

function showHour(spot, hour, now) {
  write('.moment', hour === now ? 'Right now' : formatMoment(hour.time));
  backToNow.hidden = hour === now;

  write('.waves', hour.waveHeight.toFixed(1));
  showRating(document.querySelector('.rating'), rate(spot, hour));
  stirSea(document.querySelector('.sea'), hour);

  write('.period', `${Math.round(hour.wavePeriod)} s`);
  write('.swell', `${compassPoint(hour.waveDirection)} ${hour.waveDirection}°`);
  write('.wind', `${Math.round(hour.windSpeed)} km/h ${compassPoint(hour.windDirection)}`);
  write('.wind-type', windType(spot, hour));
  write('.water', `${Math.round(hour.waterTemperature)} °C`);

  const compass = document.querySelector('.compass');
  compass.style.setProperty('--swell-from', `${hour.waveDirection}deg`);
  compass.style.setProperty('--wind-from', `${hour.windDirection}deg`);
}

main();
