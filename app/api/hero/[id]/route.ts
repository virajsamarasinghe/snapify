import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import Hero from "@/models/Hero";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    await dbConnect();
    const resolvedParams = await params;
    const { id } = resolvedParams;
    const hero = await Hero.findByIdAndDelete(id);

    if (!hero) {
      return NextResponse.json(
        { error: "Hero image not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to delete hero image" },
      { status: 500 },
    );
  }
}
