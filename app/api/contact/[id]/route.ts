import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import ContactMessage from "@/models/ContactMessage";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

// Admin: mark message as read/unread
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const { read } = await req.json();

  await dbConnect();
  await ContactMessage.findByIdAndUpdate(id, { read });

  return NextResponse.json({ message: "Updated" });
}

// Admin: delete a message
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  await dbConnect();
  await ContactMessage.findByIdAndDelete(id);

  return NextResponse.json({ message: "Deleted" });
}
