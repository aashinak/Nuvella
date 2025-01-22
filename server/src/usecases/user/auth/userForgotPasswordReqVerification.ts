import redisClient from "../../../config/redis/redis-client";
import userOtpRepository from "../../../repository/user/userOtpRepository";
import userRepository from "../../../repository/user/userRepository";
import userSessionRepository from "../../../repository/user/userSessionRepository";
import ApiError from "../../../utils/apiError";
import hashOtp from "../../../utils/hashOtp";
import hashService from "../../../utils/hashService";
import logger from "../../../utils/logger";

async function userForgotPasswordRequestVerification(
  otp: number,
  email: string,
  password: string
) {
  const user = await userRepository.findUserByEmail(email);
  if (!user) {
    logger.warn(`Password reset attempt for non-existing user: ${email}`);
    throw new ApiError(404, "User not found");
  }
  if (!user.isVerified) {
    logger.warn(`Password reset attempt for non-verified user: ${email}`);
    throw new ApiError(400, "User not verified");
  }

  // Retrieve OTP and reason (Redis first, then fallback to database)
  const otpData = await redisClient.hgetall(`otp:${user._id}`);
  const storedOtp =
    otpData?.otp ||
    (await userOtpRepository.findOtpByUserId(user._id as string))?.otp;
  const reason =
    otpData?.reason ||
    (await userOtpRepository.findOtpByUserId(user._id as string))?.otpReason;

  if (!storedOtp || !reason) {
    logger.warn(`OTP not found for email ${email}`);
    throw new ApiError(404, "OTP not found");
  }

  if (reason !== "PASSWORD_RESET") {
    logger.warn(`Invalid OTP reason for email: ${email}`);
    throw new ApiError(400, "Invalid OTP");
  }

  // Verify OTP
  const isOtpVerified = await hashOtp.compareOtp(otp, storedOtp);
  if (!isOtpVerified) {
    logger.warn(`Invalid OTP provided for email: ${email}`);
    throw new ApiError(400, "Invalid OTP");
  }

  // Clean up OTP from Redis or database
  await redisClient.del(`otp:${user._id}`);
  await userOtpRepository.deleteOtp(user._id as string);

  // Remove existing refreshToken
  await userSessionRepository.deleteSessionByUserId(user._id as string);

  // Hash the new password and update it
  const hashedNewPassword = await hashService.hashPassword(password);
  await userRepository.updateUserById(user._id as string, {
    password: hashedNewPassword,
  });

  logger.info(`Password updated successfully for email: ${email}`);
  return { message: "OTP verification and password recovery successful" };
}

export default userForgotPasswordRequestVerification;
