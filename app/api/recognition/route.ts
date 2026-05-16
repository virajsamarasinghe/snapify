import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import Recognition from "@/models/Recognition";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// Public: get all recognition entries ordered
export async function GET() {
  await dbConnect();
  const items = await Recognition.find()
    .sort({ order: 1, createdAt: 1 })
    .lean();
  const serialized = items.map((item: any) => ({
    ...item,
    _id: item._id.toString(),
  }));
  return NextResponse.json(serialized);
}

// Admin: create new entry
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { year, title, venue, description, type, image } = body;

  if (!year || !title || !venue || !description || !type) {
    return NextResponse.json(
      { error: "All fields except image are required" },
      { status: 400 },
    );
  }

  await dbConnect();
  const maxOrder = (await Recognition.findOne()
    .sort({ order: -1 })
    .select("order")
    .lean()) as any;
  const order = maxOrder ? maxOrder.order + 1 : 0;

  const item = await Recognition.create({
    year,
    title,
    venue,
    description,
    type,
    image: image || "",
    order,
  });
  return NextResponse.json(item, { status: 201 });
}

// Admin: reorder (PATCH bulk update)
export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { orderedIds } = await req.json();
  if (!Array.isArray(orderedIds)) {
    return NextResponse.json(
      { error: "orderedIds array required" },
      { status: 400 },
    );
  }

  await dbConnect();
  await Promise.all(
    orderedIds.map((id: string, index: number) =>
      Recognition.findByIdAndUpdate(id, { order: index }),
    ),
  );

  return NextResponse.json({ message: "Order updated" });
}
