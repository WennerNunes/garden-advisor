import { getCoordinates } from './src/postcode.js';
import { getForecast } from './src/weather.js';

const postcode = process.argv[2];
const { lat, lon } = await getCoordinates(postcode);
const forecast = await getForecast(lat, lon);
console.log(forecast);