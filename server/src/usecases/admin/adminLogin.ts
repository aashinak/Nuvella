import adminOtpRepository from "../../repository/admin/adminOtpRepository";
import adminRepository from "../../repository/admin/adminRepository";
import ApiError from "../../utils/apiError";
import generateOtp from "../../utils/generateOtp";
import hashOtp from "../../utils/hashOtp";
import hashService from "../../utils/hashService";
import emailFormat from "../../utils/otpEmailFormat";
import sendMail from "../../utils/emailService";
import logger from "../../utils/logger";

interface adminData {
  email: string;
  password: string;
}

const adminLogin = async (data: adminData) => {
  const existingAdmin = await adminRepository.findByEmail(data.email);
  if (!existingAdmin) {
    throw new ApiError(400, "Admin doesn't exists");
  }
  
  if(existingAdmin.isBlocked){
    throw new ApiError(400, "Admin blocked")
  }

  const isPasswordVerified = await hashService.comparePassword(
    data.password,
    existingAdmin.password
  );

  if (!isPasswordVerified) {
    throw new ApiError(400, "Invalid password");
  }

  const otp = generateOtp();
  const hashedOtp = await hashOtp.hashOtp(otp);

  // Prepare email content
  const htmlEmailFormat = emailFormat(
    otp,
    existingAdmin.name,
    "Admin verification"
  );
  const mail = {
    subject: "Admin Verification",
    html: htmlEmailFormat,
    to: existingAdmin.email,
  };

  const savedOtp = await adminOtpRepository.createOrUpdateOtp({
    adminId: existingAdmin._id as string,
    otpReason: "ADMIN_LOGIN",
    otp: hashedOtp,
    otpCreatedAt: new Date(),
  });

  if (!savedOtp) {
    throw new ApiError(500, "Failed to save otp");
  }

  const isEmailSent = await sendMail(mail);

  if (!isEmailSent) {
    logger.error(`Failed to send email to ${existingAdmin.email}`);
    throw new ApiError(500, "Failed to send verification email");
  }

  const sanitizedAdmin = {
    _id: existingAdmin._id,
    name: existingAdmin.name,
  };

  return { message: "Admin credentials verified", admin: sanitizedAdmin };
};

export default adminLogin
