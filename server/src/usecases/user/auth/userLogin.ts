import IUser from "../../../entities/user/IUser";
import userOtpRepository from "../../../repository/user/userOtpRepository";
import userRepository from "../../../repository/user/userRepository";
import userSessionRepository from "../../../repository/user/userSessionRepository";
import ApiError from "../../../utils/apiError";
import sendMail from "../../../utils/emailService";
import generateOtp from "../../../utils/generateOtp";
import hashOtp from "../../../utils/hashOtp";
import hashService from "../../../utils/hashService";
import logger from "../../../utils/logger";
import emailFormat from "../../../utils/otpEmailFormat";
import sanitizeData from "../../../utils/sanitizeDataInput";
import tokenService from "../../../utils/tokenService";

const userLogin = async (email: string, password: string) => {
  // Check if the user exists
  const existingUser = await userRepository.findUserByEmail(email);
  if (!existingUser) {
    throw new ApiError(404, "User doesn't exist");
  }

  // Check if the user is verified
  if (!existingUser.isVerified) {
    // Generate and hash OTP
    const otp = generateOtp();
    const hashedOtp = await hashOtp.hashOtp(otp);

    // Prepare email content
    const htmlEmailFormat = emailFormat(
      otp,
      existingUser.username as string,
      "User verification"
    );
    const mail = {
      subject: "OTP Verification",
      html: htmlEmailFormat,
      to: email as string,
    };
    await userOtpRepository.saveOtp(
      existingUser._id as string,
      hashedOtp,
      "USER_REGISTRATION"
    );
    const isEmailSent = await sendMail(mail);
    throw new ApiError(400, "User not verified", undefined, {
      userId: existingUser._id,
    });
  }

  // Ensure the user is using email/password login
  if (existingUser.provider !== "local") {
    throw new ApiError(400, "Please sign in with Google");
  }

  // Verify the password
  const isPasswordVerified = await hashService.comparePassword(
    password,
    existingUser.password as string
  );

  if (!isPasswordVerified) {
    throw new ApiError(400, "Invalid password");
  }

  // Create and store access and refresh tokens
  const refreshToken = await tokenService.generateRefreshToken(
    existingUser._id as string
  );
  const accessToken = await tokenService.generateAccessToken(
    existingUser._id as string
  );

  // Update user with the new refresh token
  const updatedSession = await userSessionRepository.createOrUpdateSession({
    userId: existingUser._id,
    refreshToken,
  });
  if (!updatedSession) {
    logger.error("Failed to create tokens");
    throw new ApiError(500, "Failed to create tokens");
  }

  const sanitizedData: Partial<IUser | null> = sanitizeData(existingUser, [
    "password",
    "isVerified",
    "googleId",
    "provider",
    "createdAt",
    "updatedAt",
  ]);

  // Return user and tokens
  return {
    message: "User logged in",
    user: sanitizedData,
    tokens: {
      accessToken,
      refreshToken,
    },
  };
};

export default userLogin;
