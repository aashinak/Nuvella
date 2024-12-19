import mongoose, { Schema, Document } from "mongoose";
import IUserOtp from "../../entities/user/IOtp";

// Create the UserOtp schema
const userOtpSchema: Schema = new Schema<IUserOtp>(
  {
    // Reference to the user
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // OTP value
    otp: { type: String, required: true },
    // OTP reason for clarity and flexibility
    otpReason: {
      type: String,
      required: true,
      enum: ["USER_LOGIN", "PASSWORD_RESET"], // OTP reasons
    },
    // Timestamp for OTP creation with default as now
    otpCreatedAt: { type: Date, required: true, default: Date.now },
  },
  { timestamps: true } // Automatically manages createdAt and updatedAt
);

// Create a TTL index to expire OTPs automatically after 3 minutes
userOtpSchema.index({ otpCreatedAt: 1 }, { expireAfterSeconds: 180 }); // 180 seconds = 3 minutes

// Create the UserOtp model
const UserOtp = mongoose.model<IUserOtp & Document>("UserOtp", userOtpSchema);

export default UserOtp;
