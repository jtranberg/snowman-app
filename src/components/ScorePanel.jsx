import './ScorePanel.css';

export default function ScorePanel() {
  const capturedToday = 5.2;      // kg
  const totalCaptured = 2100;     // kg (2.1 tons)
  const snowmanLevel = 3;         // Gamification XP
  const tripsOffset = 42;         // Equivalent trips
  const airPurified = 380000;     // Liters of air

  return (
    <div className="score-panel">
      <h3>🚗 Impact Dashboard</h3>

      <div className="dash-row">
        <div className="dash-item">
          <span className="dash-label">Today</span>
          <span className="dash-value">{capturedToday} kg</span>
          <span className="dash-desc">CO₂ Captured</span>
        </div>
        <div className="dash-item">
          <span className="dash-label">Total</span>
          <span className="dash-value">{(totalCaptured / 1000).toFixed(1)} t</span>
          <span className="dash-desc">All-Time Capture</span>
        </div>
        <div className="dash-item">
          <span className="dash-label">Level</span>
          <span className="dash-value">⛄ {snowmanLevel}</span>
          <span className="dash-desc">Snowman Score</span>
        </div>
      </div>

      <div className="dash-row">
        <div className="dash-item">
          <span className="dash-label">Trips</span>
          <span className="dash-value">{tripsOffset}</span>
          <span className="dash-desc">Commutes Offset</span>
        </div>
        <div className="dash-item">
          <span className="dash-label">Air</span>
          <span className="dash-value">{(airPurified / 1000).toLocaleString()}k L</span>
          <span className="dash-desc">Air Cleaned</span>
        </div>
      </div>
    </div>
  );
}
