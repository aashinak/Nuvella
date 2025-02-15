import mongoose, { Schema, Document } from "mongoose";
import IProductDiscount from "../../entities/product/IProductDiscount";

// Extend Mongoose's Document interface with IProductDiscount
type ProductDiscountDocument = IProductDiscount & Document;

// Define the ProductDiscount schema
const ProductDiscountSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    discount_percentage: {
      type: Number,
      required: true,
      min: [0, "Discount percentage cannot be negative."],
      max: [100, "Discount percentage cannot exceed 100."],
    },
    active: {
      type: Boolean,
      required: true,
      default: true,
    },
  },
);

// Create the ProductDiscount model
const ProductDiscount = mongoose.model<ProductDiscountDocument>(
  "ProductDiscount",
  ProductDiscountSchema
);

export default ProductDiscount;
