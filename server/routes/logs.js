import express from 'express';
import MissionLog from '../models/MissionLog.js';
import { upload } from "../middleware/upload.js";

const router = express.Router();

router.post("/", upload.single("image"), async (req, res) => {
  try {
    // 🔍 Log incoming body and file
    console.log("📥 REQ.BODY:", req.body);
    console.log("📎 REQ.FILE:", req.file);

    const { author, message } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

    console.log("🧊 imageUrl to save:", imageUrl);

    const newLog = new MissionLog({
      author,
      message,
      image: imageUrl,
    });

    console.log("📝 Saving Log:", newLog);

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
