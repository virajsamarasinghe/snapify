import { authOptions } from "@/lib/auth";
import { randomUUID } from "crypto";
import fs from "fs/promises";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import path from "path";

export const dynamic = "force-dynamic";

const UPLOAD_DIR = path.join(process.cwd(), "public/uploads/about");

async function ensureDir() {
  await fs.mkdir(UPLOAD_DIR, { recursive: true });
}

// GET — list existing about photos
export async function GET() {
  await ensureDir();
  try {
    const files = await fs.readdir(UPLOAD_DIR);
    const photos = files
      .filter((f) => /\.(jpe?g|png|webp|gif)$/i.test(f))
      .map((f) => `/uploads/about/${f}`);
    return NextResponse.json(photos);
  } catch {
    return NextResponse.json([]);
  }
}

// POST — upload a new about photo (admin only)
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif"];
  if (!allowed.includes(file.type)) {
    return NextResponse.json({ error: "Invalid file type" }, { status: 400 });
  }

  await ensureDir();
  const ext = file.name.split(".").pop();
  const filename = `${randomUUID()}.${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(path.join(UPLOAD_DIR, filename), buffer);

  return NextResponse.json({ url: `/uploads/about/${filename}` });
}
