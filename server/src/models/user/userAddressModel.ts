import mongoose, { Schema, Document } from "mongoose";
import IUserAddress from "../../entities/user/IUserAddress";

// Extend Mongoose's Document interface with IUserAddress
type UserAddressDocument = IUserAddress & Document;

const UserAddressSchema: Schema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User", // Reference to the `User` model
    },
    address_line1: {
      type: String,
      required: true,
      trim: true,
    },
    address_line2: {
      type: String,
      default: "",
      trim: true,
    },
    city: {
      type: String,
      required: true,
      trim: true,
    },
    postal_code: {
      type: String,
      required: true,
      trim: true,
    },
    state: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      match: [/^\+?[1-9]\d{1,14}$/, "Invalid phone number format"], // Simple regex for phone number validation
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

// Create the UserAddress model
const UserAddress = mongoose.model<UserAddressDocument>("UserAddress", UserAddressSchema);

export default UserAddress;
