import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import ContactMessage from "@/models/ContactMessage";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

// Public: submit contact form
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, email, phone, subject, message } = body;

  if (!name || !email || !phone || !subject || !message) {
    return NextResponse.json(
      { error: "All fields are required" },
      { status: 400 },
    );
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return NextResponse.json(
      { error: "Invalid email address" },
      { status: 400 },
    );
  }

  // Accept any phone with 6+ digits (stripped of formatting)
  const digitsOnly = phone.replace(/\D/g, "");
  if (digitsOnly.length < 6) {
    return NextResponse.json(
      { error: "Please enter a valid phone number" },
      { status: 400 },
    );
  }

  await dbConnect();
  await ContactMessage.create({
    name,
    email,
    phone: phone.trim(),
    subject,
    message,
  });

  return NextResponse.json(
    { message: "Message sent successfully" },
    { status: 201 },
  );
}

// Admin: list all messages
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();
  const messages = await ContactMessage.find().sort({ createdAt: -1 }).lean();

  return NextResponse.json(messages);
}
