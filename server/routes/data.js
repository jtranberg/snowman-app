import express from 'express';
import SensorReading from '../models/SensorReading.js';
const router = express.Router();

// POST /api/data - receives sensor readings
router.post('/', async (req, res) => {
  const { intake, pre_cryo, post_cryo } = req.body;

  try {
    const reading = new SensorReading({ intake, pre_cryo, post_cryo });
    await reading.save();
    res.status(201).json({ success: true });
  } catch {
    res.status(500).json({ error: 'Failed to save reading' });
  }
});

// GET /api/data/latest - latest reading
router.get('/latest', async (req, res) => {
  try {
    const latest = await SensorReading.findOne().sort({ timestamp: -1 });
    res.json(latest);
  } catch {
    res.status(500).json({ error: 'Failed to fetch latest reading' });
  }
});

export default router;
