import { getCoordinates } from './src/postcode.js';
import { getForecast } from './src/weather.js';
import { getWateringAdvice, getFrostAdvice } from './src/advice.js';

const postcode = process.argv[2];
const { lat, lon } = await getCoordinates(postcode);
const forecast = await getForecast(lat, lon);

const watering = getWateringAdvice(forecast);
const frost = getFrostAdvice(forecast);

const rain = forecast.precipitation_sum;
const minTemp = forecast.temperature_2m_min[2];
const maxTemp = forecast.temperature_2m_max[2];

console.log(`\nGarden advice for ${postcode.toUpperCase()}\n`);
console.log(`Rain: yesterday ${rain[0]} mm, today ${rain[1]} mm, tomorrow ${rain[2]} mm`);
console.log(`Tomorrow: ${minTemp}°C to ${maxTemp}°C\n`);
console.log(`Watering: ${watering}`);

if (frost) {
  console.log(`Frost: ${frost}`);
}