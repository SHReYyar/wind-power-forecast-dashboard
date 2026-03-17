import { FuelHHRecord, WindForRecord } from "./types";

function generateSampleActual(from: Date, to: Date): FuelHHRecord[] {
  const records: FuelHHRecord[] = [];
  const current = new Date(from);
  while (current <= to) {
    const hour = current.getUTCHours();
    const dayOfMonth = current.getUTCDate();
    // Simulate realistic wind pattern: higher at night, varies by day
    const base = 4000 + Math.sin((dayOfMonth / 31) * Math.PI * 2) * 2000;
    const hourly = Math.sin((hour / 24) * Math.PI * 2) * 800;
    const noise = (Math.random() - 0.5) * 1200;
    const generation = Math.max(200, Math.round(base + hourly + noise));
    records.push({
      startTime: current.toISOString(),
      generation,
    });
    current.setUTCMinutes(current.getUTCMinutes() + 30);
  }
  return records;
}

function generateSampleForecast(from: Date, to: Date): WindForRecord[] {
  const records: WindForRecord[] = [];
  const current = new Date(from);

  // Generate forecasts published at various lead times
  const publishOffsets = [1, 2, 4, 6, 12, 24, 36, 48]; // hours before targetTime

  while (current <= to) {
    const hour = current.getUTCHours();
    const dayOfMonth = current.getUTCDate();
    const base = 4000 + Math.sin((dayOfMonth / 31) * Math.PI * 2) * 2000;
    const hourly = Math.sin((hour / 24) * Math.PI * 2) * 800;

    for (const offsetHours of publishOffsets) {
      const publishTime = new Date(current.getTime() - offsetHours * 3600 * 1000);
      const forecastNoise = (Math.random() - 0.5) * (800 + offsetHours * 30);
      const generation = Math.max(100, Math.round(base + hourly + forecastNoise));
      records.push({
        startTime: current.toISOString(),
        publishTime: publishTime.toISOString(),
        generation,
      });
    }

    current.setUTCMinutes(current.getUTCMinutes() + 30);
  }
  return records;
}

export function getSampleData(
  startTime: string,
  endTime: string
): { actual: FuelHHRecord[]; forecast: WindForRecord[] } {
  const from = new Date(startTime);
  const to = new Date(endTime);

  // Clamp to January 2024 for realism
  const jan1 = new Date("2024-01-01T00:00:00Z");
  const jan31 = new Date("2024-01-31T23:30:00Z");
  const clampedFrom = from < jan1 ? jan1 : from > jan31 ? jan31 : from;
  const clampedTo = to > jan31 ? jan31 : to < jan1 ? jan1 : to;

  return {
    actual: generateSampleActual(clampedFrom, clampedTo),
    forecast: generateSampleForecast(clampedFrom, clampedTo),
  };
}
