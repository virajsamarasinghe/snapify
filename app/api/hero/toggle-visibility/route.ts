import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import Hero from "@/models/Hero";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    await dbConnect();
    const { src, isHidden } = await request.json();

    if (!src) {
      return NextResponse.json(
        { error: "Image source is required" },
        { status: 400 },
      );
    }

    // Upsert the record
    const hero = await Hero.findOneAndUpdate(
      { src },
      { src, isHidden },
      { new: true, upsert: true },
    );

    return NextResponse.json({ success: true, hero });
  } catch (error: any) {
    console.error("Toggle visibility error:", error);
    return NextResponse.json(
      { error: "Failed to toggle visibility" },
      { status: 500 },
    );
  }
}

export async function GET() {
  try {
    await dbConnect();
    // Return a list of srcs that are hidden
    const hiddenHeroes = await Hero.find({ isHidden: true })
      .select("src")
      .lean();
    const hiddenSrcs = hiddenHeroes.map((h: any) => h.src);
    return NextResponse.json({ hiddenSrcs });
  } catch (error: any) {
    console.error("Fetch hidden error:", error);
    return NextResponse.json(
      { error: "Failed to fetch hidden images" },
      { status: 500 },
    );
  }
}
