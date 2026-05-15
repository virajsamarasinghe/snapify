import { writeFile, mkdir } from "fs/promises";
import { NextRequest, NextResponse } from "next/server";
import path from "path";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { error: "No file uploaded" },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Use original filename (cleaned up) or let user override. We'll use original for simplicity, but sanitize it.
    const safeName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, "");
    
    // Add timestamp to prevent overwriting if file with same name exists
    const timestamp = Date.now();
    const ext = path.extname(safeName);
    const basename = path.basename(safeName, ext);
    const filename = `${basename}-${timestamp}${ext}`;

    const uploadDir = path.join(process.cwd(), "public/hero");
    
    // Ensure upload directory exists
    try {
      await mkdir(uploadDir, { recursive: true });
    } catch (e) {
      // Ignore if exists
    }

    const filepath = path.join(uploadDir, filename);

    // Write file to public/hero
    await writeFile(filepath, buffer);

    return NextResponse.json({ 
      filename: filename,
      url: `/hero/${filename}`,
      success: true 
    });

  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Error uploading file" },
      { status: 500 }
    );
  }
}
