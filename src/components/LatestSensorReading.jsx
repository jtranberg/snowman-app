import { useEffect, useMemo, useRef, useState } from "react";
import "./LatestSensorReading.css";

const API = import.meta.env.VITE_API_URL || "";

function fmt(v, d = 2) {
  if (v == null || Number.isNaN(Number(v))) return "—";
  return Number(v).toFixed(d);
}

// SAFE fetch: handles 204 and empty bodies (no "Unexpected end of JSON input")
async function fetchJson(url, init) {
  const res = await fetch(url, { cache: "no-store", ...init });

  // 204 → no content (e.g., fresh-only mode: nothing new yet)
  if (res.status === 204) return null;

  // Read text first to avoid JSON parse errors on empty responses
  const text = await res.text().catch(() => "");

  // Non-OK responses: include any server text for easier debugging
  if (!res.ok) {
    throw new Error(`${res.status} ${res.statusText}${text ? ` — ${text}` : ""}`);
  }

  // OK but empty → treat as "no data"
  if (!text) return null;

  // Parse safely
  try {
    return JSON.parse(text);
  } catch {
    throw new Error("Invalid JSON from server.");
  }
}

export default function LatestSensorReading() {
  const [reading, setReading] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [auto, setAuto] = useState(false);
  const timerRef = useRef(null);

  const ageSec = useMemo(() => {
    if (!reading?.timestamp) return null;
    return Math.max(0, Math.round((Date.now() - new Date(reading.timestamp).getTime()) / 1000));
  }, [reading?.timestamp]);

  const fetchOnce = async () => {
    try {
      setLoading(true);
      setErrorMsg("");

      // 1) ask backend to request a fresh device publish
      await fetchJson(`${API}/api/data/request-data`, { method: "POST" });

      // 2) allow device time to publish
      await new Promise((r) => setTimeout(r, 2500));

      // 3) pull latest; require it to be <=6s old (adjust or remove param if you like)
      const data = await fetchJson(`${API}/api/data/latest?maxAgeSec=6`);
      if (!data) {
        // No newer doc within the freshness window — keep current UI stable
        console.log("⏳ No fresh data within maxAgeSec.");
        return;
      }

      const normalized = {
        alpha: data.alpha ?? data.intake ?? null,
        bravo: data.bravo ?? data.postCryo ?? null,
        charlie: data.charlie ?? data.cellA ?? null,
        delta: data.delta ?? data.cellB ?? null,
        echo: data.echo ?? data.cellC ?? null,
        voltA: data.voltA ?? null,
        voltB: data.voltB ?? null,
        voltC: data.voltC ?? null,
        timestamp: data.timestamp ?? data.updatedAt ?? null,
        state: data.state ?? "IDLE",
      };

      setReading(normalized);
      console.log("✅ Latest Reading:", normalized);
    } catch (e) {
      console.error("❌ Fetch error:", e);
      setErrorMsg(e.message || "Unexpected error.");
    } finally {
      setLoading(false);
    }
  };

  // Optional auto-refresh every 5s
  useEffect(() => {
    if (!auto) {
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = null;
      return;
    }
    fetchOnce(); // run immediately when toggled on
    timerRef.current = setInterval(fetchOnce, 5000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = null;
    };
    
  }, [auto]);

  return (
    <div className="simulation-panel">
      <h2>📊 Latest Sensor Reading</h2>

      <div
        className="toolbar"
        style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap", marginBottom: 8 }}
      >
        <button onClick={fetchOnce} className="refresh-button" disabled={loading}>
          {loading ? "⏳ Loading..." : "🔄 Refresh"}
        </button>
        <label style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <input type="checkbox" checked={auto} onChange={(e) => setAuto(e.target.checked)} />
          Auto refresh
        </label>
        <span style={{ fontSize: ".85rem", opacity: 0.8 }}>
          State: <strong>{reading?.state || "—"}</strong>
          {" • "}
          Last update: <strong>{ageSec == null ? "—" : `${ageSec}s ago`}</strong>
        </span>
      </div>

      {errorMsg && <p className="error-text">⚠️ {errorMsg}</p>}

      {reading ? (
        <>
          {/* Temperatures */}
          <div className="cards-container">
            {["alpha", "bravo", "charlie", "delta", "echo"].map((s) => (
              <div key={s} className="sensor-card">
                <h3>{s[0].toUpperCase() + s.slice(1)}</h3>
                <p>{fmt(reading[s], 1)}°C</p>
              </div>
            ))}
            <div className="sensor-card timestamp-card">
              <h3>Time</h3>
              <p>{reading.timestamp ? new Date(reading.timestamp).toLocaleString() : "—"}</p>
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
