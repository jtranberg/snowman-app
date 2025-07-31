import express from 'express';
import SensorReading from '../models/SensorReading.js';

const router = express.Router();

let dataRequested = false; // 👈 Control flag

// ✅ POST /api/request-data — called by frontend to request a reading
router.post('/request-data', (req, res) => {
  dataRequested = true;
  res.json({ success: true, message: 'ESP32 will send data next cycle.' });
});

// ✅ GET /api/data-requested — polled by ESP32
router.get('/data-requested', (req, res) => {
  if (dataRequested) {
    dataRequested = false; // auto-reset
    return res.send("true");
  }
  res.send("false");
});

// ✅ POST /api/data — ESP32 sends reading
router.post('/', async (req, res) => {
  console.log("🧪 Incoming req.body:", req.body);

  const { alpha, bravo, charlie, delta, echo, timestamp } = req.body;

  try {
    const reading = new SensorReading({
      alpha,
      bravo,
      charlie,
      delta,
      echo,
      timestamp, // optional
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
    if (!latest) {
      return res.status(404).json({ error: 'No sensor data found' });
    }
    res.json(latest);
  } catch {
    res.status(500).json({ error: 'Failed to fetch latest reading' });
  }
});

export default router;
