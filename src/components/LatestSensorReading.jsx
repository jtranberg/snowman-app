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
          <li><strong>xxx:</strong> {reading.intake}°C</li>
          <li><strong>Prexxx:</strong> {reading.pre_cryo}°C</li>
          <li><strong>Postxxx:</strong> {reading.post_cryo}°C</li>
          <li><strong>Timestamp:</strong> {new Date(reading.timestamp).toLocaleString()}</li>
        </ul>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}
