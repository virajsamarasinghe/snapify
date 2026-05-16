import mongoose, { Document, Schema } from "mongoose";

export interface IAboutSettings extends Document {
  tagline: string;
  heading: string;
  headingItalic: string;
  bio: string;
  stat1Value: string;
  stat1Label: string;
  stat2Value: string;
  stat2Label: string;
  photos: string[];
}

const AboutSettingsSchema = new Schema<IAboutSettings>(
  {
    tagline: { type: String, default: "// THE ARCHITECT OF LIGHT" },
    heading: { type: String, default: "Beyond the" },
    headingItalic: { type: String, default: "Frame" },
    bio: {
      type: String,
      default:
        "My work is an exploration of the human condition. I don't just capture moments; I deconstruct them to reveal the raw emotion hidden beneath. A visual symphony where every shadow tells a story and every highlight sings.",
    },
    stat1Value: { type: String, default: "12" },
    stat1Label: { type: String, default: "Years Experience" },
    stat2Value: { type: String, default: "50+" },
    stat2Label: { type: String, default: "Global Exhibitions" },
    photos: {
      type: [String],
      default: ["/about/man.jpeg", "/about/man2.jpeg", "/about/man3.jpeg"],
    },
  },
  { timestamps: true },
);

delete (mongoose.models as any).AboutSettings;
const AboutSettings = mongoose.model<IAboutSettings>(
  "AboutSettings",
  AboutSettingsSchema,
);
export default AboutSettings;
