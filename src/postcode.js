export async function getCoordinates(postcode) {
  const url = `https://api.postcodes.io/postcodes/${encodeURIComponent(postcode)}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Postcode not found: ${postcode}`);
  }
  const data = await response.json();
  return { lat: data.result.latitude, lon: data.result.longitude };
}