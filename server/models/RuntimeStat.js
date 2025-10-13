import mongoose from "mongoose";

const RuntimeStatSchema = new mongoose.Schema({
  totalOnMs: { type: Number, default: 0 },   // cumulative ms the unit has been ACTIVE
  lastState: { type: String, default: "IDLE" },
  lastTs:    { type: Date, default: null },  // last time we updated this doc (server time)
}, { timestamps: true });

export default mongoose.model("RuntimeStat", RuntimeStatSchema);
