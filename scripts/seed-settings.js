/**
 * seed-settings.js
 * Upserts the SiteSettings document in MongoDB with all default values.
 * Run: node -r dotenv/config scripts/seed-settings.js
 */

const mongoose = require("mongoose");

const MONGODB_URI = process.env.DATABASE_URL;
if (!MONGODB_URI) {
  console.error("Error: DATABASE_URL is not defined.");
  process.exit(1);
}

const SiteSettingsSchema = new mongoose.Schema(
  {
    showMarketplace: { type: Boolean, default: true },
    // Contact
    email1: { type: String, default: "" },
    email2: { type: String, default: "" },
    phone1: { type: String, default: "" },
    phone2: { type: String, default: "" },
    studioAddress: { type: String, default: "" },
    studioCity: { type: String, default: "" },
    // Social
    instagram: { type: String, default: "" },
    facebook: { type: String, default: "" },
    tiktok: { type: String, default: "" },
    youtube: { type: String, default: "" },
    twitter: { type: String, default: "" },
    linkedin: { type: String, default: "" },
    // Marketplace WhatsApp (digits only, e.g. 94777901129)
    whatsapp: { type: String, default: "" },
    // Footer
    footerTagline: { type: String, default: "" },
    copyrightName: { type: String, default: "" },
  },
  { timestamps: true },
);

const SiteSettings =
  mongoose.models.SiteSettings ||
  mongoose.model("SiteSettings", SiteSettingsSchema);

const DEFAULTS = {
  showMarketplace: true,
  // Contact
  email1: "studionethma@yahoo.com",
  email2: "studionethma3@gmail.com",
  phone1: "+94 777 901 129",
  phone2: "+94 112 624 725",
  studioAddress: "No 144, Raja Mawatha, Ratmalana",
  studioCity: "Ratmalana, Sri Lanka",
  // Social media URLs
  instagram:
    "https://www.instagram.com/jagathkalupahana_photography?igsh=a2Q4ajBkdXVhb3k=",
  facebook: "https://www.facebook.com/share/1AaFHJ5cJj/?mibextid=wwXIfr",
  tiktok:
    "https://www.tiktok.com/@j_kalupahana_photography?_r=1&_t=ZS-93vxK2Wtti9",
  youtube: "",
  twitter: "",
  linkedin: "",
  // WhatsApp — digits only, used by Marketplace "Inquire on WhatsApp" button
  whatsapp: "94777901129",
  // Footer
  footerTagline:
    "Capturing moments, creating memories. Professional photography that tells your unique story through visual artistry.",
  copyrightName: "Studio Nethma",
};

async function main() {
  console.log("Connecting to MongoDB…");
  await mongoose.connect(MONGODB_URI);
  console.log("Connected.");

  const existing = await SiteSettings.findOne();

  if (existing) {
    // Only fill in fields that are currently empty / missing
    let updated = false;
    for (const [key, value] of Object.entries(DEFAULTS)) {
      if (
        existing[key] === undefined ||
        existing[key] === null ||
        existing[key] === ""
      ) {
        existing[key] = value;
        updated = true;
      }
    }
    if (updated) {
      await existing.save();
      console.log(
        "✅ SiteSettings document updated with missing default values.",
      );
    } else {
      console.log(
        "ℹ️  SiteSettings document already populated — no changes needed.",
      );
    }
  } else {
    await SiteSettings.create(DEFAULTS);
    console.log("✅ SiteSettings document created with all default values.");
  }

  await mongoose.disconnect();
  console.log("Done.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
