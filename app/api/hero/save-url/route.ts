import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import Hero from "@/models/Hero";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// Called after a successful direct-to-Cloudinary upload to persist the URL
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as { role?: string })?.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { url, publicId } = body as { url?: string; publicId?: string };

  if (!url || !publicId) {
    return NextResponse.json(
      { error: "url and publicId are required" },
      { status: 400 },
    );
  }

  await dbConnect();
  await Hero.findOneAndUpdate(
    { src: url },
    { src: url, isHidden: false },
    { upsert: true, new: true },
  );

  return NextResponse.json({
    success: true,
    filename: publicId.split("/").pop(),
    url,
    publicId,
  });
}
