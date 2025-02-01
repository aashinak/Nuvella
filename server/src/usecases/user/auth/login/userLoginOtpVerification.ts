import redisClient from "../../../../config/redis/redis-client";
import userOtpRepository from "../../../../repository/user/userOtpRepository";
import userRepository from "../../../../repository/user/userRepository";
import userSessionRepository from "../../../../repository/user/userSessionRepository";
import ApiError from "../../../../utils/apiError";
import hashOtp from "../../../../utils/hashOtp";
import logger from "../../../../utils/logger";
import sanitizeData from "../../../../utils/sanitizeDataInput";
import tokenService from "../../../../utils/tokenService";

const userLoginOtpVerification = async (otp: number, userId: string) => {
  const user = await userRepository.findUserById(userId);
  if (!user || !user.isVerified) {
    logger.info(`Otp verification attempt for non existing user: ${userId}`);
    throw new ApiError(404, "User not found");
  }

  // Retrieve OTP and reason (from Redis or fallback to DB)
  const otpData = await redisClient.hgetall(`otp:${user._id}`);

  let storedOtp, reason;

  if (otpData?.otp && otpData?.reason) {
    // If both OTP and reason are available in Redis
    storedOtp = otpData.otp;
    reason = otpData.reason;
  } else {
    // Fetch from database if not available in Redis
    const dbOtpData = await userOtpRepository.findOtpByUserId(userId);
    storedOtp = dbOtpData?.otp;
    reason = dbOtpData?.otpReason;
  }

  if (!storedOtp || !reason) {
    logger.info(`OTP not found for userId: ${userId}`);
    throw new ApiError(404, "OTP not found");
  }

  if (reason !== "USER_LOGIN") {
    logger.info(`Invalid OTP reason for userId: ${userId}`);
    throw new ApiError(400, "Invalid OTP");
  }

  // Verify OTP
  const isOtpVerified = await hashOtp.compareOtp(otp, storedOtp);
  if (!isOtpVerified) {
    logger.warn(`Invalid OTP provided for userId: ${userId}`);
    throw new ApiError(400, "Invalid OTP");
  }
  // Clean up OTP from Redis or database
  await redisClient.del(`otp:${user._id}`);
  await userOtpRepository.deleteOtp(userId);

  // const updatedUser = await userRepository.verifyUserById(userId);
  // if (!updatedUser) {
  //   logger.error(`Failed to update verification status for user: ${userId}`);
  //   throw new ApiError(500, "User verification update failed");
  // }
  // Create and store access and refresh tokens
  const refreshToken = await tokenService.generateRefreshToken(
    user._id as string
  );
  const accessToken = await tokenService.generateAccessToken(
    user._id as string
  );

  // Update user with the new refresh token
  const updatedSession = await userSessionRepository.createOrUpdateSession({
    userId: user._id,
    refreshToken,
  });

  if (!updatedSession) {
    logger.error("Failed to create tokens");
    throw new ApiError(500, "Failed to create tokens");
  }
  const sanitizedData = sanitizeData(user, [
    "password",
    "isVerified",
    "googleId",
    "provider",
    "createdAt",
    "updatedAt",
  ]);

  logger.info(`User verification successful for user: ${userId}`);
  return {
    message: "OTP verification successful",
    user: sanitizedData,
    tokens: { accessToken, refreshToken },
  };
};

export default userLoginOtpVerification;
