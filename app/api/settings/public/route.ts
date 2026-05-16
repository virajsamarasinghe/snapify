import dbConnect from "@/lib/db";
import SiteSettings from "@/models/SiteSettings";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// Public GET — used by navbars
export async function GET() {
  await dbConnect();
  let settings = await SiteSettings.findOne().lean();
  if (!settings) {
    settings = await SiteSettings.create({ showMarketplace: true });
  }
  return NextResponse.json(
    { showMarketplace: (settings as any).showMarketplace },
    { headers: { "Cache-Control": "no-store, max-age=0" } },
  );
}
