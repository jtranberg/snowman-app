import { useEffect, useState } from "react";

export default function LatestSensorReading() {
  const [reading, setReading] = useState(null);

  useEffect(() => {
    fetch("https://snowman-app.onrender.com/api/data/latest")
      .then((res) => res.json())
      .then((data) => setReading(data))
      .catch((err) => console.error("Failed to fetch sensor data:", err));
  }, []);

  return (
    <div className="sensor-card">
      <h2>📊 Latest Sensor Reading</h2>
      {reading ? (
        <ul>
          <li><strong>Alpha:</strong> {reading.alpha}°C</li>
          <li><strong>Bravo:</strong> {reading.bravo}°C</li>
          <li><strong>Charlie:</strong> {reading.charlie}°C</li>
          <li><strong>Delta:</strong> {reading.delta}°C</li>
          <li><strong>Echo:</strong> {reading.echo}°C</li>
          <li><strong>Timestamp:</strong> {new Date(reading.timestamp).toLocaleString()}</li>
        </ul>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}
