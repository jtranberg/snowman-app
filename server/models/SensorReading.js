import mongoose from 'mongoose';

const SensorSchema = new mongoose.Schema({
  alpha: Number,
  bravo: Number,
  charlie: Number,
  delta: Number,
  echo: Number,
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const SensorReading = mongoose.model('SensorReading', SensorSchema);
export default SensorReading;
