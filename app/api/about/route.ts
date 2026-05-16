import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import AboutSettings from "@/models/AboutSettings";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// Public GET — used by home page server component
export async function GET() {
  try {
    await dbConnect();
    let settings = await AboutSettings.findOne().lean();
    if (!settings) {
      const created = await AboutSettings.create({});
      settings = created.toObject();
    }
    return NextResponse.json(settings, {
      headers: { "Cache-Control": "no-store, max-age=0" },
    });
  } catch (err) {
    console.error("About GET error:", err);
    return NextResponse.json({ error: "Failed to load" }, { status: 500 });
  }
}

// Admin PUT — update about settings
export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  await dbConnect();

  let settings = await AboutSettings.findOne();
  if (!settings) {
    settings = new AboutSettings(body);
  } else {
    Object.assign(settings, body);
  }
  await settings.save();

  return NextResponse.json(settings.toObject());
}
