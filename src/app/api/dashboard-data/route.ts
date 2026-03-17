import { NextRequest, NextResponse } from "next/server";
import { fetchActualWind, fetchForecastWind } from "@/lib/api";
import { getSampleData } from "@/lib/sampleData";
import { applyForecastLogic } from "@/lib/dashboardData";
import { DashboardResponse } from "@/lib/types";

export async function POST(req: NextRequest): Promise<NextResponse<DashboardResponse>> {
  try {
    const body = await req.json();
    const { startTime, endTime, forecastHorizonHours, useSampleData } = body;

    if (!startTime || !endTime) {
      return NextResponse.json(
        { chartData: [], error: "startTime and endTime are required" },
        { status: 400 }
      );
    }

    const horizon = Number(forecastHorizonHours ?? 6);

    let actual, forecast;

    if (useSampleData) {
      const sample = getSampleData(startTime, endTime);
      actual = sample.actual;
      forecast = sample.forecast;
    } else {
      [actual, forecast] = await Promise.all([
        fetchActualWind(startTime, endTime),
        fetchForecastWind(startTime, endTime),
      ]);
    }

    const chartData = applyForecastLogic(actual, forecast, horizon);

    return NextResponse.json({ chartData });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[dashboard-data]", message);
    return NextResponse.json(
      { chartData: [], error: message },
      { status: 500 }
    );
  }
}
