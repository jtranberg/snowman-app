import express from 'express';
import MissionLog from '../models/MissionLog.js';
import { upload } from "../middleware/upload.js";

const router = express.Router();

router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { author, message } = req.body;

   
    const imageUrl = req.file?.path || null;

    const newLog = new MissionLog({
      author,
      message,
      image: imageUrl,
    });

    await newLog.save();
    res.status(201).json(newLog);
  } catch (err) {
    console.error("🚨 Error saving log:", err);
    res.status(500).json({ error: "Failed to create mission log." });
  }
});



router.get('/', async (req, res) => {
  try {
    const logs = await MissionLog.find().sort({ timestamp: -1 });
    res.json(logs);
  } catch (err) {
    console.error("🚨 Error fetching logs:", err);
    res.status(500).json({ error: "Failed to fetch mission logs." });
  }
});

export default router;
