import mongoose from "mongoose";

const ContactMessageSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, default: "" },
    subject: { type: String, required: true },
    message: { type: String, required: true },
    read: { type: Boolean, default: false },
  },
  { timestamps: true },
);

// Delete cached model so schema changes (e.g. adding 'phone') are always picked up
// in Next.js dev hot-reload cycles where mongoose.models persists across reloads.
delete (mongoose.models as any).ContactMessage;

export default mongoose.model("ContactMessage", ContactMessageSchema);
