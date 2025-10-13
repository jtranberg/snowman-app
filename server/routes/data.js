// server/routes/data.js
import express from 'express';
import SensorReading from '../models/SensorReading.js';

const router = express.Router();

let dataRequested = false; // control flag (single-instance memory)

// ===== Debug: log every hit =====
router.use((req, _res, next) => {
  console.log('➡️', req.method, req.originalUrl, '| UA=', req.headers['user-agent'] || 'n/a', '| IP=', req.ip);
  next();
});

// --- helpers ---
const toNum = (v) => {
  if (v === null || v === undefined) return undefined;
  const n = Number(v);
  return Number.isFinite(n) ? n : undefined;
};

// Accept only plausible ~12 V rail values; ignore junk
const toVolt = (v) => {
  const n = toNum(v);
  return (n !== undefined && n >= 8 && n <= 16) ? n : undefined; // tweak bounds if needed
};

// ✅ POST /api/data/request-data — called by frontend to request a reading
router.post('/request-data', (_req, res) => {
  console.log("📡 Frontend called /request-data");
  dataRequested = true;
  res.json({ success: true, message: 'ESP32 will send data next cycle.' });
});

// ✅ GET /api/data/data-requested — polled by ESP32
router.get('/data-requested', (_req, res) => {
  console.log("📡 ESP32 polled /data-requested | Flag is:", dataRequested);
  if (dataRequested) {
    dataRequested = false;
    console.log("✅ Flag consumed. Returning 'true' to ESP32");
    return res.send("true");
  }
  console.log("⏳ Flag is false. Returning 'false'");
  res.send("false");
});

// ✅ POST /api/data — ESP32 sends reading
router.post('/', async (req, res) => {
  try {
    console.log("🧪 Incoming req.body:", req.body);
    console.log("📥 RAW BODY KEYS:", Object.keys(req.body || {}));

    // Accept both naming schemes for temps (alpha..echo) or (intake..cellC)
    const alpha   = toNum(req.body.alpha   !== undefined && req.body.alpha   !== null ? req.body.alpha   : req.body.intake);
    const bravo   = toNum(req.body.bravo   !== undefined && req.body.bravo   !== null ? req.body.bravo   : req.body.postCryo);
    const charlie = toNum(req.body.charlie !== undefined && req.body.charlie !== null ? req.body.charlie : req.body.cellA);
    const delta   = toNum(req.body.delta   !== undefined && req.body.delta   !== null ? req.body.delta   : req.body.cellB);
    const echo    = toNum(req.body.echo    !== undefined && req.body.echo    !== null ? req.body.echo    : req.body.cellC);

    // Only store plausible 12V-ish values
    const voltA   = toVolt(req.body.voltA);
    const voltB   = toVolt(req.body.voltB);
    const voltC   = toVolt(req.body.voltC);

    if (voltA === undefined && voltB === undefined && voltC === undefined) {
      console.warn("⚠️ all volt fields missing/implausible. Check device payload & Content-Type.");
    } else {
      console.log("⚡ VOLT FIELDS PARSED:", { voltA, voltB, voltC });
    }

    const state     = typeof req.body.state === 'string' ? req.body.state : undefined;
    // Use server time to avoid stale client timestamps
    const timestamp = new Date();

    const reading = new SensorReading({
      alpha, bravo, charlie, delta, echo,
      voltA, voltB, voltC,
      state,
      timestamp,
    });

    await reading.save();
    console.log("✅ Saved new reading:", reading._id);
    res.status(201).json({ success: true });
  } catch (err) {
    console.error("❌ Save error:", err);
    res.status(500).json({ error: 'Failed to save reading', detail: String(err) });
  }
});

// ✅ GET /api/data/latest — prefer docs with voltages, else fallback to any
router.get('/latest', async (_req, res) => {
  try {
    const withVolts = await SensorReading.findOne({ $or: [
      { voltA: { $exists: true } },
      { voltB: { $exists: true } },
      { voltC: { $exists: true } },
    ]}).sort({ timestamp: -1 });

    const latestAny = await SensorReading.findOne().sort({ timestamp: -1 });
    const latest = withVolts || latestAny;
    if (!latest) return res.status(404).json({ error: 'No sensor data found' });

    // no caching anywhere
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.set('Pragma', 'no-cache');
    res.set('Expires', '0');
    res.set('Surrogate-Control', 'no-store');

    res.json(latest);
  } catch (err) {
    console.error("❌ Latest fetch error:", err);
    res.status(500).json({ error: 'Failed to fetch latest reading' });
  }
});

// 🔎 Debug: confirm running schema includes volt fields
router.get('/debug/schema', (_req, res) => {
  res.json({ paths: Object.keys(SensorReading.schema.paths) });
});

export default router;
