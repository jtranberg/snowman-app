import mongoose from 'mongoose';

const MissionLogSchema = new mongoose.Schema({
  author: String,
  message: String,
  image: String, // ✅ required
  timestamp: {
    type: Date,
    default: Date.now,
  }
});

// ✅ Only delete the model if it already exists (avoids crash)
if (mongoose.models['MissionLog']) {
  mongoose.deleteModel('MissionLog');
}

export default mongoose.model('MissionLog', MissionLogSchema);
