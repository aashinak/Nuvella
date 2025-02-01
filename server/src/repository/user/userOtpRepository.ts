import IOtp from "../../entities/user/IOtp";
import UserOtp from "../../models/user/userOtpModel";
import ApiError from "../../utils/apiError";
import logger from "../../utils/logger";

 class OtpRepository {
  async saveOtp(
    userId: string,
    otp: string,
    otpReason: "USER_LOGIN" | "PASSWORD_RESET" | "USER_REGISTRATION"
  ): Promise<IOtp | null> {
    try {
      const otpDoc = await UserOtp.findOneAndUpdate(
        { userId },
        { otp, otpReason, otpCreatedAt: new Date() },
        { upsert: true, new: true }
      );
      return otpDoc;
    } catch (error: any) {
      logger.error(
        `Failed to save OTP for userId ${userId}, reason: ${otpReason}. Error: ${error.message}`
      );
      throw new ApiError(500, `Failed to save OTP for userId ${userId}`);
    }
  }

  async findOtpByUserId(userId: string): Promise<IOtp | null> {
    try {
      const otpDoc = await UserOtp.findOne({ userId });
      return otpDoc;
    } catch (error: any) {
      logger.error(
        `Failed to find OTP for userId ${userId}. Error: ${error.message}`
      );
      throw new ApiError(500, `Failed to find OTP for userId ${userId}`);
    }
  }

  async deleteOtp(userId: string): Promise<boolean> {
    try {
      const result = await UserOtp.deleteOne({ userId });
      return result.deletedCount === 1;
    } catch (error: any) {
      logger.error(
        `Failed to delete OTP for userId ${userId}. Error: ${error.message}`
      );
      throw new ApiError(500, `Failed to delete OTP for userId ${userId}`);
    }
  }
}

export default new OtpRepository()
