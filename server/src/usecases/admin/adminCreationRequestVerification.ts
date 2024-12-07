import adminOtpRepository from "../../repository/admin/adminOtpRepository";
import adminRepository from "../../repository/admin/adminRepository";
import ApiError from "../../utils/apiError";
import hashOtp from "../../utils/hashOtp";

interface adminCreationRequestVerificationData {
  otp1: number;
  otp2: number;
  adminId: string;
  newAdminsId: string;
}

const adminCreationRequestVerification = async (
  data: adminCreationRequestVerificationData
) => {
  const existingAdmin = await adminRepository.findById(data.adminId);
  if (!existingAdmin) {
    throw new ApiError(400, "Invalid admin");
  }
  const existingNewAdmin = await adminRepository.findById(data.newAdminsId);
  if (!existingNewAdmin) {
    throw new ApiError(400, "Invalid new admin details");
  }

  const otpDoc = await adminOtpRepository.findByAdminId(data.adminId);
  if (!otpDoc || otpDoc.otpReason !== "ADD_ADMIN") {
    throw new ApiError(400, "Invalid Otp usage");
  }

  const concatenatedOtp = parseInt(`${data.otp1}${data.otp2}`, 10);
  const isOtpVerified = await hashOtp.compareOtp(concatenatedOtp, otpDoc.otp);
  if (!isOtpVerified) {
    throw new ApiError(400, "Invalid otp");
  }

  const newAdminDoc = await adminRepository.updateById(data.newAdminsId, {
    isBlocked: false,
  });
  if (!newAdminDoc) {
    throw new ApiError(500, "Admin updation failed");
  }

  return { message: "Admin creation successfull" };
};

export default adminCreationRequestVerification;
