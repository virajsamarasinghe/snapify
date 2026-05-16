import cloudinary, { extractPublicId } from "@/lib/cloudinary";
import dbConnect from "@/lib/db";
import Category from "@/models/Category";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await req.json();
    await dbConnect();

    // Delete old Cloudinary image if being replaced
    const oldCategory = await Category.findById(id);
    if (
      oldCategory &&
      body.image &&
      body.image !== oldCategory.image &&
      oldCategory.image
    ) {
      const pid = extractPublicId(oldCategory.image);
      if (pid) {
        try {
          await cloudinary.uploader.destroy(pid);
        } catch {
          /* ignore */
        }
      }
    }

    const category = await Category.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    if (!category) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(category);
  } catch (error) {
    console.error("Category update error:", error);
    return NextResponse.json(
      { error: "Error updating category" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    await dbConnect();

    const category = await Category.findById(id);
    if (!category) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 },
      );
    }

    // Delete Cloudinary image
    if (category.image) {
      const pid = extractPublicId(category.image);
      if (pid) {
        try {
          await cloudinary.uploader.destroy(pid);
        } catch {
          /* ignore */
        }
      }
    }

    await category.deleteOne();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Category delete error:", error);
    return NextResponse.json(
      { error: "Error deleting category" },
      { status: 500 },
    );
  }
}
