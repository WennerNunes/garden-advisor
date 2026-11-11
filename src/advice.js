export const RAIN_THRESHOLD_MM = 10;
export const FROST_RISK_C = 2;
export const FROST_LIKELY_C = 0;

export function getWateringAdvice(daily) {
  const rainYesterday = daily.precipitation_sum[0];
  const rainToday = daily.precipitation_sum[1];
  const rainTomorrow = daily.precipitation_sum[2];

  if (rainYesterday + rainToday >= RAIN_THRESHOLD_MM) {
    return "No need to water";
  }

  if (rainTomorrow >= RAIN_THRESHOLD_MM) {
    return "Hold off: rain is expected tomorrow";
  }

  return "Consider watering, but check soil moisture first";
}

export function getFrostAdvice(daily) {
  const minTomorrow = daily.temperature_2m_min[2];

  if (minTomorrow <= FROST_LIKELY_C) {
    return "Frost likely: protect tender plants, new shrubs and pots";
  }

  if (minTomorrow <= FROST_RISK_C) {
    return "Frost risk: ground frost possible even above 0°C";
  }

  return null;
}