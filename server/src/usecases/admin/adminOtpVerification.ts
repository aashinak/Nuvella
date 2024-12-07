import adminOtpRepository from "../../repository/admin/adminOtpRepository";
import adminRepository from "../../repository/admin/adminRepository";
import ApiError from "../../utils/apiError";
import hashOtp from "../../utils/hashOtp";
import tokenService from "../../utils/tokenService";

interface adminVerificationData {
  adminId: string;
  otp: string;
}

const adminOtpVerification = async (data: adminVerificationData) => {
    
  const existingAdmin = await adminRepository.findById(data.adminId);
  if (!existingAdmin) {
    throw new ApiError(400, "Admin doesn't exists");
  }

  const otpData = await adminOtpRepository.findByAdminId(data.adminId);

  if (!otpData) {
    throw new ApiError(400, "OTP not found");
  }

  if (otpData.otpReason !== "ADMIN_LOGIN") {
    throw new ApiError(400, "Invalid OTP reason");
  }

  const isOtpVerified = await hashOtp.compareOtp(+data.otp, otpData.otp);
  if (!isOtpVerified) {
    throw new ApiError(400, "Invalid OTP");
  }

  await adminOtpRepository.deleteByAdminIdAndReason(
    otpData._id as string,
    otpData.otpReason
  );

  const refreshToken = await tokenService.generateRefreshToken(
    existingAdmin._id as string,
    "ADMIN",
    "1d"
  );

  const accessToken = await tokenService.generateAccessToken(
    existingAdmin._id as string,
    "ADMIN",
    "10m"
  );

  const updatedAdmin = await adminRepository.updateById(
    existingAdmin._id as string,
    {
      isVerified: true,
      refreshToken,
    }
  );

  if (!updatedAdmin) {
    throw new ApiError(500, "Admin verification update failed");
  }
  const sanitizedAdmin = {
    _id: updatedAdmin._id,
    name: updatedAdmin.name,
    email: updatedAdmin.email,
  };

  return {
    message: "Admin verification successfull",
    sanitizedAdmin,
    accessToken,
    refreshToken,
  };
};

export default adminOtpVerification;
