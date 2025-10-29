import mongoose, { Schema, models } from "mongoose";

const VariantSchema = new Schema({
  name: { type: String, required: true },
  properties: { type: Object, default: {} },
  price: { type: Number, required: true },
  stock: { type: Number, default: 0 },
  sku: { type: String },
  isActive: { type: Boolean, default: true },
});

const ProductSchema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, unique: true, sparse: true },
    description: String,
    price: { type: Number, required: true },
    images: [{ type: String }],
    videos: [
      {
        title: String,
        url: String,
      },
    ],
    category: { type: mongoose.Types.ObjectId, ref: "Category" },
    properties: { type: Object },
    variants: [VariantSchema],
    hasVariants: { type: Boolean, default: false },
    variantSelectionStyle: {
      type: String,
      enum: ["dropdown", "quantity"],
      default: "dropdown",
    },
    stock: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    featured: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

export const Product = models.Product || mongoose.model("Product", ProductSchema);
