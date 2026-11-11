export const RAIN_THRESHOLD_MM = 10;

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