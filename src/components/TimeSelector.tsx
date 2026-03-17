"use client";

interface TimeSelectorProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
  min?: string;
  max?: string;
}

export default function TimeSelector({ label, value, onChange, min, max }: TimeSelectorProps) {
  return (
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
        {label}
      </label>
      <input
        type="datetime-local"
        value={value}
        min={min}
        max={max}
        onChange={(e) => onChange(e.target.value)}
        style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: "6px",
          color: "var(--text-primary)",
          fontFamily: "var(--font-mono)",
          fontSize: "13px",
          padding: "10px 12px",
          outline: "none",
          transition: "border-color 0.2s ease, box-shadow 0.2s ease",
          width: "100%",
          cursor: "pointer",
        }}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = "var(--accent-blue)";
          e.currentTarget.style.boxShadow = "0 0 0 3px rgba(59,130,246,0.12)";
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = "var(--border)";
          e.currentTarget.style.boxShadow = "none";
        }}
      />
    </div>
  );
}
