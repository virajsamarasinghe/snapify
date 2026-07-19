import { authOptions } from "@/lib/auth";
import cloudinary, { extractPublicId } from "@/lib/cloudinary";
import dbConnect from "@/lib/db";
import Product from "@/models/Product";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any)?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { id } = await params;
    const body = await req.json();
    await dbConnect();

    // Delete Cloudinary images that were removed
    const oldProduct = await Product.findById(id);
    if (oldProduct) {
      const oldImages: string[] = oldProduct.images || [];
      const newImages: string[] = body.images || [];
      const removed = oldImages.filter(
        (img: string) => !newImages.includes(img),
      );
      await Promise.all(
        removed.map(async (url: string) => {
          const pid = extractPublicId(url);
          if (pid) {
            try {
              await cloudinary.uploader.destroy(pid);
            } catch {
              /* ignore */
            }
          }
        }),
      );
    }

    const product = await Product.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    revalidatePath("/");
    return NextResponse.json(product);
  } catch (error) {
    console.error("Product update error:", error);
    return NextResponse.json(
      { error: "Error updating product" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any)?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { id } = await params;
    await dbConnect();

    const product = await Product.findById(id);
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Delete all Cloudinary images for this product
    const images: string[] = product.images || [];
    await Promise.all(
      images.map(async (url: string) => {
        const pid = extractPublicId(url);
        if (pid) {
          try {
            await cloudinary.uploader.destroy(pid);
          } catch {
            /* ignore */
          }
        }
      }),
    );

    await product.deleteOne();
    revalidatePath("/");
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Product delete error:", error);
    return NextResponse.json(
      { error: "Error deleting product" },
      { status: 500 },
    );
  }
}
