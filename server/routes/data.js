import express from 'express';
import SensorReading from '../models/SensorReading.js';

const router = express.Router();

// ✅ POST /api/data
router.post('/', async (req, res) => {
  console.log("🧪 Incoming req.body:", req.body); // ← ADD THIS LINE

  const { alpha, bravo, charlie, delta, echo } = req.body;

  try {
    const reading = new SensorReading({ alpha, bravo, charlie, delta, echo });
    await reading.save();
    res.status(201).json({ success: true });
  } catch (err) {
    console.error("❌ Save error:", err);
    res.status(500).json({ error: 'Failed to save reading' });
  }
});



// ✅ GET /api/data/latest
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
