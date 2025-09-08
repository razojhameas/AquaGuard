// To store recent measurements for smoothing
const recentTemps = [];
const recentpHs = [];
const recentAms = [];
const recentTurbs = [];

function movingAverage(arr, period) {
  if (arr.length < period) return arr.reduce((a, b) => a + b, 0) / arr.length;
  const slice = arr.slice(-period);
  return slice.reduce((a, b) => a + b, 0) / period;
}

function normalize(value, min, max) {
  return Math.min(1, Math.max(0, (value - min) / (max - min)));
}

function thresholdPenalty(value, thresholdLow, thresholdHigh) {
  if (value < thresholdLow) return 1.5;
  if (value > thresholdHigh) return 1.5;
  return 1;
}

function timeMultiplier(hour) {
  // Smooth multiplier between 22:00 and 6:00, peak at 4:00 (max multiplier 3)
  const peakHour = 4;
  const startHour = 22;
  const endHour = 6;
  function distance(h1, h2) {
    let d = Math.abs(h1 - h2);
    return d > 12 ? 24 - d : d;
  }
  if (hour >= startHour || hour < endHour) {
    const dist = distance(hour, peakHour);
    return 1 + (3 - 1) * (1 - dist / 6);
  }
  return 1;
}

export function calculateDOStressIndex(temperature, pH, ammonia, turbidity, hour) {
  const smoothPeriod = 3;

  recentTemps.push(temperature);
  recentpHs.push(pH);
  recentAms.push(ammonia);
  recentTurbs.push(turbidity);

  if (recentTemps.length > smoothPeriod) recentTemps.shift();
  if (recentpHs.length > smoothPeriod) recentpHs.shift();
  if (recentAms.length > smoothPeriod) recentAms.shift();
  if (recentTurbs.length > smoothPeriod) recentTurbs.shift();

  const tempSmoothed = movingAverage(recentTemps, smoothPeriod);
  const pHSmoothed = movingAverage(recentpHs, smoothPeriod);
  const ammoniaSmoothed = movingAverage(recentAms, smoothPeriod);
  const turbiditySmoothed = movingAverage(recentTurbs, smoothPeriod);

  const tempFactor = normalize(tempSmoothed, 20, 35); // °C range
  const pHDeviation = Math.abs(pHSmoothed - 7.5);
  const pHFactor = Math.min(1, pHDeviation / 2.5);
  const ammoniaFactor = normalize(ammoniaSmoothed, 0.05, 0.5); // mg/L
  const turbidityFactor = normalize(turbiditySmoothed, 10, 100); // NTU

  const tempPenalty = thresholdPenalty(tempSmoothed, 20, 32);
  const pHPenalty = thresholdPenalty(pHSmoothed, 6.5, 9);
  const ammoniaPenalty = thresholdPenalty(ammoniaSmoothed, 0.1, 0.4);
  const turbidityPenalty = thresholdPenalty(turbiditySmoothed, 10, 80);

  const weightedSum =
    0.4 * tempFactor * tempPenalty +
    0.25 * ammoniaFactor * ammoniaPenalty +
    0.2 * pHFactor * pHPenalty +
    0.15 * turbidityFactor * turbidityPenalty;

  const weightedIndex = weightedSum * timeMultiplier(hour);

  let severity = "Safe";
  if (weightedIndex > 0.8) severity = "Critical";
  else if (weightedIndex > 0.6) severity = "High Risk";
  else if (weightedIndex > 0.3) severity = "Moderate";

  return { rawDOSI: weightedIndex, severity };
}
