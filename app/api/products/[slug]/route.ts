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

    // Add computed inStock field and convert to plain object
    const productData: any = product;
    const productWithStock = {
      ...productData,
      _id: productData._id.toString(),
      category: productData.category ? {
        ...productData.category,
        _id: productData.category._id.toString(),
      } : null,
      inStock: productData.hasVariants
        ? productData.variants?.some((v: any) => v.stock > 0)
        : productData.stock > 0,
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
