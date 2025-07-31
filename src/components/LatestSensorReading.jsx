import {  useState } from "react";
import './LatestSensorReading.css';

export default function LatestSensorReading() {
  const [reading, setReading] = useState(null);

  const fetchData = async () => {
    try {
      // Step 1: Tell ESP32 to send a new reading
      await fetch("https://snowman-app.onrender.com/api/data/request-data", {
        method: "POST",
      });

      // Step 2: Wait for ESP32 to respond
      await new Promise(resolve => setTimeout(resolve, 1200));

      // Step 3: Fetch the latest reading
      const res = await fetch("https://snowman-app.onrender.com/api/data/latest");
      const data = await res.json();
      setReading(data);
    } catch (err) {
      console.error("Failed to fetch or request sensor data:", err);
    }
  };

  return (
    <div className="simulation-panel">
      <h2>📊 Latest Sensor Reading</h2>
      <button onClick={fetchData} className="refresh-button">🔄 Refresh</button>

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
