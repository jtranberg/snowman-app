import { useState } from "react";
import './LatestSensorReading.css';

export default function LatestSensorReading() {
  const [reading, setReading] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);

      // ✅ Step 1: Tell ESP32 to send data
      const triggerRes = await fetch("https://snowman-app.onrender.com/api/data/request-data", {
        method: "POST",
      });

      if (!triggerRes.ok) {
        throw new Error("Failed to trigger ESP32 reading.");
      }

      // ✅ Step 2: Wait 1200ms to give ESP32 time to respond
      await new Promise(resolve => setTimeout(resolve, 1200));

      // ✅ Step 3: Fetch the new latest reading
      const res = await fetch("https://snowman-app.onrender.com/api/data/latest");
      const data = await res.json();

      setReading(data);
    } catch (err) {
      console.error("❌ Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="simulation-panel">
      <h2>📊 Latest Sensor Reading</h2>
      <button onClick={fetchData} className="refresh-button" disabled={loading}>
        {loading ? "⏳ Loading..." : "🔄 Refresh"}
      </button>

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
        <p>No data available. Click refresh to trigger ESP32.</p>
      )}
    </div>
  );
}
