import { fetchSpots, fetchForecasts } from './api.js';
import { currentHour, rate, windType } from './surf.js';
import { isSaved } from './saved.js';
import { showRating, stirSea } from './ui.js';

const list = document.querySelector('.spot-list');
const controls = document.querySelector('.controls');
const notice = document.querySelector('.notice');
const template = document.querySelector('#spot-card');

const orders = {
  coast: () => 0,
  waves: (a, b) => b.now.waveHeight - a.now.waveHeight,
  rating: (a, b) => b.rating - a.rating || orders.waves(a, b),
};

async function main() {
  try {
    const spots = await fetchSpots();
    list.append(...spots.map(createCard));

    const forecasts = await fetchForecasts(spots, 1);
    spots.forEach((spot, i) => showConditions(spot, currentHour(forecasts[i])));

    showBiggest(spots.toSorted(orders.waves)[0]);
    controls.addEventListener('change', () => arrange(spots));
  } catch {
    notice.textContent = 'The forecast could not be loaded. Check your connection and reload the page.';
  }
}

function createCard(spot) {
  const card = template.content.cloneNode(true).firstElementChild;

  card.querySelector('.spot-link').href = `spot.html?id=${spot.id}`;
  card.querySelector('.spot-photo').src = `images/spots/${spot.id}-small.webp`;
  card.querySelector('.spot-photo').alt = spot.photo.alt;
  card.querySelector('.spot-place').textContent = `${spot.town} · ${spot.region}`;
  card.querySelector('.spot-name').textContent = spot.name;

  spot.card = card;
  return card;
}

function showConditions(spot, hour) {
  spot.now = hour;
  spot.rating = rate(spot, hour);

  showRating(spot.card.querySelector('.rating'), spot.rating);
  spot.card.querySelector('.waves').textContent = `${hour.waveHeight.toFixed(1)} m`;
  spot.card.querySelector('.period').textContent = `${Math.round(hour.wavePeriod)} s`;
  spot.card.querySelector('.wind').textContent = windType(spot, hour);
}

function showBiggest(spot) {
  const highlight = document.querySelector('.highlight');

  highlight.href = spot.card.querySelector('.spot-link').href;
  highlight.querySelector('.highlight-name').textContent = spot.name;
  highlight.querySelector('.highlight-waves').textContent = `${spot.now.waveHeight.toFixed(1)} m`;
  highlight.hidden = false;

  stirSea(document.querySelector('.sea'), spot.now);
}

function arrange(spots) {
  const { region, order } = Object.fromEntries(new FormData(controls));
  const matches = (spot) => region === 'All' || region === spot.region || (region === 'Saved' && isSaved(spot));

  const update = () => {
    for (const spot of spots.toSorted(orders[order])) {
      spot.card.hidden = !matches(spot);
      list.append(spot.card);
    }
  };

  if (document.startViewTransition) document.startViewTransition(update);
  else update();

  notice.textContent = spots.some(matches)
    ? ''
    : 'No saved spots yet. Open a spot and press “Save spot” to keep it here.';
}

main();
