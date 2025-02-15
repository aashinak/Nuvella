import mongoose, { Schema, Document } from "mongoose";
import IUser from "../../entities/user/IUser";

// Extend Mongoose's Document interface with IUser
type UserDocument = IUser & Document;

const UserSchema: Schema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    avatar: {
      type: String,
      default: null,
    },
    password: {
      type: String,
    },
    firstname: {
      type: String,
      required: true,
      trim: true,
    },
    lastname: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please provide a valid email address",
      ],
    },
    phone: {
      type: String,
      match: [/^\+?[1-9]\d{1,14}$/, "Please provide a valid phone number"],
    },
    isVerified: {
      type: Boolean,
      required: true,
      default: false,
    },
    googleId: {
      type: String,
      default: null,
    },
    provider: {
      type: String,
      enum: ["local", "google"],
      default: "local",
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

// Add pre-save middleware to enforce password requirement
UserSchema.pre<UserDocument>("save", function (next) {
  if (!this.googleId && !this.password) {
    return next(new Error("Password is required for local users."));
  }
  next();
});

// Create the User model
const User = mongoose.model<UserDocument>("User", UserSchema);

export default User;
