export interface FuelHHRecord {
  startTime: string;
  generation: number;
}

export interface WindForRecord {
  startTime: string;
  publishTime: string;
  generation: number;
}

export interface ChartDataPoint {
  time: string;
  actual: number;
  forecast: number;
}

export interface DashboardRequest {
  startTime: string;
  endTime: string;
  forecastHorizonHours: number;
  useSampleData: boolean;
}

export interface DashboardResponse {
  chartData: ChartDataPoint[];
  error?: string;
}
