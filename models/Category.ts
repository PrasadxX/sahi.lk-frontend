import mongoose, { Schema, models } from "mongoose";

const CategorySchema = new Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, unique: true, sparse: true },
    parent: { type: mongoose.Types.ObjectId, ref: "Category" },
    properties: [{ type: Object }],
    description: String,
    image: String,
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

export const Category = models.Category || mongoose.model("Category", CategorySchema);
