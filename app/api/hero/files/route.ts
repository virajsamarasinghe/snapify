import cloudinary from "@/lib/cloudinary";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const result = await (cloudinary.api as any).resources({
      type: "upload",
      prefix: "snapify/hero/",
      max_results: 100,
      resource_type: "image",
    });

    const files = (result.resources as any[]).map((r) => ({
      filename: r.public_id.split("/").pop() + "." + r.format,
      url: r.secure_url,
      publicId: r.public_id,
    }));

    return NextResponse.json({ files });
  } catch (error: any) {
    const message = error?.message || "Failed to list images";
    console.error("Error listing hero images from Cloudinary:", error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
