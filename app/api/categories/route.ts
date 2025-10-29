import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { Category } from "@/models/Category";

export async function GET() {
  try {
    await connectDB();

    const categories = await Category.find({})
      .sort({ name: 1 })
      .lean();

    const categoriesWithId = categories.map((cat: any) => ({
      ...cat,
      _id: cat._id.toString(),
    }));

    return NextResponse.json(categoriesWithId);
  } catch (error: any) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { error: "Failed to fetch categories", details: error.message },
      { status: 500 }
    );
  }
}
