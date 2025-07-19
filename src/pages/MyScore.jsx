import './MyScore.css';

export default function MyScore() {
  return (
    <div className="score-report">
      <div className="clipboard-top">📎 Project Snowman - Impact Sheet</div>

      <div className="report-section">
        <h2>🧊 Carbon Capture Summary</h2>
        <p><strong>Total Captured:</strong> 2,100 kg</p>
        <p><strong>Today’s Capture:</strong> 5.2 kg</p>
        <p><strong>Equivalent Trips Offset:</strong> 42</p>
      </div>

      <div className="report-section">
        <h2>📈 Progress Report</h2>
        <p><strong>Snowman Level:</strong> ⛄ Level 3</p>
        <p><strong>Liters of Air Purified:</strong> 380,000 L</p>
        <p><strong>Filter Status:</strong> 🔶 12 days until change</p>
      </div>
<button className="save-btn" onClick={() => window.print()}>
  🖨️ Save as PDF
</button>

      <div className="report-stamp">
        ✅ Official Report – Clean Drive Certified
      </div>
    </div>
  );
}
