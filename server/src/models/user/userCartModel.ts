import mongoose, { Schema, Document } from "mongoose";
import IUserCart from "../../entities/user/IUserCart";

// Extend Mongoose's Document interface with IUserCart
type UserCartDocument = IUserCart & Document;

const UserCartSchema: Schema = new Schema(
  {
    productId: {
      type: [Schema.Types.ObjectId], // Array of ObjectIds to represent product references
      required: true,
      ref: "Product", // Reference to the `Product` model
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

// Create the UserCart model
const UserCart = mongoose.model<UserCartDocument>("UserCart", UserCartSchema);

export default UserCart;
