import mongoose from 'mongoose';

const SensorSchema = new mongoose.Schema({
  // existing temperature sensors
  alpha: Number,
  bravo: Number,
  charlie: Number,
  delta: Number,
  echo: Number,

  // NEW voltage readings
  voltA: Number,
  voltB: Number,
  voltC: Number,

  // optional: state of the electrochem module (ACTIVE/IDLE/FAULT)
  state: {
    type: String,
    default: "IDLE",
  },

  timestamp: {
    type: Date,
    default: Date.now,
  },
});

// keep the same model name so other code still works
const SensorReading = mongoose.model('SensorReading', SensorSchema);

export default SensorReading;
