import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

export async function GET() {
  try {
    const heroDir = path.join(process.cwd(), "public/hero");
    
    // Ensure directory exists
    try {
      await fs.access(heroDir);
    } catch {
      await fs.mkdir(heroDir, { recursive: true });
    }

    const files = await fs.readdir(heroDir);
    
    // Filter for image files
    const imageFiles = files.filter(file => {
      const ext = path.extname(file).toLowerCase();
      return [".jpg", ".jpeg", ".png", ".webp", ".gif"].includes(ext);
    });

    return NextResponse.json({ files: imageFiles });
  } catch (error: any) {
    console.error("Error reading hero directory:", error);
    return NextResponse.json(
      { error: "Failed to read hero directory" },
      { status: 500 }
    );
  }
}
