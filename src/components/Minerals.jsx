// Minerals.jsx
import StatCard from "./StatCard";
export default function Minerals({ value }) {
  const display = value !== null ? `${value.toFixed(1)} kg` : "—";
  return <StatCard label="Minerals" value={display} icon="🪨" color="gray" />;
}
