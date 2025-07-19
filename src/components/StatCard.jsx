export default function StatCard({ label, value, icon, color = "default", alert }) {
  return (
    <div className={`stat-card ${color} ${alert ? "alert" : ""}`}>
      <span className="label">{label}</span>
      <span className="value">
        {icon && <span style={{ marginRight: "6px" }}>{icon}</span>}
        {value}
      </span>
    </div>
  );
}
