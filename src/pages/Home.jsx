import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Home.css";

import CO2Captured from "../components/CO2Captured";
import Condensate from "../components/Condensate";
import Minerals from "../components/Minerals";
import Efficiency from "../components/Efficiency";

export default function Home() {
  const [summary, setSummary] = useState(null);
  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    fetch("http://localhost:5000/latest-summary")
      .then(res => res.json())
      .then(setSummary)
      .catch(console.error);

    setTimeout(() => setFadeIn(true), 100); // animate numbers in
  }, []);

  return (
    <div className="home-container gradient-bg">
      <div className="home-logo">
        <img src="/logo.png" alt="Project Snowman Logo" />
      </div>

      <h1 className="hero-title">You Drive. Snowman Captures.</h1>
      <p className="hero-subtext">
        Your CO₂ companion on every trip — cleaning the air, one kilometer at a time.
      </p>

      <div className="mini-stats">
        <div className={`stat-card ${fadeIn ? 'fade-in' : ''}`}>
          <span className="label">Today's Capture</span>
          <span className="value">{summary?.co2_removed_tons ? `${(summary.co2_removed_tons * 12).toFixed(1)} kg` : '⏳'}</span>
        </div>
        <div className={`stat-card ${fadeIn ? 'fade-in' : ''}`}>
          <span className="label">Snowman Level</span>
          <span className="value">⛄ 27</span>
        </div>
        <div className={`stat-card ${fadeIn ? 'fade-in' : ''}`}>
          <span className="label">Maintenance</span>
          <span className="value alert">xxxxx: In 12 days</span>
        </div>
      </div>

      <h2 >🔬 Latest Capture Summary</h2>
      <div className="mini-stats">
        <CO2Captured value={summary?.co2_removed_tons ?? null} animate={fadeIn} />
        <Condensate value={summary?.condensate_L ?? null} animate={fadeIn} />
        <Minerals value={summary?.minerals_kg ?? null} animate={fadeIn} />
        <Efficiency value={summary?.efficiency_avg ?? null} animate={fadeIn} />
      </div>

      {/* Thumbnail chart preview */}
      {summary?.run_id && (
        <div className="chart-preview">
          <h3>📈 Snapshot</h3>
          <img
            src={`http://localhost:5000/run/${summary.run_id}/co2_capture_plot.png`}
            alt="CO2 Capture Chart"
            className="chart-thumb"
          />
        </div>
      )}

      <div className="home-buttons">
        <Link to="/dashboard"><button>📊 View Dashboard</button></Link>
        <Link to="/learn"><button>📘 Learn More</button></Link>
        <Link to="/score"><button>🏅 My Score</button></Link>
      </div>

      <p className="quote">“The air you breathe is cleaner because you showed up.”</p>
    </div>
  );
}
