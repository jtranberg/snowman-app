import mongoose from 'mongoose';

const SensorSchema = new mongoose.Schema({
  intake: Number,
  pre_cryo: Number,
  post_cryo: Number,
  timestamp: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('SensorReading', SensorSchema);
