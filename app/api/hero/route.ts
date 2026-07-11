import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import Hero from "@/models/Hero";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    await dbConnect();
    const heroes = await Hero.find().sort({ order: 1, createdAt: -1 });
    return NextResponse.json(heroes);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch hero images" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    await dbConnect();
    const data = await request.json();
    const hero = await Hero.create(data);
    return NextResponse.json(hero, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to create hero image" },
      { status: 500 },
    );
  }
}
