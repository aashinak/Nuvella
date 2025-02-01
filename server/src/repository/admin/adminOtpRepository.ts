
import IAdminOtp from "../../entities/admin/IAdminOtp";
import AdminOtp from "../../models/admin/adminOtpModel";
import ApiError from "../../utils/apiError";
import logger from "../../utils/logger";

class AdminOtpRepository {
  // Create or update OTP entry using upsert
  async createOrUpdateOtp(adminOtpData: IAdminOtp): Promise<IAdminOtp> {
    try {
      const { adminId, otpReason } = adminOtpData;

      // Use the upsert operation to either create or update the OTP document
      const otp = await AdminOtp.findOneAndUpdate(
        { adminId }, // Filter to match existing document
        { 
          otpReason,
          otp: adminOtpData.otp, // Update the OTP
          otpCreatedAt: Date.now() // Update the timestamp
        },
        {
          new: true, // Return the updated document
          upsert: true, // If no document is found, create a new one
        }
      );

      return otp;
    } catch (error: any) {
      logger.error("Error creating or updating OTP: " + error.message, error);
      throw new ApiError(500,"Internal Server Error while creating or updating OTP",  [error.message]);
    }
  }

  // Find OTP by admin ID and reason
  async findByAdminIdAndReason(adminId: string, otpReason: string): Promise<IAdminOtp | null> {
    try {
      return await AdminOtp.findOne({ adminId, otpReason }).exec();
    } catch (error: any) {
      logger.error(`Error finding OTP for admin ID: ${adminId}, reason: ${otpReason}`, error);
      throw new ApiError(500, "Internal Server Error while finding OTP",  [error.message]);
    }
  }

  // Delete OTP by admin ID and reason
  async deleteByAdminIdAndReason(adminId: string, otpReason: string): Promise<IAdminOtp | null> {
    try {
      return await AdminOtp.findOneAndDelete({ adminId, otpReason }).exec();
    } catch (error: any) {
      logger.error(`Error deleting OTP for admin ID: ${adminId}, reason: ${otpReason}`, error);
      throw new ApiError(500,"Internal Server Error while deleting OTP",  [error.message]);
    }
  }

  // Find OTP records by admin ID
  async findByAdminId(adminId: string): Promise<IAdminOtp | null> {
    try {
      return await AdminOtp.findOne({ adminId }).exec();
    } catch (error: any) {
      logger.error(`Error finding OTP for admin ID: ${adminId}`, error);
      throw new ApiError(500,"Internal Server Error while finding OTPs for admin",  [error.message]);
    }
  }
}

export default new AdminOtpRepository();
