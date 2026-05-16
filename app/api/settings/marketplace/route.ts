import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import SiteSettings from "@/models/SiteSettings";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// Admin PATCH — toggle marketplace visibility
export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { showMarketplace } = await req.json();

  await dbConnect();
  let settings = await SiteSettings.findOne();
  if (!settings) {
    settings = new SiteSettings({ showMarketplace });
  } else {
    settings.showMarketplace = showMarketplace;
  }
  await settings.save();

  return NextResponse.json({ showMarketplace: settings.showMarketplace });
}
