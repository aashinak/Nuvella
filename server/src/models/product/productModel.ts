import mongoose, { Schema, Document } from "mongoose";
import IProduct from "../../entities/product/IProduct";

type ProductDocument = IProduct & Document;

// Define the Product schema
const ProductSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    images: {
      type: [String],
      required: true,
      validate: {
        validator: (v: string[]) => v.length > 0,
        message: "At least one image URL must be provided.",
      },
    },
    price: {
      type: Number,
      required: true,
      validate: {
        validator: (v: string) => /^[0-9]+(\.[0-9]{1,2})?$/.test(v),
        message: "Invalid price format.",
      },
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProductCategory",
      required: true,
    },
    stock: {
      type: Number,
      required: true,
      min: [0, "Stock cannot be negative."],
    },
    sizes: [
      {
        size: { type: String },
        stock: {
          type: Number,
          min: [0, "Stock cannot be negative."],
        },
      },
    ],
    discountId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProductDiscount",
    },
    discountedPrice: {
      type: Number,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

// Create the Product model
const Product = mongoose.model<ProductDocument>("Product", ProductSchema);

export default Product;
