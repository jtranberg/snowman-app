import { useState } from "react";
import "./LatestSensorReading.css";

function fmt(value, digits = 2) {
  if (value === null || value === undefined || Number.isNaN(Number(value))) return "—";
  return Number(value).toFixed(digits);
}

export default function LatestSensorReading() {
  const [reading, setReading] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const fetchData = async () => {
    try {
      setLoading(true);
      setErrorMsg("");

      // 1) tell the backend to request a fresh reading from the ESP32
      const triggerRes = await fetch(
        "https://snowman-app.onrender.com/api/data/request-data",
        { method: "POST" }
      );
      if (!triggerRes.ok) throw new Error("Failed to trigger ESP32 reading.");

      // 2) give the ESP32 time to publish (matches your current flow)
      await new Promise((r) => setTimeout(r, 3000));

      // 3) fetch latest
      const res = await fetch("https://snowman-app.onrender.com/api/data/latest");
      if (!res.ok) throw new Error("Failed to fetch latest reading.");

      const data = await res.json();
      console.log("✅ Latest Reading:", data);

      // normalize: support either camelCase or your existing keys
      const normalized = {
        // temps (you currently display alpha..echo)
        alpha: data.alpha ?? data.intake ?? null,
        bravo: data.bravo ?? data.postCryo ?? null,
        charlie: data.charlie ?? data.cellA ?? null,
        delta: data.delta ?? data.cellB ?? null,
        echo: data.echo ?? data.cellC ?? null,

        // NEW voltages
        voltA:
          data.voltA ??
          data.voltageA ??
          data.stageAVoltage ??
          data.vA ??
          null,
        voltB:
          data.voltB ??
          data.voltageB ??
          data.stageBVoltage ??
          data.vB ??
          null,
        voltC:
          data.voltC ??
          data.voltageC ??
          data.stageCVoltage ??
          data.vC ??
          null,

        timestamp: data.timestamp ?? data.updatedAt ?? Date.now(),
      };

      setReading(normalized);
    } catch (err) {
      console.error("❌ Fetch error:", err);
      setErrorMsg(err.message || "Unexpected error.");
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

      {errorMsg && <p className="error-text">⚠️ {errorMsg}</p>}

      {reading ? (
        <>
          {/* Temperatures (existing layout) */}
          <div className="cards-container">
            {["alpha", "bravo", "charlie", "delta", "echo"].map((sensor) => (
              <div key={sensor} className="sensor-card">
                <h3>{sensor.charAt(0).toUpperCase() + sensor.slice(1)}</h3>
                <p>{fmt(reading[sensor], 1)}°C</p>
              </div>
            ))}

            <div className="sensor-card timestamp-card">
              <h3>Time</h3>
              <p>{new Date(reading.timestamp).toLocaleString()}</p>
            </div>
          </div>

          {/* Voltages (new section) */}
          <div className="cards-container mt-voltages">
            <div className="sensor-card voltage-card">
              <h3>Stage A Voltage</h3>
              <p className="value-large">{fmt(reading.voltA, 2)}</p>
              <div className="unit-caption">V</div>
            </div>

            <div className="sensor-card voltage-card">
              <h3>Stage B Voltage</h3>
              <p className="value-large">{fmt(reading.voltB, 2)}</p>
              <div className="unit-caption">V</div>
            </div>

            <div className="sensor-card voltage-card">
              <h3>Stage C Voltage</h3>
              <p className="value-large">{fmt(reading.voltC, 2)}</p>
              <div className="unit-caption">V</div>
            </div>
          </div>
        </>
      ) : (
        <p>No data available. Click refresh to trigger ESP32.</p>
      )}
    </div>
  );
}
