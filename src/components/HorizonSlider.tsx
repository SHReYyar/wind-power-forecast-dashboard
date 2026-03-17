"use client";

interface HorizonSliderProps {
  value: number;
  onChange: (val: number) => void;
}

export default function HorizonSlider({ value, onChange }: HorizonSliderProps) {
  const pct = (value / 48) * 100;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <label
          style={{
            fontSize: "11px",
            fontFamily: "var(--font-mono)",
            color: "var(--text-muted)",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
          }}
        >
          Forecast Horizon
        </label>
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "18px",
            color: "var(--accent-blue)",
            fontWeight: "700",
            letterSpacing: "-0.02em",
          }}
        >
          {value}
          <span style={{ fontSize: "11px", color: "var(--text-muted)", marginLeft: "3px" }}>h</span>
        </span>
      </div>

      <div style={{ position: "relative" }}>
        {/* Track fill overlay */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: 0,
            height: "4px",
            width: `${pct}%`,
            background: `linear-gradient(90deg, var(--accent-blue), #60a5fa)`,
            borderRadius: "2px",
            transform: "translateY(-50%)",
            pointerEvents: "none",
            boxShadow: "0 0 8px rgba(59,130,246,0.4)",
            zIndex: 1,
          }}
        />
        <input
          type="range"
          min={0}
          max={48}
          step={1}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          style={{ position: "relative", zIndex: 2 }}
        />
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontFamily: "var(--font-mono)",
          fontSize: "10px",
          color: "var(--text-muted)",
        }}
      >
        <span>0h</span>
        <span>12h</span>
        <span>24h</span>
        <span>36h</span>
        <span>48h</span>
      </div>
    </div>
  );
}
