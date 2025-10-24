import mongoose from "mongoose";

const SensorSchema = new mongoose.Schema(
  {
    // === Temperature readings ===
    alpha: Number,   // intake
    bravo: Number,   // postCryo
    charlie: Number, // cellA
    delta: Number,   // cellB
    echo: Number,    // cellC

    // === Voltage readings from each stage ===
    voltA: Number,
    voltB: Number,
    voltC: Number,

    // === Runtime tracking (added for total IoT runtime) ===
    runtime_total_ms: {
      type: Number,
      default: 0,
    },
    runtime_total_h: Number,
    runtime_total_min: Number,
    runtime_total_sec: Number,

    // === Device state ===
    state: {
      type: String,
      default: "IDLE",
    },

    // === Timestamp ===
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  { versionKey: false }
);

const SensorReading = mongoose.model("SensorReading", SensorSchema);
export default SensorReading;
