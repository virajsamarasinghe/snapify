const mongoose = require('mongoose');
const MONGODB_URI = process.env.DATABASE_URL;

if (!MONGODB_URI) {
  console.error('Error: DATABASE_URL is not defined.');
  process.exit(1);
}

const CategorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true },
    image: { type: String },
  },
  { timestamps: true }
);

const ProductSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    images: { type: [String], default: [] },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
  },
  { timestamps: true }
);

const Category = mongoose.models.Category || mongoose.model("Category", CategorySchema);
const Product = mongoose.models.Product || mongoose.model("Product", ProductSchema);

const originalCategories = [
  {
    title: "University",
    images: ["/img1.jpg", "/img2.jpg", "/img3.jpg"],
    description: "Capturing academic life and campus moments.",
  },
  {
    title: "Weddings",
    images: ["/img4.jpg", "/img5.jpg", "/img6.jpg"],
    description: "Preserving the magic of your special day.",
  },
  {
    title: "Army",
    images: ["/img7.jpg", "/img8.jpg", "/img9.jpg"],
    description: "Documenting military life and ceremonies.",
  },
  {
    title: "Events Coverage",
    images: ["/img10.jpg", "/img11.jpg", "/img12.jpg"],
    description: "Professional coverage of corporate and social events.",
  },
  {
    title: "School Events",
    images: [
      "/gallery/school-events/WhatsApp Image 2025-12-28 at 01.41.12.jpeg",
      "/gallery/school-events/WhatsApp Image 2025-12-28 at 01.41.12 (1).jpeg",
      "/gallery/school-events/WhatsApp Image 2025-12-28 at 01.41.13.jpeg",
    ],
    description: "Capturing the joy and energy of school activities.",
  },
  {
    title: "World Photography",
    images: [
      "/gallery/world-photography/WhatsApp Image 2025-12-28 at 02.43.09.jpeg",
      "/gallery/world-photography/WhatsApp Image 2025-12-28 at 02.43.10.jpeg",
      "/gallery/world-photography/WhatsApp Image 2025-12-28 at 02.43.11.jpeg",
    ],
    description: "Exploring cultures and landscapes around the globe.",
  },
  {
    title: "Wildlife",
    images: [
      "/gallery/wildlife/WhatsApp Image 2025-12-28 at 02.34.25.jpeg",
      "/gallery/wildlife/WhatsApp Image 2025-12-28 at 02.34.26.jpeg",
      "/gallery/wildlife/WhatsApp Image 2025-12-28 at 02.34.27.jpeg",
    ],
    description: "The beauty and wonder of nature's creatures.",
  },
];

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB...');

    for (const catData of originalCategories) {
      const slug = catData.title.toLowerCase().replace(/ /g, "-");
      
      // Upsert Category
      let category = await Category.findOne({ slug });
      if (!category) {
        category = await Category.create({
          name: catData.title,
          slug: slug,
          image: catData.images[0] // Set first image as cover
        });
        console.log(`Created Category: ${catData.title}`);
      } else {
        console.log(`Category exists: ${catData.title}`);
      }

      // Check if products exist for this category, if not create a dummy "Collection" product
      // to hold the images so they rotate in the gallery
      const existingProduct = await Product.findOne({ category: category._id });
      if (!existingProduct) {
        await Product.create({
          title: `${catData.title} Collection`,
          description: catData.description,
          price: 0, // Not really for sale, just for gallery
          images: catData.images, // Add all images here
          category: category._id
        });
        console.log(` - Added images to ${catData.title}`);
      }
    }

    console.log('Seeding complete!');
  } catch (error) {
    console.error('Seeding error:', error);
  } finally {
    await mongoose.disconnect();
  }
}

seed();
