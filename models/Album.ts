import mongoose from "mongoose";

const AlbumSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, default: "" },
    conductDate: { type: Date },
    location: { type: String, default: "" },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    coverPhoto: { type: String, default: "" },
    photos: [{ type: String }],
  },
  { timestamps: true },
);

export default mongoose.models.Album || mongoose.model("Album", AlbumSchema);
