import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true },
    image: { type: String },
    showInMarketplace: { type: Boolean, default: false },
    showInGallery: { type: Boolean, default: true },
    // Admin-picked subset of images to show on the homepage preview card.
    // Falls back to an auto-selected preview when empty.
    featuredImages: { type: [String], default: [] },
  },
  { timestamps: true },
);

// Virtual populate for products count
CategorySchema.virtual("products", {
  ref: "Product",
  localField: "_id",
  foreignField: "category",
});

CategorySchema.set("toObject", { virtuals: true });
CategorySchema.set("toJSON", { virtuals: true });

export default mongoose.models.Category ||
  mongoose.model("Category", CategorySchema);
