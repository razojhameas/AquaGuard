/**
 * Calculates the Dissolved Oxygen Stress Index (DO-SI) based on various environmental factors.
 * This function is designed to infer DO stress in the absence of a direct DO sensor.
 * The calculation is based on a weighted sum of normalized parameters and a time-of-day multiplier.
 *
 * @param {number} temperature Temperature in °C.
 * @param {number} pH pH value (unitless).
 * @param {number} ammonia Ammonia level in mg/L.
 * @param {number} turbidity Turbidity level in NTU.
 * @param {number} hour Current hour of the day (0-23, 24-hour format).
 * @returns {object} An object containing:
 * - {number} rawDOSI: The calculated raw DO-SI value.
 * - {string} severity: The severity level ("Safe", "Moderate", "High Risk", "Critical").
 */
export function calculateDOStressIndex(temperature, pH, ammonia, turbidity, hour) {
  // 1. Normalize each input to a 0-1 scale. This turns raw data into a comparable score.
  // The ranges for each factor are based on established aquaculture guidelines.
  
  // Temperature: 25°C is ideal (score 0), 35°C is a high-risk zone (score 1).
  const tempFactor = Math.min(1, Math.max(0, (temperature - 25) / (35 - 25)));

  // pH: A healthy pond has a pH around 7.5. We calculate how far it deviates.
  // A deviation of 2.5 (pH 5.0 or 10.0) is considered high risk (score 1).
  const pHDeviation = Math.abs(pH - 7.5);
  const pHFactor = Math.min(1, Math.max(0, pHDeviation / 2.5));

  // Ammonia: A low level of 0.05 mg/L is ideal, but it becomes a stressor
  // at 0.5 mg/L, which is considered a high-risk level for fish.
  const ammoniaFactor = Math.min(1, Math.max(0, (ammonia - 0.05) / (0.5 - 0.05)));

  // Turbidity: 10 NTU is a baseline (score 0), while 100 NTU is a high-risk level
  // as it can block sunlight and indicate excess organic material.
  const turbidityFactor = Math.min(1, Math.max(0, (turbidity - 10) / (100 - 10)));

  // 2. Determine a time multiplier. Ponds are most vulnerable to low DO before sunrise.
  // The multiplicative factor increases the score during these critical hours.
  let timeMultiplier = 1;
  if (hour >= 2 && hour < 6) { // Between 2 AM and 6 AM, DO is at its lowest.
    timeMultiplier = 3;
  } else if (hour >= 22 || hour < 2) { // Between 10 PM and 2 AM, DO is already declining.
    timeMultiplier = 2;
  }

  // 3. Compute the weighted sum of the normalized factors.
  // Each parameter's weight is based on its scientific impact on DO as defined in the methodology.
  const weightedSum =
    (0.4 * tempFactor) +
    (0.25 * ammoniaFactor) +
    (0.2 * pHFactor) +
    (0.15 * turbidityFactor);

  const rawDOSI = weightedSum * timeMultiplier;

  // 4. Determine severity level. The score is used to provide a clear alert.
  // These thresholds are aligned with the tiered alert system.
  let severity = "Safe";
  if (rawDOSI > 0.8) {
    severity = "Critical";
  } else if (rawDOSI > 0.6) {
    severity = "High Risk";
  } else if (rawDOSI > 0.3) {
    severity = "Moderate";
  }

  return { rawDOSI, severity };
}
