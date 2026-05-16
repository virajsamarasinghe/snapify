import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import Product from "@/models/Product";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  await dbConnect();
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type");
    const filter = type ? { productType: type } : {};
    const products = await Product.find(filter)
      .populate("category")
      .sort({ createdAt: -1 });
    return NextResponse.json(products);
  } catch (error) {
    console.error("Product fetch error:", error);
    return NextResponse.json(
      { error: "Error fetching products" },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any)?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const body = await req.json();
    await dbConnect();

    // Default status to 'available' if not provided
    if (!body.status) {
      body.status = "available";
    }

    const product = await Product.create({
      title: body.title,
      description: body.description,
      price: body.price,
      images: body.images,
      category: body.categoryId,
      status: body.status,
      productType: body.productType || "gallery",
    });

    // Populate category before returning
    await product.populate("category");

    return NextResponse.json(product);
  } catch (error) {
    console.error("Product creation error:", error);
    return NextResponse.json(
      { error: "Error creating product" },
      { status: 500 },
    );
  }
}
