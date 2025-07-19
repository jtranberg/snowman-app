import { Link } from 'react-router-dom';
import './Home.css';

export default function Home() {
  return (
    <div className="home-container">
      <div className="home-logo">
        <img src="/logo.png" alt="Project Snowman Logo" />
      </div>
      <h1 className="hero-title">You Drive. Snowman Captures.</h1>
      <p className="hero-subtext">Your CO₂ companion on every trip — cleaning the air, one kilometer at a time.</p>

      <div className="mini-stats">
        <div className="stat-card">
          <span className="label">Today's Capture</span>
          <span className="value">5.2 kg</span>
        </div>
        <div className="stat-card">
          <span className="label">Snowman Level</span>
          <span className="value">⛄ 3</span>
        </div>
        <div className="stat-card">
          <span className="label">Maintenance</span>
          <span className="value alert">Filter: 12 days</span>
        </div>
      </div>

      <div className="home-buttons">
        <Link to="/dashboard"><button>📊 View Dashboard</button></Link>
        <Link to="/learn"><button>📘 Learn More</button></Link>
        <Link to="/score"><button>🏅 My Score</button></Link>
      </div>

      <p className="quote">“The air you breathe is cleaner because you showed up.”</p>
    </div>
  );
}
