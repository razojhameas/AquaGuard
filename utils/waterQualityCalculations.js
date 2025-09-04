export function calculateDOStressIndex(temperature, pH, ammonia, turbidity, hour) {
  const tempFactor = Math.min(1, Math.max(0, (temperature - 25) / (35 - 25)));
  const pHDeviation = Math.abs(pH - 7.5);
  const pHFactor = Math.min(1, Math.max(0, pHDeviation / 2.5));
  const ammoniaFactor = Math.min(1, Math.max(0, (ammonia - 0.05) / (0.5 - 0.05)));
  const turbidityFactor = Math.min(1, Math.max(0, (turbidity - 10) / (100 - 10)));

  let timeMultiplier = 1;
  if (hour >= 2 && hour < 6) {
    timeMultiplier = 3;
  } else if (hour >= 22 || hour < 2) {
    timeMultiplier = 2;
  }

  const weightedSum =
    (0.4 * tempFactor) +
    (0.25 * ammoniaFactor) +
    (0.2 * pHFactor) +
    (0.15 * turbidityFactor);

  const rawDOSI = weightedSum * timeMultiplier;

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