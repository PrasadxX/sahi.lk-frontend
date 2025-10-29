import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { Product } from "@/models/Product";
import { Category } from "@/models/Category";

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    // Ensure Category model is registered
    Category;

    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const featured = searchParams.get("featured");
    const search = searchParams.get("search");

    let query: any = {}; // Show all products

    if (category && category !== "all") {
      query.category = category;
    }

    if (featured === "true") {
      query.featured = true;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    const products = await Product.find(query)
      .populate("category")
      .sort({ createdAt: -1 })
      .lean();

    // Add computed inStock field
    const productsWithStock = products.map((product: any) => ({
      ...product,
      _id: product._id.toString(),
      category: product.category ? {
        ...product.category,
        _id: product.category._id.toString(),
      } : null,
      inStock: product.hasVariants
        ? product.variants?.some((v: any) => v.stock > 0)
        : product.stock > 0,
    }));

    return NextResponse.json(productsWithStock);
  } catch (error: any) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products", details: error.message },
      { status: 500 }
    );
  }
}
