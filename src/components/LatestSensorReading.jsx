import { useState } from "react";
import "./LatestSensorReading.css";

const API = import.meta.env.VITE_API_URL || ""; // points to Render when set

function fmt(value, digits = 2) {
  if (value === null || value === undefined || Number.isNaN(Number(value))) return "—";
  return Number(value).toFixed(digits);
}

// better errors
async function fetchJson(url, init) {
  const res = await fetch(url, init);
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`${res.status} ${res.statusText}${text ? ` — ${text}` : ""}`);
  }
  return res.json();
}

export default function LatestSensorReading() {
  const [reading, setReading] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const fetchData = async () => {
    try {
      setLoading(true);
      setErrorMsg("");
      console.log("📡 API base:", API || "(same origin)");

      // 1) ask backend to request fresh ESP32 reading (LIVE)
      await fetchJson(`${API}/api/data/request-data`, { method: "POST" });

      // 2) give device time to publish
      await new Promise((r) => setTimeout(r, 3000));

      // 3) fetch latest from LIVE API
      const data = await fetchJson(`${API}/api/data/latest`);
      console.log("✅ Latest Reading:", data);

      const normalized = {
        alpha:   data.alpha   ?? data.intake   ?? null,
        bravo:   data.bravo   ?? data.postCryo ?? null,
        charlie: data.charlie ?? data.cellA    ?? null,
        delta:   data.delta   ?? data.cellB    ?? null,
        echo:    data.echo    ?? data.cellC    ?? null,

        voltA: data.voltA ?? null,
        voltB: data.voltB ?? null,
        voltC: data.voltC ?? null,

        timestamp: data.timestamp ?? data.updatedAt ?? Date.now(),
        state: data.state ?? "IDLE",
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
          {/* Temperatures */}
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

          {/* Voltages */}
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
