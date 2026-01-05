import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Product from "@/models/Product";

export async function GET() {
  await dbConnect();
  try {
    const products = await Product.find()
      .populate("category")
      .sort({ createdAt: -1 });
    return NextResponse.json(products);
  } catch (error) {
     console.error("Product fetch error:", error);
    return NextResponse.json({ error: "Error fetching products" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    await dbConnect();

    // Default status to 'available' if not provided
    if (!body.status) {
        body.status = 'available';
    }

    const product = await Product.create({
      title: body.title,
      description: body.description,
      price: body.price,
      images: body.images,
      category: body.categoryId, // Ensure this matches frontend payload
      status: body.status,
    });
    
    // Populate category before returning
    await product.populate('category');

    return NextResponse.json(product);
  } catch (error) {
    console.error("Product creation error:", error);
    return NextResponse.json(
      { error: "Error creating product" },
      { status: 500 }
    );
  }
}
