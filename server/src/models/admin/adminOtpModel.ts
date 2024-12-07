import mongoose, { Schema, Document } from "mongoose";
import IAdminOtp from "../../entities/admin/IAdminOtp";

// Create the AdminOtp schema
const adminOtpSchema: Schema = new Schema<IAdminOtp>(
  {
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },
    otp: { type: String, required: true },
    otpReason: {
      type: String,
      required: true,
      enum: ["ADMIN_LOGIN", "ADD_ADMIN"],
    },
    otpCreatedAt: { type: Date, required: true, default: Date.now },
  },
  { timestamps: true }
);

// Create a TTL index for the otpCreatedAt field with a 3-minute expiration
adminOtpSchema.index({ otpCreatedAt: 1 }, { expireAfterSeconds: 180 }); // 180 seconds = 3 minutes

// Create the AdminOtp model
const AdminOtp = mongoose.model<IAdminOtp & Document>(
  "AdminOtp",
  adminOtpSchema
);

export default AdminOtp;
