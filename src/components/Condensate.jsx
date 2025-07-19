// Condensate.jsx
import StatCard from "./StatCard";
export default function Condensate({ value }) {
  const display = value !== null ? `${value.toFixed(1)} L` : "—";
  return <StatCard label="Condensate" value={display} icon="💧" color="green" />;
}
