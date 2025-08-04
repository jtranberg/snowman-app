import './ScorePanel.css';
import { useEffect, useState } from 'react';

function useAnimatedValue(target, precision = 1, duration = 1000) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    let current = 0;
    const steps = 30;
    const increment = target / steps;
    const interval = duration / steps;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setValue(target.toFixed(precision));
        clearInterval(timer);
      } else {
        setValue(current.toFixed(precision));
      }
    }, interval);

    return () => clearInterval(timer);
  }, [target, precision, duration]);

  return value;
}



export default function ScorePanel() {
  const capturedToday = 5.2;
  const totalCaptured = 2100;     // kg
  const snowmanLevel = 12;
  const tripsOffset = 42;
  const airPurified = 380000;

  const animatedToday = useAnimatedValue(capturedToday, 1, 4000);
const animatedTotal = useAnimatedValue(totalCaptured / 1000, 1, 4000);
const animatedTrips = useAnimatedValue(tripsOffset, 0, 4000);
const animatedAir = useAnimatedValue(airPurified / 1000, 0, 4000);
const animatedSnowman = useAnimatedValue(snowmanLevel, 0, 4000);


  return (
    <div className="score-panel">
      <h3>🚗 Impact Dashboard</h3>

      <div className="dash-row">
        <div className="dash-item">
          <span className="dash-label">Today</span>
          <span className="dash-value">{animatedToday} kg</span>
          <span className="dash-desc">CO₂ Captured</span>
        </div>
        <div className="dash-item">
          <span className="dash-label">Total</span>
          <span className="dash-value">{animatedTotal} t</span>
          <span className="dash-desc">All-Time Capture</span>
        </div>
        <div className="dash-item">
  <span className="dash-label">Level</span>
  <span className="dash-value">
    ⛄ <span className="animated-number">{animatedSnowman}</span>
  </span>
  <span className="dash-desc">Snowman Score</span>
</div>

      </div>

      <div className="dash-row">
        <div className="dash-item">
          <span className="dash-label">Trips</span>
          <span className="dash-value">{animatedTrips}</span>
          <span className="dash-desc">Commutes Offset</span>
        </div>
        <div className="dash-item">
          <span className="dash-label">Air</span>
          <span className="dash-value">{animatedAir}k L</span>
          <span className="dash-desc">Air Cleaned</span>
        </div>
      </div>
    </div>
  );
}
