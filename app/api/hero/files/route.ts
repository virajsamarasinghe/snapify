import { extractPublicId } from "@/lib/cloudinary";
import dbConnect from "@/lib/db";
import Hero from "@/models/Hero";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await dbConnect();
    const heroes = await Hero.find().sort({ createdAt: -1 }).lean();

    const files = (heroes as any[]).map((h) => {
      const publicId = extractPublicId(h.src) ?? "";
      const parts = (h.src as string).split("/");
      const filename = parts[parts.length - 1] ?? publicId;
      return {
        filename,
        url: h.src as string,
        publicId,
        isHidden: (h.isHidden as boolean) ?? false,
      };
    });

    return NextResponse.json({ files });
  } catch (error: any) {
    const message = error?.message || "Failed to list images";
    console.error("Error listing hero images:", error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
