import redisClient from "../../../../config/redis/redis-client";
import userOtpRepository from "../../../../repository/user/userOtpRepository";
import userRepository from "../../../../repository/user/userRepository";
import ApiError from "../../../../utils/apiError";
import sendMail from "../../../../utils/emailService";
import generateOtp from "../../../../utils/generateOtp";
import hashOtp from "../../../../utils/hashOtp";
import logger from "../../../../utils/logger";
import emailFormat from "../../../../utils/otpEmailFormat";

const otpResend = async (userId: string) => {
  // Validate the user's existence
  const user = await userRepository.findUserById(userId);
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  // Check if user is already verified
  if (user.isVerified) {
    throw new ApiError(400, "User already verified");
  }
  if (user.provider !== "local") {
    throw new ApiError(400, "Kindly login with google");
  }
  // Generate and hash OTP
  const otp = generateOtp();
  const hashedOtp = await hashOtp.hashOtp(otp);

  const storedOtp = await userOtpRepository.saveOtp(
    userId,
    hashedOtp,
    "USER_LOGIN"
  );
  if (!storedOtp) {
    logger.error(`Failed to store OTP for user: ${userId}`);
    throw new ApiError(500, "Failed to store OTP");
  }
  // Prepare email content
  const htmlEmailFormat = emailFormat(
    otp,
    user.username as string,
    "User verification"
  );
  const mail = {
    subject: "OTP Verification",
    html: htmlEmailFormat,
    to: user.email,
  };

  // Send verification email
  const isEmailSent = await sendMail(mail);
  if (!isEmailSent) {
    logger.error(`Failed to send OTP email to ${user.email}`);
    throw new ApiError(500, "Failed to send OTP email");
  }

  await redisClient.del(`otp:${user._id}`);
  // Store OTP and reason in Redis hash
  const otpData = {
    otp: hashedOtp,
    reason: "USER_LOGIN",
  };

  await redisClient.hset(`otp:${user._id}`, otpData);
  await redisClient.expire(`otp:${user._id}`, 180); // Expire in 3 minutes

  return { message: "OTP resent successfully" }; // Return success message
};

export default otpResend;
