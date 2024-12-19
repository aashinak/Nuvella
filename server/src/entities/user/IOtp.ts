import { ObjectId } from "mongoose";

export default interface IOtp {
  _id?: string;
  userId: string | ObjectId;
  otp: string;
  otpReason: string;
  otpCreatedAt: Date;
}
