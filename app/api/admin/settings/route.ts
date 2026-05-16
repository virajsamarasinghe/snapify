import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { currentPassword, newEmail, newPassword } = await req.json();

  if (!currentPassword) {
    return NextResponse.json(
      { error: "Current password is required" },
      { status: 400 },
    );
  }

  if (!newEmail && !newPassword) {
    return NextResponse.json(
      { error: "Provide a new email or new password to update" },
      { status: 400 },
    );
  }

  await dbConnect();

  const user = await User.findOne({ email: session.user.email });
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const isValid = await bcrypt.compare(currentPassword, user.password);
  if (!isValid) {
    return NextResponse.json(
      { error: "Current password is incorrect" },
      { status: 400 },
    );
  }

  if (newEmail && newEmail !== user.email) {
    const existing = await User.findOne({ email: newEmail });
    if (existing) {
      return NextResponse.json(
        { error: "That email is already in use" },
        { status: 400 },
      );
    }
    user.email = newEmail;
  }

  if (newPassword) {
    if (newPassword.length < 8) {
      return NextResponse.json(
        { error: "New password must be at least 8 characters" },
        { status: 400 },
      );
    }
    user.password = await bcrypt.hash(newPassword, 12);
  }

  await user.save();

  return NextResponse.json({ message: "Credentials updated successfully" });
}
