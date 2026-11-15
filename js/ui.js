import { ratingName } from './surf.js';

export function showRating(element, rating) {
  element.style.setProperty('--rating', rating);
  element.textContent = ratingName(rating);
}

export function stirSea(sea, hour) {
  sea.style.setProperty('--wave-height', hour.waveHeight);
  sea.style.setProperty('--wave-period', hour.wavePeriod);
}
