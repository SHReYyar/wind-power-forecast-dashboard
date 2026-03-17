import { FuelHHRecord, WindForRecord, ChartDataPoint } from "./types";

export function applyForecastLogic(
  actualRecords: FuelHHRecord[],
  forecastRecords: WindForRecord[],
  forecastHorizonHours: number
): ChartDataPoint[] {
  // Build a map of targetTime -> best forecast
  // Rule: publishTime <= targetTime - forecastHorizonHours
  //       then select LATEST (max publishTime)

  const forecastMap = new Map<string, { generation: number; publishTime: string }>();

  for (const rec of forecastRecords) {
    const targetMs = new Date(rec.startTime).getTime();
    const publishMs = new Date(rec.publishTime).getTime();
    const horizonMs = forecastHorizonHours * 3600 * 1000;

    // Only valid if publishTime <= targetTime - horizonHours
    if (publishMs > targetMs - horizonMs) continue;

    const existing = forecastMap.get(rec.startTime);
    if (!existing || new Date(rec.publishTime) > new Date(existing.publishTime)) {
      forecastMap.set(rec.startTime, {
        generation: rec.generation,
        publishTime: rec.publishTime,
      });
    }
  }

  // Build actual map
  const actualMap = new Map<string, number>();
  for (const rec of actualRecords) {
    actualMap.set(rec.startTime, rec.generation);
  }

  // Only include points where BOTH actual and forecast exist
  const chartData: ChartDataPoint[] = [];

  for (const [time, forecastEntry] of forecastMap) {
    const actual = actualMap.get(time);
    if (actual === undefined) continue;
    chartData.push({
      time,
      actual,
      forecast: forecastEntry.generation,
    });
  }

  // Sort by time ascending
  chartData.sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime());

  return chartData;
}
