import { useEffect, useState } from "react";
import './LatestSensorReading.css';

export default function LatestSensorReading() {
  const [reading, setReading] = useState(null);

  useEffect(() => {
    fetch("https://snowman-app.onrender.com/api/data/latest")
      .then((res) => res.json())
      .then((data) => setReading(data))
      .catch((err) => console.error("Failed to fetch sensor data:", err));
  }, []);

  return (
    <div className="simulation-panel">
      <h2>📊 Latest Sensor Reading</h2>
      {reading ? (
        <div className="cards-container">
          {["alpha", "bravo", "charlie", "delta", "echo"].map((sensor) => (
            <div key={sensor} className="sensor-card">
              <h3>{sensor.charAt(0).toUpperCase() + sensor.slice(1)}</h3>
              <p>{reading[sensor]}°C</p>
            </div>
          ))}
          <div className="sensor-card timestamp-card">
            <h3>Timestamp</h3>
            <p>{new Date(reading.timestamp).toLocaleString()}</p>
          </div>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}
