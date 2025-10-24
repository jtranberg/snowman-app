// models/Flag.js
import { Schema, model } from "mongoose";

const FlagSchema = new Schema(
  {
    key: { type: String, unique: true },
    value: Schema.Types.Mixed,
  },
  { versionKey: false }
);

export default model("Flag", FlagSchema);
