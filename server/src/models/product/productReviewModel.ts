import mongoose, { Schema, Document } from "mongoose";
import IProductReview from "../../entities/product/IProductReview";

// Extend Mongoose's Document interface with IProductReview
type ProductReviewDocument = IProductReview & Document;

// Define the ProductReview schema
const ProductReviewSchema: Schema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    productId: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    images: [
      {
        type: String,
        validate: {
          validator: (v: string) => /^https?:\/\/[^\s]+$/.test(v),
          message: "Invalid image URL format.",
        },
      },
    ],
    review: {
      type: String,
      trim: true,
    },
    rating: {
      type: Number,
      required: true,
      min: [1, "Rating must be at least 1."],
      max: [5, "Rating must be at most 5."],
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

// Create the ProductReview model
const ProductReview = mongoose.model<ProductReviewDocument>(
  "ProductReview",
  ProductReviewSchema
);

export default ProductReview;
