import mongoose, { Document, Schema } from "mongoose";

export interface ISiteSettings extends Document {
  showMarketplace: boolean;
  // Contact
  email1: string;
  email2: string;
  phone1: string;
  phone2: string;
  studioAddress: string;
  studioCity: string;
  // Social
  instagram: string;
  facebook: string;
  tiktok: string;
  youtube: string;
  twitter: string;
  linkedin: string;
  whatsapp: string;
  // Footer
  footerTagline: string;
  copyrightName: string;
  // Gallery Quote
  galleryQuote: string;
  galleryQuoteAuthor: string;
}

const SiteSettingsSchema = new Schema<ISiteSettings>(
  {
    showMarketplace: { type: Boolean, default: true },
    email1: { type: String, default: "studionethma@yahoo.com" },
    email2: { type: String, default: "studionethma3@gmail.com" },
    phone1: { type: String, default: "+94 777 901 129" },
    phone2: { type: String, default: "+94 112 624 725" },
    studioAddress: { type: String, default: "No 144, Raja Mawatha, Ratmalana" },
    studioCity: { type: String, default: "Ratmalana, Sri Lanka" },
    instagram: {
      type: String,
      default:
        "https://www.instagram.com/jagathkalupahana_photography?igsh=a2Q4ajBkdXVhb3k=",
    },
    facebook: {
      type: String,
      default: "https://www.facebook.com/share/1AaFHJ5cJj/?mibextid=wwXIfr",
    },
    tiktok: {
      type: String,
      default:
        "https://www.tiktok.com/@j_kalupahana_photography?_r=1&_t=ZS-93vxK2Wtti9",
    },
    youtube: { type: String, default: "" },
    twitter: { type: String, default: "" },
    linkedin: { type: String, default: "" },
    whatsapp: { type: String, default: "94777901129" },
    footerTagline: {
      type: String,
      default:
        "Capturing moments, creating memories. Professional photography that tells your unique story through visual artistry.",
    },
    copyrightName: { type: String, default: "Studio Nethma" },
    galleryQuote: {
      type: String,
      default: "Photography is the story I fail to put into words.",
    },
    galleryQuoteAuthor: { type: String, default: "Destin Sparks" },
  },
  { timestamps: true },
);

delete (mongoose.models as any).SiteSettings;
const SiteSettings = mongoose.model<ISiteSettings>(
  "SiteSettings",
  SiteSettingsSchema,
);
export default SiteSettings;
