import { writeFile, mkdir } from "fs/promises";
import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { v4 as uuidv4 } from "uuid";

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

    // Create unique filename
    const filename = `${uuidv4()}${path.extname(file.name)}`;
    const uploadDir = path.join(process.cwd(), "public/uploads");
    
    // Ensure upload directory exists
    try {
      await mkdir(uploadDir, { recursive: true });
    } catch (e) {
      console.error("Error creating upload directory:", e);
    }

    const filepath = path.join(uploadDir, filename);

    // Write file to public/uploads
    await writeFile(filepath, buffer);

    return NextResponse.json({ 
      url: `/uploads/${filename}`,
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
