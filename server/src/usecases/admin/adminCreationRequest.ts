import adminOtpRepository from "../../repository/admin/adminOtpRepository";
import adminRepository from "../../repository/admin/adminRepository";
import ApiError from "../../utils/apiError";
import sendMail from "../../utils/emailService";
import generateOtp from "../../utils/generateOtp";
import hashOtp from "../../utils/hashOtp";
import hashService from "../../utils/hashService";
import logger from "../../utils/logger";
import emailFormat from "../../utils/otpEmailFormat";
import tokenService from "../../utils/tokenService";

interface adminCreationData {
  refreshToken: string;
  name: string;
  email: string;
  password: string;
}

const adminCreationRequest = async (data: adminCreationData) => {
  let decodedToken;
  try {
    decodedToken = await tokenService.verifyRefreshToken(data.refreshToken);
  } catch (error: any) {
    logger.warn(`Invalid or expired refresh token ::: ${error.message}`);
    throw new ApiError(401, "Invalid or expired refresh token");
  }
  if (!decodedToken) {
    throw new ApiError(400, "Invalid token");
  }

  const currentAdmin = await adminRepository.findById(decodedToken.id);
  if (!currentAdmin) {
    throw new ApiError(500, "Admin validation failed ::: vital error");
  }

  const isAdminAlreadyExists = await adminRepository.findByEmail(data.email);

  if (isAdminAlreadyExists) {
    throw new ApiError(400, "Admin already exists");
  }

  const hashedPassword = await hashService.hashPassword(data.password);

  const createdAdmin = await adminRepository.createAdmin({
    name: data.name,
    email: data.email,
    isVerified: false,
    isBlocked: true,
    password: hashedPassword,
  });
  if (!createdAdmin) {
    throw new ApiError(500, "Admin creation failed");
  }

  const otp1 = parseInt(generateOtp().toString().slice(0, 3), 10);
  const otp2 = parseInt(generateOtp().toString().slice(0, 3), 10);

  const concatenatedOtp = parseInt(`${otp1}${otp2}`, 10);

  const hashedOtp = await hashOtp.hashOtp(concatenatedOtp);

  const otpDoc = await adminOtpRepository.createOrUpdateOtp({
    otp: hashedOtp,
    otpReason: "ADD_ADMIN",
    otpCreatedAt: new Date(),
    adminId: decodedToken.id,
  });
  if (!otpDoc) {
    throw new ApiError(500, "Otp generation failed");
  }

  const htmlEmailFormat1 = emailFormat(
    otp1,
    currentAdmin.name,
    "Admin creation otp verification"
  );
  const mail1 = {
    subject: "Admin Verification",
    html: htmlEmailFormat1,
    to: data.email,
  };

  const superAdmin = process.env.SUPER_ADMIN as string;
  const superAdminEmail = process.env.SUPER_ADMIN_EMAIL as string;

  const htmlEmailFormat2 = emailFormat(
    otp2,
    superAdmin,
    "Admin creation otp verification"
  );
  const mail2 = {
    subject: "Admin Verification",
    html: htmlEmailFormat2,
    to: superAdminEmail,
  };

  const isEmail1Sent = await sendMail(mail1);
  const isEmail2Sent = await sendMail(mail2);

  if (!isEmail1Sent || !isEmail2Sent) {
    throw new ApiError(500, "Failed to sent verification emails");
  }

  const sanitizedCreatedAdmin = {
    _id: createdAdmin._id,
    name: createdAdmin.name,
    email: createdAdmin.email,
  };

  return {
    message: "Admin created and verification emails sent",
    createdAdmin: sanitizedCreatedAdmin,
  };
};

export default adminCreationRequest;
