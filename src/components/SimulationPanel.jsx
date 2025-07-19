import './SimulationPanel.css';

export default function SimulationPanel({ data }) {
  if (!data) return null;

  return (
    <div className="simulation-panel">
      <h3>🧪 Latest Simulation Data</h3>
      <div className="sim-grid">
        <div className="stat-card"><span className="label">Ambient Temp</span><span className="value">{data.ambient_temp} °C</span></div>
        <div className="stat-card"><span className="label">O₂ Before</span><span className="value">{data.oxygen_before}%</span></div>
        <div className="stat-card"><span className="label">O₂ Added</span><span className="value">+{data.oxygen_added}%</span></div>
        <div className="stat-card"><span className="label">O₂ After</span><span className="value">{data.oxygen_after}%</span></div>
        <div className="stat-card"><span className="label">Manifold Temp</span><span className="value">{data.temp_after_manifold} °C</span></div>
        <div className="stat-card"><span className="label">Cryo Temp</span><span className="value">{data.cooled_temp} °C</span></div>
        <div className="stat-card"><span className="label">Condensate</span><span className="value">{data.condensate_L.toFixed(2)} L</span></div>
        <div className="stat-card"><span className="label">CO₂ Captured</span><span className="value">{data.co2_removed_tons.toFixed(3)} t</span></div>
        <div className="stat-card"><span className="label">Minerals</span><span className="value">{data.minerals_captured_kg.toFixed(3)} kg</span></div>
      </div>
    </div>
  );
}
