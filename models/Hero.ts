import mongoose from "mongoose";

const HeroSchema = new mongoose.Schema(
  {
    src: { type: String, required: true, unique: true },
    isHidden: { type: Boolean, default: false },
    // Keeping these optional in case they are needed later
    title: { type: String },
    category: { type: String },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Delete the existing model to prevent schema caching issues in Next.js development
if (mongoose.models.Hero) {
  delete mongoose.models.Hero;
}

export default mongoose.model("Hero", HeroSchema);
