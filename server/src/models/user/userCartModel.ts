import mongoose, { Schema, Document } from "mongoose";
import IUserCart from "../../entities/user/IUserCart";

// Extend Mongoose's Document interface with IUserCart
type UserCartDocument = IUserCart & Document;

const UserCartSchema: Schema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId, // ObjectId to reference the user
      required: true,
      ref: "User", // Reference to the `User` model
    },
    productId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Product", // Reference to the `Product` model
    },
    size: {
      type: String,
      required: true,
      enum: ["S", "M", "L", "XL", "2XL"],
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

// Create the UserCart model
const UserCart = mongoose.model<UserCartDocument>("UserCart", UserCartSchema);

export default UserCart;
