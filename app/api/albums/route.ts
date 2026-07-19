import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import Album from "@/models/Album";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const categoryId = req.nextUrl.searchParams.get("categoryId");
    const filter = categoryId ? { category: categoryId } : {};
    const albums = await Album.find(filter)
      .sort({ conductDate: -1, createdAt: -1 })
      .lean();
    return NextResponse.json(albums);
  } catch (error) {
    console.error("Albums fetch error:", error);
    return NextResponse.json(
      { error: "Error fetching albums" },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any)?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    await dbConnect();
    const body = await req.json();
    const album = await Album.create(body);
    revalidatePath("/");
    return NextResponse.json(album);
  } catch (error) {
    console.error("Album create error:", error);
    return NextResponse.json(
      { error: "Error creating album" },
      { status: 500 },
    );
  }
}
