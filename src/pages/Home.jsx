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
  const [showBanner, setShowBanner] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetch("http://localhost:5000/latest-summary")
      .then(res => res.json())
      .then(setSummary)
      .catch(console.error);

    setTimeout(() => setFadeIn(true), 100);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setShowBanner(false), 10000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const seenModal = sessionStorage.getItem("snowman_seen_modal");
    if (!seenModal) {
      setShowModal(true);
      sessionStorage.setItem("snowman_seen_modal", "true");
    }
  }, []);

  return (
    <div className="home-container gradient-bg">
      {showBanner && (
        <div className="announcement-banner">
          <span className="shout-label">🎉 BREAKTHROUGH:</span>
          <span className="shout-text">
            Project Snowman now captures emissions AND cancels engine noise — before the muffler.
          </span>
        </div>
      )}

      {/* ✅ Modal */}
      {showModal && (
        <div className="whatsnew-modal">
          <div className="modal-content">
            <h2>🚀 What's New in Project Snowman</h2>
            <p>
              We now filter carbon and cancel engine noise — all before the muffler.
              Cleaner. Quieter. Smarter.
            </p>
            <button onClick={() => setShowModal(false)}>OK, Got It!</button>
          </div>
        </div>
      )}

      <div className="home-logo">
        <img src="/logo.png" alt="Project Snowman Logo" />
      </div>

      <h1 className="hero-title">Capture Carbon. Cancel Noise. Power Forward.</h1>
      <p className="hero-subtext">
        Project Snowman is the first system that traps emissions and dampens engine noise — all before the muffler.
      </p>

      <div className="mini-stats">
        <div className={`stat-card ${fadeIn ? 'fade-in' : ''}`}>
          <span className="label">Today's Capture</span>
          <span className="value">
            {summary?.co2_removed_tons ? `${(summary.co2_removed_tons * 12).toFixed(1)} kg` : '⏳'}
          </span>
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

      <h2>🔬 Latest Capture Summary</h2>
      <div className="mini-stats">
        <CO2Captured value={summary?.co2_removed_tons ?? null} animate={fadeIn} />
        <Condensate value={summary?.condensate_L ?? null} animate={fadeIn} />
        <Minerals value={summary?.minerals_kg ?? null} animate={fadeIn} />
        <Efficiency value={summary?.efficiency_avg ?? null} animate={fadeIn} />
      </div>

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

      <div className="blog-preview">
        <h3>📰 Blog Spotlight</h3>
        <p>
          <strong>Behind the Silence:</strong> How Project Snowman captures carbon and kills engine noise.
        </p>
        <Link to="/blog/behind-the-silence">
          <button>📖 Read the Article</button>
        </Link>
      </div>

      <p className="quote">“The air you breathe is cleaner — and quieter — because you showed up.”</p>
    </div>
  );
}
