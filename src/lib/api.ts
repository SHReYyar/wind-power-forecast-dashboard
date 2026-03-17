import { FuelHHRecord, WindForRecord } from "./types";

const BMRS_BASE = "https://data.elexon.co.uk/bmrs/api/v1";

export async function fetchActualWind(
  from: string,
  to: string
): Promise<FuelHHRecord[]> {
  const url = new URL(`${BMRS_BASE}/datasets/FUELHH`);
  url.searchParams.set("publishDateTimeFrom", from);
  url.searchParams.set("publishDateTimeTo", to);
  url.searchParams.set("fuelType", "WIND");
  url.searchParams.set("format", "json");

  const res = await fetch(url.toString(), { next: { revalidate: 0 } });
  if (!res.ok) {
    throw new Error(`FUELHH fetch failed: ${res.status} ${res.statusText}`);
  }
  const json = await res.json();
  const data: { startTime?: string; targetTime?: string; generation: number; fuelType?: string }[] =
    json?.data ?? json ?? [];

  return data
    .filter((d) => !d.fuelType || d.fuelType === "WIND")
    .map((d) => ({
      startTime: d.startTime ?? d.targetTime ?? "",
      generation: Number(d.generation),
    }));
}

export async function fetchForecastWind(
  from: string,
  to: string
): Promise<WindForRecord[]> {
  const url = new URL(`${BMRS_BASE}/datasets/WINDFOR`);
  url.searchParams.set("publishDateTimeFrom", from);
  url.searchParams.set("publishDateTimeTo", to);
  url.searchParams.set("format", "json");

  const res = await fetch(url.toString(), { next: { revalidate: 0 } });
  if (!res.ok) {
    throw new Error(`WINDFOR fetch failed: ${res.status} ${res.statusText}`);
  }
  const json = await res.json();
  const data: { startTime?: string; targetTime?: string; publishTime: string; generation: number }[] =
    json?.data ?? json ?? [];

  return data.map((d) => ({
    startTime: d.startTime ?? d.targetTime ?? "",
    publishTime: d.publishTime,
    generation: Number(d.generation),
  }));
}
