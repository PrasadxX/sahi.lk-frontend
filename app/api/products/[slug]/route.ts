import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { Product } from "@/models/Product";
import { Category } from "@/models/Category";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await connectDB();
    
    // Ensure Category model is registered
    Category;

    const { slug } = await params;

    const product = await Product.findOne({
      slug: slug,
    })
      .populate("category")
      .lean();

    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    // Add computed inStock field
    const productWithStock = {
      ...product,
      _id: product._id.toString(),
      category: product.category ? {
        ...product.category,
        _id: product.category._id.toString(),
      } : null,
      inStock: product.hasVariants
        ? product.variants?.some((v: any) => v.stock > 0)
        : product.stock > 0,
    };

    return NextResponse.json(productWithStock);
  } catch (error: any) {
    console.error("Error fetching product:", error);
    return NextResponse.json(
      { error: "Failed to fetch product", details: error.message },
      { status: 500 }
    );
  }
}
