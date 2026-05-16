import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    images: { type: [String], default: [] },
    status: {
      type: String,
      enum: ["available", "coming_soon", "sold"],
      default: "available",
    },
    productType: {
      type: String,
      enum: ["gallery", "marketplace"],
      default: "gallery",
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
  },
  { timestamps: true },
);

export default mongoose.models.Product ||
  mongoose.model("Product", ProductSchema);
