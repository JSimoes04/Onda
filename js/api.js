const MARINE_API = 'https://marine-api.open-meteo.com/v1/marine';
const WEATHER_API = 'https://api.open-meteo.com/v1/forecast';

export function fetchSpots() {
  return fetchJson('data/spots.json');
}

export async function fetchForecasts(spots, days) {
  const [seas, winds] = await Promise.all([
    fetchHourly(MARINE_API, spots, days, 'wave_height,wave_period,wave_direction,sea_surface_temperature'),
    fetchHourly(WEATHER_API, spots, days, 'wind_speed_10m,wind_direction_10m'),
  ]);

  return spots.map((spot, i) => toHours(seas[i].hourly, winds[i].hourly));
}

async function fetchHourly(api, spots, days, variables) {
  const query = new URLSearchParams({
    latitude: spots.map((spot) => spot.latitude),
    longitude: spots.map((spot) => spot.longitude),
    hourly: variables,
    forecast_days: days,
    timezone: 'Europe/Lisbon',
    timeformat: 'unixtime',
  });

  return [].concat(await fetchJson(`${api}?${query}`));
}

async function fetchJson(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`${response.status} while fetching ${url}`);

  return response.json();
}

function toHours(sea, wind) {
  return sea.time.map((seconds, i) => ({
    time: new Date(seconds * 1000),
    waveHeight: sea.wave_height[i],
    wavePeriod: sea.wave_period[i],
    waveDirection: sea.wave_direction[i],
    waterTemperature: sea.sea_surface_temperature[i],
    windSpeed: wind.wind_speed_10m[i],
    windDirection: wind.wind_direction_10m[i],
  }));
}
