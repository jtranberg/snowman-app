import express from 'express';
import SensorReading from '../models/SensorReading.js';

const router = express.Router();

let dataRequested = false; // 👈 Control flag (single-instance memory)

// --- helpers ---
const toNum = (v) => {
  if (v === null || v === undefined) return undefined;
  const n = Number(v);
  return Number.isFinite(n) ? n : undefined;
};

// ✅ POST /api/data/request-data — called by frontend to request a reading
router.post('/request-data', (req, res) => {
  console.log("📡 Frontend called /request-data");
  dataRequested = true;
  res.json({ success: true, message: 'ESP32 will send data next cycle.' });
});

// ✅ GET /api/data/data-requested — polled by ESP32
router.get('/data-requested', (req, res) => {
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

    // Extract with safe numeric coercion
    const reading = new SensorReading({
      // temps (keep your alpha..echo naming)
      alpha:  toNum(req.body.alpha),
      bravo:  toNum(req.body.bravo),
      charlie:toNum(req.body.charlie),
      delta:  toNum(req.body.delta),
      echo:   toNum(req.body.echo),

      // NEW voltages
      voltA:  toNum(req.body.voltA),
      voltB:  toNum(req.body.voltB),
      voltC:  toNum(req.body.voltC),

      // optional electrochem state (ACTIVE | IDLE | FAULT)
      state: typeof req.body.state === 'string' ? req.body.state : undefined,

      // let schema default handle timestamp if you prefer
      timestamp: req.body.timestamp ? new Date(req.body.timestamp) : new Date(),
    });

    await reading.save();
    res.status(201).json({ success: true });
  } catch (err) {
    console.error("❌ Save error:", err);
    res.status(500).json({ error: 'Failed to save reading' });
  }
});

// ✅ GET /api/data/latest — frontend fetches this
router.get('/latest', async (req, res) => {
  try {
    const latest = await SensorReading.findOne().sort({ timestamp: -1 });
    if (!latest) return res.status(404).json({ error: 'No sensor data found' });
    res.json(latest);
  } catch (err) {
    console.error("❌ Latest fetch error:", err);
    res.status(500).json({ error: 'Failed to fetch latest reading' });
  }
});

export default router;
