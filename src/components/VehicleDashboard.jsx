// VehicleDashboard.jsx
import React from "react";
import "./VehicleDashboard.css";

const Gauge = ({ label, value }) => {
  return (
    <div className="gauge">
      <svg viewBox="0 0 100 100" className="gauge-arc">
        <circle cx="50" cy="50" r="45" className="gauge-bg" />
        <path
          className="gauge-fill"
          d={describeArc(50, 50, 45, 0, (value / 100) * 270)}
        />
      </svg>
      <div className="gauge-value">{value.toFixed(1)}°C</div>
      <div className="gauge-label">{label}</div>
    </div>
  );
};

// Arc generator for SVG
function polarToCartesian(cx, cy, r, angle) {
  const rad = ((angle - 135) * Math.PI) / 180.0;
  return {
    x: cx + r * Math.cos(rad),
    y: cy + r * Math.sin(rad),
  };
}

function describeArc(cx, cy, r, startAngle, endAngle) {
  const start = polarToCartesian(cx, cy, r, endAngle);
  const end = polarToCartesian(cx, cy, r, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? 0 : 1;

  return [
    "M", start.x, start.y,
    "A", r, r, 0, largeArcFlag, 0, end.x, end.y,
  ].join(" ");
}

export default function VehicleDashboard({ readings }) {
  return (
    <div className="dashboard-panel">
      <h2>🔢 Vehicle Sensor Dashboard</h2>
      <div className="gauge-grid">
        {Object.entries(readings).map(([key, val]) => (
          <Gauge key={key} label={key} value={val} />
        ))}
      </div>
    </div>
  );
}
