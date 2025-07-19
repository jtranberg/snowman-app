// Efficiency.jsx
import StatCard from "./StatCard";
export default function Efficiency({ value }) {
  const display = value !== null ? `${value.toFixed(1)}%` : "—";
  return <StatCard label="Efficiency" value={display} icon="📈" color="purple" />;
}
