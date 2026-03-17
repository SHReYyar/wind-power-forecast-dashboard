"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { ChartDataPoint } from "@/lib/types";

interface WindForecastChartProps {
  data: ChartDataPoint[];
}

function formatTime(isoString: string): string {
  const d = new Date(isoString);
  return d.toLocaleString("en-GB", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "UTC",
  });
}

function formatTimeShort(isoString: string): string {
  const d = new Date(isoString);
  return d.toLocaleString("en-GB", {
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "UTC",
  });
}

interface TooltipPayloadItem {
  color: string;
  name: string;
  value: number;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayloadItem[];
  label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload || !payload.length) return null;

  return (
    <div
      style={{
        background: "rgba(13,20,32,0.96)",
        border: "1px solid var(--border-bright)",
        borderRadius: "8px",
        padding: "12px 16px",
        boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
        backdropFilter: "blur(12px)",
      }}
    >
      <p
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "11px",
          color: "var(--text-muted)",
          marginBottom: "8px",
          letterSpacing: "0.05em",
        }}
      >
        {label ? formatTime(label) : ""}
      </p>
      {payload.map((entry) => (
        <div
          key={entry.name}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            marginBottom: "4px",
          }}
        >
          <span
            style={{
              width: "10px",
              height: "10px",
              borderRadius: "50%",
              background: entry.color,
              boxShadow: `0 0 6px ${entry.color}`,
              flexShrink: 0,
            }}
          />
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "12px",
              color: "var(--text-secondary)",
              textTransform: "capitalize",
            }}
          >
            {entry.name}:
          </span>
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "13px",
              color: "var(--text-primary)",
              fontWeight: "700",
            }}
          >
            {entry.value.toLocaleString()} MW
          </span>
        </div>
      ))}
    </div>
  );
}

interface LegendPayloadItem {
  color: string;
  value: string;
}

function CustomLegend({ payload }: { payload?: LegendPayloadItem[] }) {
  if (!payload) return null;
  return (
    <div
      style={{
        display: "flex",
        gap: "24px",
        justifyContent: "center",
        paddingTop: "8px",
      }}
    >
      {payload.map((entry) => (
        <div key={entry.value} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div
            style={{
              width: "24px",
              height: "2px",
              background: entry.color,
              boxShadow: `0 0 6px ${entry.color}`,
              borderRadius: "1px",
            }}
          />
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "11px",
              color: "var(--text-secondary)",
              textTransform: "capitalize",
              letterSpacing: "0.05em",
            }}
          >
            {entry.value}
          </span>
        </div>
      ))}
    </div>
  );
}

// Determine how many ticks to show based on data length
function buildTicks(data: ChartDataPoint[]): string[] {
  if (data.length === 0) return [];
  const maxTicks = 8;
  const step = Math.max(1, Math.floor(data.length / maxTicks));
  return data.filter((_, i) => i % step === 0).map((d) => d.time);
}

export default function WindForecastChart({ data }: WindForecastChartProps) {
  const ticks = buildTicks(data);

  return (
    <div style={{ width: "100%", height: "420px" }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 20 }}>
          <defs>
            <filter id="glow-green">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="glow-blue">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <CartesianGrid
            strokeDasharray="3 6"
            stroke="rgba(30,45,69,0.7)"
            vertical={false}
          />
          <XAxis
            dataKey="time"
            ticks={ticks}
            tickFormatter={formatTimeShort}
            tick={{
              fill: "#3d5872",
              fontSize: 10,
              fontFamily: "Space Mono, monospace",
            }}
            axisLine={{ stroke: "var(--border)" }}
            tickLine={false}
            dy={8}
          />
          <YAxis
            tick={{
              fill: "#3d5872",
              fontSize: 10,
              fontFamily: "Space Mono, monospace",
            }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v: number) => `${(v / 1000).toFixed(1)}GW`}
            width={52}
          />
          <Tooltip
            content={<CustomTooltip />}
            cursor={{
              stroke: "rgba(255,255,255,0.06)",
              strokeWidth: 1,
            }}
          />
          <Legend content={<CustomLegend />} />
          <Line
            type="monotone"
            dataKey="actual"
            name="Actual"
            stroke="#00e5a0"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, fill: "#00e5a0", strokeWidth: 0 }}
            filter="url(#glow-green)"
          />
          <Line
            type="monotone"
            dataKey="forecast"
            name="Forecast"
            stroke="#3b82f6"
            strokeWidth={2}
            dot={false}
            strokeDasharray="5 3"
            activeDot={{ r: 4, fill: "#3b82f6", strokeWidth: 0 }}
            filter="url(#glow-blue)"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
