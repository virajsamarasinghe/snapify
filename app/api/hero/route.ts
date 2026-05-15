import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Hero from "@/models/Hero";

export async function GET() {
  try {
    await dbConnect();
    const heroes = await Hero.find().sort({ order: 1, createdAt: -1 });
    return NextResponse.json(heroes);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch hero images" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const data = await request.json();
    const hero = await Hero.create(data);
    return NextResponse.json(hero, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to create hero image" },
      { status: 500 }
    );
  }
}
