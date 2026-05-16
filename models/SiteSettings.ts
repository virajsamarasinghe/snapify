import mongoose, { Document, Schema } from "mongoose";

export interface ISiteSettings extends Document {
  showMarketplace: boolean;
}

const SiteSettingsSchema = new Schema<ISiteSettings>(
  {
    showMarketplace: { type: Boolean, default: true },
  },
  { timestamps: true },
);

delete (mongoose.models as any).SiteSettings;
const SiteSettings = mongoose.model<ISiteSettings>(
  "SiteSettings",
  SiteSettingsSchema,
);
export default SiteSettings;
