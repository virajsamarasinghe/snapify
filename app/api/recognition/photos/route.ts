import { authOptions } from "@/lib/auth";
import { mkdir, readdir, writeFile } from "fs/promises";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { v4 as uuidv4 } from "uuid";

export const dynamic = "force-dynamic";

const RECOGNITION_DIR = path.join(process.cwd(), "public/uploads/recognition");
const PUBLIC_PREFIX = "/uploads/recognition";

// GET: list existing recognition photos
export async function GET() {
  try {
    await mkdir(RECOGNITION_DIR, { recursive: true });
    const files = await readdir(RECOGNITION_DIR);
    const images = files
      .filter((f) => /\.(jpe?g|png|webp|gif)$/i.test(f))
      .map((f) => `${PUBLIC_PREFIX}/${f}`);
    return NextResponse.json(images);
  } catch {
    return NextResponse.json([]);
  }
}

// POST: upload a new recognition photo (admin only)
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

  const ext = path.extname(file.name).toLowerCase();
  if (![".jpg", ".jpeg", ".png", ".webp", ".gif"].includes(ext)) {
    return NextResponse.json({ error: "Invalid file type" }, { status: 400 });
  }

  await mkdir(RECOGNITION_DIR, { recursive: true });

  const filename = `${uuidv4()}${ext}`;
  const filepath = path.join(RECOGNITION_DIR, filename);
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(filepath, buffer);

  return NextResponse.json(
    { url: `${PUBLIC_PREFIX}/${filename}` },
    { status: 201 },
  );
}
