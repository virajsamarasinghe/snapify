import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import ContactMessage from "@/models/ContactMessage";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

// Simple in-memory rate limiter (per serverless instance): max 5 submissions
// per IP per 10 minutes. Not bulletproof across instances, but stops casual abuse.
const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 10 * 60 * 1000;
const submissions = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = (submissions.get(ip) || []).filter(
    (t) => now - t < RATE_WINDOW_MS,
  );
  if (timestamps.length >= RATE_LIMIT) {
    submissions.set(ip, timestamps);
    return true;
  }
  timestamps.push(now);
  submissions.set(ip, timestamps);
  // Prevent unbounded growth
  if (submissions.size > 10000) submissions.clear();
  return false;
}

// Public: submit contact form
export async function POST(req: NextRequest) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "Too many messages. Please try again later." },
      { status: 429 },
    );
  }

  const body = await req.json();
  const { name, email, phone, subject, message, website } = body;

  // Honeypot: real users never fill this hidden field
  if (website) {
    return NextResponse.json(
      { message: "Message sent successfully" },
      { status: 201 },
    );
  }

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
