"use client";

import { useState } from "react";
import TimeSelector from "./TimeSelector";
import HorizonSlider from "./HorizonSlider";
import WindForecastChart from "./WindForecastChart";
import { ChartDataPoint } from "@/lib/types";

const DEFAULT_START = "2024-01-05T00:00";
const DEFAULT_END = "2024-01-07T00:00";

export default function Dashboard() {
  const [startTime, setStartTime] = useState(DEFAULT_START);
  const [endTime, setEndTime] = useState(DEFAULT_END);
  const [forecastHorizon, setForecastHorizon] = useState(6);
  const [useSampleData, setUseSampleData] = useState(true);
  const [chartData, setChartData] = useState<ChartDataPoint[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleLoadData() {
    setLoading(true);
    setError(null);
    setChartData(null);

    try {
      const res = await fetch("/api/dashboard-data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          startTime: new Date(startTime).toISOString(),
          endTime: new Date(endTime).toISOString(),
          forecastHorizonHours: forecastHorizon,
          useSampleData,
        }),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        setError(data.error ?? "Failed to load data");
        return;
      }

      if (data.chartData.length === 0) {
        setError(
          "No data points found. Try reducing the forecast horizon or widening the time range."
        );
        return;
      }

      setChartData(data.chartData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--bg)",
        padding: "0",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background grid */}
      <div
        aria-hidden
        style={{
          position: "fixed",
          inset: 0,
          backgroundImage: `
            linear-gradient(rgba(30,45,69,0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(30,45,69,0.3) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />
      {/* Radial glow top */}
      <div
        aria-hidden
        style={{
          position: "fixed",
          top: "-200px",
          left: "50%",
          transform: "translateX(-50%)",
          width: "800px",
          height: "500px",
          background: "radial-gradient(ellipse at center, rgba(0,229,160,0.05) 0%, transparent 70%)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 1,
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "40px 24px 80px",
        }}
      >
        {/* Header */}
        <header style={{ marginBottom: "48px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              marginBottom: "8px",
            }}
          >
            <div
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                background: "var(--accent-green)",
                boxShadow: "0 0 12px var(--accent-green)",
                animation: "pulse-glow 2s ease-in-out infinite",
              }}
            />
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "11px",
                color: "var(--text-muted)",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
              }}
            >
              BMRS · UK National Grid · January 2024
            </span>
          </div>

          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(28px, 5vw, 48px)",
              fontWeight: "800",
              color: "var(--text-primary)",
              lineHeight: "1.1",
              letterSpacing: "-0.02em",
            }}
          >
            Wind Power
            <span
              style={{
                display: "block",
                background: "linear-gradient(135deg, var(--accent-green) 0%, #60efbc 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Forecast Monitor
            </span>
          </h1>

          <p
            style={{
              marginTop: "12px",
              color: "var(--text-muted)",
              fontFamily: "var(--font-mono)",
              fontSize: "13px",
              maxWidth: "560px",
              lineHeight: "1.7",
            }}
          >
            Compare actual vs forecasted wind generation. Apply forecast horizon
            filtering to simulate real-time dispatch decisions.
          </p>
        </header>

        {/* Controls panel */}
        <div
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: "12px",
            padding: "28px",
            marginBottom: "32px",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: "28px",
            alignItems: "end",
          }}
        >
          <TimeSelector
            label="Start Time"
            value={startTime}
            onChange={setStartTime}
            min="2024-01-01T00:00"
            max="2024-01-31T23:30"
          />

          <TimeSelector
            label="End Time"
            value={endTime}
            onChange={setEndTime}
            min="2024-01-01T00:00"
            max="2024-01-31T23:30"
          />

          <HorizonSlider value={forecastHorizon} onChange={setForecastHorizon} />

          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <label
              style={{
                fontSize: "11px",
                fontFamily: "var(--font-mono)",
                color: "var(--text-muted)",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
              }}
            >
              Data Source
            </label>
            <div
              style={{
                display: "flex",
                background: "var(--surface2)",
                border: "1px solid var(--border)",
                borderRadius: "8px",
                padding: "4px",
                gap: "4px",
              }}
            >
              {[
                { label: "Sample Data", value: true },
                { label: "Live API", value: false },
              ].map((opt) => (
                <button
                  key={String(opt.value)}
                  onClick={() => setUseSampleData(opt.value)}
                  style={{
                    flex: 1,
                    padding: "8px 12px",
                    borderRadius: "6px",
                    border: "none",
                    background:
                      useSampleData === opt.value
                        ? "var(--accent-blue)"
                        : "transparent",
                    color:
                      useSampleData === opt.value
                        ? "#fff"
                        : "var(--text-muted)",
                    fontFamily: "var(--font-mono)",
                    fontSize: "12px",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    fontWeight: useSampleData === opt.value ? "700" : "400",
                    letterSpacing: "0.03em",
                    boxShadow:
                      useSampleData === opt.value
                        ? "0 0 12px rgba(59,130,246,0.4)"
                        : "none",
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleLoadData}
            disabled={loading}
            style={{
              padding: "12px 28px",
              background: loading
                ? "var(--surface2)"
                : "linear-gradient(135deg, var(--accent-green) 0%, #00c48a 100%)",
              border: "none",
              borderRadius: "8px",
              color: loading ? "var(--text-muted)" : "#051a10",
              fontFamily: "var(--font-mono)",
              fontSize: "13px",
              fontWeight: "700",
              cursor: loading ? "not-allowed" : "pointer",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              transition: "all 0.2s ease",
              boxShadow: loading
                ? "none"
                : "0 4px 20px rgba(0,229,160,0.3), 0 0 0 1px rgba(0,229,160,0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              alignSelf: "end",
              height: "44px",
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.currentTarget.style.transform = "translateY(-1px)";
                e.currentTarget.style.boxShadow =
                  "0 6px 28px rgba(0,229,160,0.4), 0 0 0 1px rgba(0,229,160,0.3)";
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              if (!loading) {
                e.currentTarget.style.boxShadow =
                  "0 4px 20px rgba(0,229,160,0.3), 0 0 0 1px rgba(0,229,160,0.2)";
              }
            }}
          >
            {loading ? (
              <>
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  style={{ animation: "spin 1s linear infinite" }}
                >
                  <path d="M21 12a9 9 0 11-6.219-8.56" />
                </svg>
                Loading...
              </>
            ) : (
              <>
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <path d="M3 3v18h18" />
                  <path d="M7 16l4-4 4 4 4-8" />
                </svg>
                Load Data
              </>
            )}
          </button>
        </div>

        {/* Error state */}
        {error && (
          <div
            style={{
              background: "rgba(239,68,68,0.08)",
              border: "1px solid rgba(239,68,68,0.3)",
              borderRadius: "10px",
              padding: "16px 20px",
              marginBottom: "24px",
              display: "flex",
              alignItems: "center",
              gap: "12px",
              animation: "fadeIn 0.3s ease",
            }}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#ef4444"
              strokeWidth="2"
              style={{ flexShrink: 0 }}
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "13px",
                color: "#fca5a5",
              }}
            >
              {error}
            </span>
          </div>
        )}

        {/* Chart panel */}
        {chartData && chartData.length > 0 && (
          <div
            style={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: "12px",
              padding: "28px",
              animation: "fadeIn 0.5s ease",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "24px",
                flexWrap: "wrap",
                gap: "12px",
              }}
            >
              <div>
                <h2
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "16px",
                    fontWeight: "700",
                    color: "var(--text-primary)",
                    letterSpacing: "-0.01em",
                  }}
                >
                  Generation Comparison
                </h2>
                <p
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "11px",
                    color: "var(--text-muted)",
                    marginTop: "4px",
                  }}
                >
                  Forecast horizon: {forecastHorizon}h · {chartData.length} data points
                </p>
              </div>

              <div style={{ display: "flex", gap: "16px" }}>
                <StatBadge
                  label="Avg Actual"
                  value={`${Math.round(
                    chartData.reduce((s, d) => s + d.actual, 0) / chartData.length
                  ).toLocaleString()} MW`}
                  color="var(--accent-green)"
                />
                <StatBadge
                  label="Avg Forecast"
                  value={`${Math.round(
                    chartData.reduce((s, d) => s + d.forecast, 0) / chartData.length
                  ).toLocaleString()} MW`}
                  color="var(--accent-blue)"
                />
              </div>
            </div>

            <WindForecastChart data={chartData} />
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && !chartData && (
          <div
            style={{
              textAlign: "center",
              padding: "80px 24px",
              color: "var(--text-muted)",
            }}
          >
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              style={{ margin: "0 auto 16px", display: "block", opacity: 0.4 }}
            >
              <path d="M3 3v18h18" />
              <path d="M7 16l4-4 4 4 4-8" />
            </svg>
            <p
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "13px",
                letterSpacing: "0.05em",
              }}
            >
              Configure parameters and click{" "}
              <strong style={{ color: "var(--accent-green)" }}>Load Data</strong> to
              render the chart
            </p>
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

function StatBadge({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color: string;
}) {
  return (
    <div
      style={{
        background: "var(--surface2)",
        border: `1px solid ${color}30`,
        borderRadius: "8px",
        padding: "8px 14px",
        textAlign: "right",
      }}
    >
      <div
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "10px",
          color: "var(--text-muted)",
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          marginBottom: "2px",
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "14px",
          fontWeight: "700",
          color,
        }}
      >
        {value}
      </div>
    </div>
  );
}
