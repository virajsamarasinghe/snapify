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
  } catch (error) {
    console.error("Error listing hero images from Cloudinary:", error);
    return NextResponse.json(
      { error: "Failed to list images" },
      { status: 500 },
    );
  }
}
