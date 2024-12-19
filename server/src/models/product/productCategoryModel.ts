import mongoose, { Schema, Document } from "mongoose";
import IProductCategory from "../../entities/product/IProductCategory";

// Extend Mongoose's Document interface with IProductCategory
type ProductCategoryDocument = IProductCategory & Document;

// Define the ProductCategory schema
const ProductCategorySchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    image: {
      type: String,
      required: true,
      validate: {
        validator: (v: string) => /^https?:\/\/[^\s]+$/.test(v),
        message: "Invalid image URL format.",
      },
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

// Create the ProductCategory model
const ProductCategory = mongoose.model<ProductCategoryDocument>(
  "ProductCategory",
  ProductCategorySchema
);

export default ProductCategory;
