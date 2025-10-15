import { useEffect, useMemo, useRef, useState } from "react";
import "./LatestSensorReading.css";

const API = import.meta.env.VITE_API_URL || "";

// format numbers or show dash
function fmt(v, d = 2) {
  if (v == null || Number.isNaN(Number(v))) return "—";
  return Number(v).toFixed(d);
}

// Accept only plausible ~12V rail values; others render as "—"
function cleanVolt(v) {
  if (v == null) return null;
  const n = Number(v);
  return Number.isFinite(n) && n >= 8 && n <= 16 ? n : null;
}

// HH:MM:SS
function msToHms(ms) {
  if (!Number.isFinite(ms) || ms < 0) ms = 0;
  const total = Math.floor(ms / 1000);
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  const pad = (x) => String(x).padStart(2, "0");
  return `${pad(h)}:${pad(m)}:${pad(s)}`;
}

// ---------- NEW: robust “active” derivation ----------
const ACTIVE_VOLT_MIN = 9.5;   // consider ON if any rail >= this
const FRESH_MS = 60_000;       // reading must be newer than this

function isFresh(ageSec) {
  if (ageSec == null) return false;
  return ageSec * 1000 <= FRESH_MS;
}

function anyActiveVolt(reading) {
  if (!reading) return false;
  const rails = [reading.voltA, reading.voltB, reading.voltC];
  return rails.some((v) => Number.isFinite(v) && v >= ACTIVE_VOLT_MIN);
}
// ----------------------------------------------------

async function fetchJson(url, init) {
  const res = await fetch(url, { cache: "no-store", ...init });
  const text = await res.text().catch(() => "");
  if (!res.ok) {
    throw new Error(
      `${res.status} ${res.statusText}${text ? ` — ${text}` : ""}`
    );
  }
  if (!text) return null;
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
  const [runtime, setRuntime] = useState(null); // { totalOnMs, lastState, lastTs }

  // replaces tick/liveRef; updates every 10s for age/runtime UI
  const [nowMs, setNowMs] = useState(Date.now());
  const timerRef = useRef(null);

  // simple 10s ticker for age/runtime display
  useEffect(() => {
    const id = setInterval(() => setNowMs(Date.now()), 10_000);
    return () => clearInterval(id);
  }, []);

  const ageSec = useMemo(() => {
    if (!reading?.timestamp) return null;
    return Math.max(
      0,
      Math.round((nowMs - new Date(reading.timestamp).getTime()) / 1000)
    );
  }, [reading?.timestamp, nowMs]);

  // ---------- UPDATED: runtime only accrues if fresh + active ----------
  const runtimeDisplay = useMemo(() => {
    if (!runtime) return "—";
    const base = Number(runtime.totalOnMs) || 0;

    const fresh = isFresh(ageSec);
    const serverActive = (reading?.state || runtime.lastState) === "ACTIVE";
    const voltsActive = anyActiveVolt(reading);
    const isActiveNow = fresh && (serverActive || voltsActive);

    let extra = 0;
    if (isActiveNow && runtime.lastTs) {
      extra = nowMs - new Date(runtime.lastTs).getTime();
      if (!Number.isFinite(extra) || extra < 0) extra = 0;
    }
    return msToHms(base + extra);
}, [runtime, reading, nowMs, ageSec]);


  // --------------------------------------------------------------------

  const fetchOnce = async () => {
    try {
      setLoading(true);
      setErrorMsg("");
      console.log("📡 API base:", API || "(same origin)");

      // Ask backend to request a fresh device publish (ignore failures)
      try {
        await fetchJson(`${API}/api/data/request-data`, { method: "POST" });
      } catch (e) {
        console.warn(
          "request-data failed (continuing to fetch latest):",
          e?.message
        );
      }

      // Give the device a moment to send
      await new Promise((r) => setTimeout(r, 2500));

      // Latest reading
      const data = await fetchJson(`${API}/api/data/latest`);
      if (!data) {
        setErrorMsg("No data returned from server.");
        return;
      }

      const normalized = {
        alpha: data.alpha ?? data.intake ?? null,
        bravo: data.bravo ?? data.postCryo ?? null,
        charlie: data.charlie ?? data.cellA ?? null,
        delta: data.delta ?? data.cellB ?? null,
        echo: data.echo ?? data.cellC ?? null,

        voltA: cleanVolt(data.voltA),
        voltB: cleanVolt(data.voltB),
        voltC: cleanVolt(data.voltC),

        timestamp: data.timestamp ?? data.updatedAt ?? null,
        state: data.state ?? "IDLE",
      };
      setReading(normalized);
      console.log("✅ Latest Reading:", normalized);

      // Runtime
      try {
        const rt = await fetchJson(`${API}/api/data/runtime`);
        setRuntime(rt || null);
      } catch (e) {
        console.warn("runtime fetch failed:", e?.message);
      }
    } catch (e) {
      console.error("❌ Fetch error:", e);
      setErrorMsg(e.message || "Unexpected error.");
    } finally {
      setLoading(false);
    }
  };

  // Optional auto-refresh every 10s
  useEffect(() => {
    if (!auto) {
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = null;
      return;
    }
    fetchOnce(); // run immediately when toggled on
    timerRef.current = setInterval(fetchOnce, 10_000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = null;
    };
  }, [auto]);

  //   const resetRuntime = async () => {
  //   try {
  //     await fetch(`${API}/api/data/runtime/reset`, { method: "POST" });
  //     const rt = await fetchJson(`${API}/api/data/runtime`);
  //     setRuntime(rt || { totalOnMs: 0, lastState: "IDLE", lastTs: null });
  //   } catch (e) {
  //     console.warn("runtime reset failed:", e?.message);
  //   }
  // };

  // Derived UI state label that matches the new logic
  const derivedState = useMemo(() => {
  if (!isFresh(ageSec)) return "IDLE";
  return (reading?.state === "ACTIVE" || anyActiveVolt(reading))
    ? "ACTIVE"
    : "IDLE";
}, [ageSec, reading]);

  return (
    <div className="simulation-panel">
      <h2>
        Sensor Readings{" "}
      </h2>

      <div
        className="toolbar"
        style={{
          display: "flex",
          gap: 10,
          alignItems: "center",
          flexWrap: "wrap",
          marginBottom: 8,
        }}
      >
        <button
          onClick={fetchOnce}
          className="refresh-button"
          disabled={loading}
        >
          {loading ? "⏳ Loading..." : "🔄 Refresh"}
        </button>
        <label style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <input
            type="checkbox"
            checked={auto}
            onChange={(e) => setAuto(e.target.checked)}
          />
          Auto refresh
        </label>
        <span style={{ fontSize: ".85rem", opacity: 0.8 }}>
          State: <strong>{derivedState}</strong>
          {" • "}
          Last update:{" "}
          <strong>{ageSec == null ? "—" : `${ageSec}s ago`}</strong>
          {" • "}
          On-time: <strong>{runtimeDisplay}</strong>
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
              <p>
                {reading.timestamp
                  ? new Date(reading.timestamp).toLocaleString()
                  : "—"}
              </p>
            </div>
          </div>

          {/* Voltages */}
          <div className="cards-container mt-voltages">
            <div className="sensor-card voltage-card">
              <h3>Capture Assist <br/>A Volt</h3>
              <p className="value-large">{fmt(reading.voltA, 2)}</p>
              <div className="unit-caption">V</div>
            </div>
            <div className="sensor-card voltage-card">
              <h3>Capture Assist <br/>B Volt</h3>
              <p className="value-large">{fmt(reading.voltB, 2)}</p>
              <div className="unit-caption">V</div>
            </div>
            <div className="sensor-card voltage-card">
              <h3>Capture Assist <br/>C Volt</h3>
              <p className="value-large">{fmt(reading.voltC, 2)}</p>
              <div className="unit-caption">V</div>
            </div>
          </div>
        </>
      ) : (
        <p>No data available. Click refresh to trigger ESP32.</p>
      )}

      {/* Total On-Time */}
      <div className="cards-container mt-voltages">
        <div className="sensor-card runtime-card">
          <h3>Total Run Time</h3>
          <p className="value-large">{runtimeDisplay}</p>
          <div className="unit-caption">HH:MM:SS</div>
        </div>
      </div>
    </div>
  );
}
