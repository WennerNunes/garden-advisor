export async function getForecast(lat, lon) {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
    `&daily=temperature_2m_min,temperature_2m_max,precipitation_sum&past_days=1&timezone=Europe%2FLondon`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Could not get the weather forecast');
  }
  const data = await response.json();
  return data.daily;
}