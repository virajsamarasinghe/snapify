const mongoose = require("mongoose");
const MONGODB_URI = process.env.DATABASE_URL;

if (!MONGODB_URI) {
  console.error("Error: DATABASE_URL is not defined.");
  process.exit(1);
}

const CategorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true },
    image: { type: String },
  },
  { timestamps: true },
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
  { timestamps: true },
);

const Category =
  mongoose.models.Category || mongoose.model("Category", CategorySchema);
const Product =
  mongoose.models.Product || mongoose.model("Product", ProductSchema);

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

const Recognition =
  mongoose.models.Recognition ||
  mongoose.model("Recognition", RecognitionSchema);

const defaultRecognition = [
  {
    year: "2024",
    title: "International Photography Excellence",
    venue: "World Photography Organization",
    description:
      "Awarded for innovative approach to contemporary portrait photography, capturing the essence of human emotion.",
    type: "award",
    image: "/img4.jpg",
    order: 0,
  },
  {
    year: "2024",
    title: "Shadows & Light",
    venue: "Modern Art Gallery, New York",
    description:
      "A solo exhibition featuring 50 pieces exploring the interplay between darkness and illumination.",
    type: "exhibition",
    image: "/img7.jpg",
    order: 1,
  },
  {
    year: "2023",
    title: "Contemporary Visions",
    venue: "Tate Modern, London",
    description:
      "Group exhibition alongside renowned international artists, showcasing the future of visual storytelling.",
    type: "exhibition",
    image: "/img9.jpg",
    order: 2,
  },
  {
    year: "2023",
    title: "Wildlife Series",
    venue: "National Geographic",
    description:
      "Featured photographer for an exclusive series documenting endangered species.",
    type: "feature",
    image: "/img11.jpg",
    order: 3,
  },
  {
    year: "2022",
    title: "Architecture Category Winner",
    venue: "Sony World Photography Awards",
    description:
      "Recognition for capturing the poetry of modern architecture through unique perspectives.",
    type: "award",
    image: "/img13.jpg",
    order: 4,
  },
  {
    year: "2021",
    title: "Urban Narratives",
    venue: "MoMA PS1, New York",
    description:
      "Breakthrough exhibition exploring the stories hidden within city streets.",
    type: "exhibition",
    image: "/img15.jpg",
    order: 5,
  },
];

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
    console.log("Connected to MongoDB...");

    for (const catData of originalCategories) {
      const slug = catData.title.toLowerCase().replace(/ /g, "-");

      // Upsert Category
      let category = await Category.findOne({ slug });
      if (!category) {
        category = await Category.create({
          name: catData.title,
          slug: slug,
          image: catData.images[0], // Set first image as cover
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
          category: category._id,
        });
        console.log(` - Added images to ${catData.title}`);
      }
    }

    console.log("Seeding complete!");

    // Seed recognition entries if none exist
    const recognitionCount = await Recognition.countDocuments();
    if (recognitionCount === 0) {
      await Recognition.insertMany(defaultRecognition);
      console.log("Seeded 6 recognition entries.");
    } else {
      console.log(
        `Recognition entries exist (${recognitionCount}), skipping seed.`,
      );
    }
  } catch (error) {
    console.error("Seeding error:", error);
  } finally {
    await mongoose.disconnect();
  }
}

seed();
