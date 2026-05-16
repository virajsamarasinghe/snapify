import mongoose from "mongoose";

const RecognitionSchema = new mongoose.Schema(
  {
    year: { type: String, required: true },
    title: { type: String, required: true },
    venue: { type: String, required: true },
    description: { type: String, required: true },
    type: {
      type: String,
      enum: ["award", "exhibition", "feature"],
      required: true,
    },
    image: { type: String, default: "" },
    order: { type: Number, default: 0 },
  },
  { timestamps: true },
);

export default mongoose.models.Recognition ||
  mongoose.model("Recognition", RecognitionSchema);
