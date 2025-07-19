import StatCard from "./StatCard";

export default function CO2Captured({ value }) {
  const display = value !== null ? `${value.toFixed(2)} tons` : "—";
  return <StatCard label="CO₂ Captured" value={display} icon="🧊" color="blue" />;
}
