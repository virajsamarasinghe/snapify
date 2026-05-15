import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Hero from "@/models/Hero";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const resolvedParams = await params;
    const { id } = resolvedParams;
    const hero = await Hero.findByIdAndDelete(id);

    if (!hero) {
      return NextResponse.json(
        { error: "Hero image not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to delete hero image" },
      { status: 500 }
    );
  }
}
