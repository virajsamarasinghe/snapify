import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Category from "@/models/Category";
// Import Product to ensure model registration for population
import "@/models/Product"; 

export async function GET() {
  try {
    await dbConnect();
    // Use virtual populate to get product counts if needed, 
    // or just fetch categories first. 
    // For simplicity and performance, we might just count separately or rely on client fetching.
    // Here we'll just fetch categories.
    const categories = await Category.find().sort({ createdAt: -1 });

    // To get product counts, we can do an aggregation or separate query.
    // For now, let's keep it simple and just return categories.
    // If we absolutely need counts in list, we can aggregate.
    
    // Using lean() for better performance if no virtuals needed, 
    // but we defined virtuals.
    
    return NextResponse.json(categories);
  } catch (error) {
    console.error("Category fetch error:", error);
    return NextResponse.json(
      { error: "Error fetching categories" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = true; // TODO: restore session check
    // const session = await getServerSession();
    // if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await dbConnect();
    const body = await req.json();
    const { name, image } = body;

    const slug = name.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, "");

    const category = await Category.create({
      name,
      slug,
      image,
    });

    return NextResponse.json(category);
  } catch (error) {
    console.error("Category create error:", error);
    return NextResponse.json(
      { error: "Error creating category" },
      { status: 500 }
    );
  }
}
