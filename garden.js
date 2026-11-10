import { getCoordinates } from './src/postcode.js';

const postcode = process.argv[2];
const coords = await getCoordinates(postcode);
console.log(coords);