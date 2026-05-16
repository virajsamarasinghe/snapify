import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import SiteSettings from "@/models/SiteSettings";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// Public GET — returns all site settings (social, contact, footer, gallery quote)
export async function GET() {
  await dbConnect();
  let settings = (await SiteSettings.findOne().lean()) as any;
  if (!settings) {
    settings = (await SiteSettings.create({})).toObject();
  }

  return NextResponse.json(
    {
      showMarketplace: settings.showMarketplace ?? true,
      email1: settings.email1 ?? "studionethma@yahoo.com",
      email2: settings.email2 ?? "",
      phone1: settings.phone1 ?? "+94 777 901 129",
      phone2: settings.phone2 ?? "",
      studioAddress:
        settings.studioAddress ?? "No 144, Raja Mawatha, Ratmalana",
      studioCity: settings.studioCity ?? "Ratmalana, Sri Lanka",
      instagram: settings.instagram ?? "",
      facebook: settings.facebook ?? "",
      tiktok: settings.tiktok ?? "",
      youtube: settings.youtube ?? "",
      twitter: settings.twitter ?? "",
      linkedin: settings.linkedin ?? "",
      whatsapp: settings.whatsapp ?? "94777901129",
      footerTagline:
        settings.footerTagline ?? "Capturing moments, creating memories.",
      copyrightName: settings.copyrightName ?? "Studio Nethma",
      galleryQuote:
        settings.galleryQuote ??
        "Photography is the story I fail to put into words.",
      galleryQuoteAuthor: settings.galleryQuoteAuthor ?? "Destin Sparks",
    },
    { headers: { "Cache-Control": "no-store, max-age=0" } },
  );
}

// Admin PUT — update any site settings fields
export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  await dbConnect();

  const allowed = [
    "showMarketplace",
    "email1",
    "email2",
    "phone1",
    "phone2",
    "studioAddress",
    "studioCity",
    "instagram",
    "facebook",
    "tiktok",
    "youtube",
    "twitter",
    "linkedin",
    "whatsapp",
    "footerTagline",
    "copyrightName",
    "galleryQuote",
    "galleryQuoteAuthor",
  ];

  const update: Record<string, any> = {};
  for (const key of allowed) {
    if (key in body) update[key] = body[key];
  }

  let settings = await SiteSettings.findOne();
  if (!settings) {
    settings = new SiteSettings(update);
  } else {
    Object.assign(settings, update);
  }
  await settings.save();

  return NextResponse.json({ success: true });
}
