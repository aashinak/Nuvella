export default interface IOtp {
  _id?: string;
  userId: string;
  otp: number;
  otpReason: string;
  otpCreatedAt: Date;
}
