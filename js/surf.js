const ratings = ['Flat', 'Poor', 'Fair', 'Good', 'Great', 'Epic'];
const points = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];

export function currentHour(hours) {
  return hours.findLast((hour) => hour.time <= Date.now()) ?? hours[0];
}

export function windType(spot, hour) {
  if (hour.windSpeed < 8) return 'Glassy';

  const angle = Math.abs(((hour.windDirection - spot.faces + 540) % 360) - 180);
  return angle > 120 ? 'Offshore' : angle > 60 ? 'Cross-shore' : 'Onshore';
}

export function rate(spot, hour) {
  if (hour.waveHeight < 0.4) return 0;

  const swell = hour.wavePeriod >= 10 ? 2 : hour.wavePeriod >= 8 ? 1 : 0;
  const wind = { Glassy: 2, Offshore: 2, 'Cross-shore': 1, Onshore: 0 }[windType(spot, hour)];
  return 1 + swell + wind;
}

export function ratingName(rating) {
  return ratings[rating];
}

export function compassPoint(degrees) {
  return points[Math.round(degrees / 45) % 8];
}

const weekday = new Intl.DateTimeFormat('en-GB', { weekday: 'short', timeZone: 'Europe/Lisbon' });
const moment = new Intl.DateTimeFormat('en-GB', {
  weekday: 'long',
  hour: '2-digit',
  minute: '2-digit',
  timeZone: 'Europe/Lisbon',
});

export function formatDay(date) {
  return weekday.format(date);
}

export function formatMoment(date) {
  return moment.format(date);
}
