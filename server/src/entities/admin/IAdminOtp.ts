import { ObjectId } from "mongoose";

export default interface IAdminOtp {
    _id?: string;
    adminId: string | ObjectId;
    otp: string;
    otpReason: string;
    otpCreatedAt: Date;
  }
  