import redisClient from "../../../config/redis/redis-client";
import userOtpRepository from "../../../repository/user/userOtpRepository";
import userRepository from "../../../repository/user/userRepository";
import ApiError from "../../../utils/apiError";
import sendMail from "../../../utils/emailService";
import generateOtp from "../../../utils/generateOtp";
import hashOtp from "../../../utils/hashOtp";
import logger from "../../../utils/logger";
import emailFormat from "../../../utils/otpEmailFormat";

async function userForgotPasswordRequest(email: string) {
  // Step 1: Check if the user exists
  const user = await userRepository.findUserByEmail(email);
  if (!user) {
    logger.warn(`Password reset attempt for non-existing user: ${email}`);
    throw new ApiError(404, "User not found");
  }
  if (!user.isVerified) {
    logger.warn(`Password reset attempt for non-verified user: ${email}`);
    throw new ApiError(400, "User not verified");
  }
  if (user.provider !== "local") {
    logger.warn(`Password reset attempt for google user: ${email}`);
    throw new ApiError(400, "Kindly select signin with google option");
  }

  // Step 2: Generate and hash the OTP
  const otp = generateOtp(); // Generate an OTP or a reset token
  const hashedOtp = await hashOtp.hashOtp(otp);

  // Step 3: Store OTP in the database
  const storedOtp = await userOtpRepository.saveOtp(
    user._id as string,
    hashedOtp,
    "PASSWORD_RESET"
  ); // Associate OTP with email
  if (!storedOtp) {
    logger.error(`Failed to store OTP for email: ${email}`);
    throw new ApiError(500, "Failed to store OTP");
  }

  // Step 4: Prepare the email content
  const htmlEmailFormat = emailFormat(
    otp,
    user.username,
    "Password reset request"
  ); // Use forgot password email format
  const mail = {
    subject: "Password Reset Request",
    html: htmlEmailFormat,
    to: user.email,
  };

  // Step 5: Send the email with reset instructions
  const isEmailSent = await sendMail(mail);
  if (!isEmailSent) {
    logger.error(`Failed to send password reset email to: ${email}`);
    throw new ApiError(500, "Failed to send password reset email");
  }

  const otpData = {
    otp: hashedOtp,
    reason: "PASSWORD_RESET",
  };

  // Store OTP and reason in Redis hash
  await redisClient.hset(`otp:${user._id}`, otpData);
  await redisClient.expire(`otp:${user._id}`, 180); // Expire in 3 minutes

  logger.info(`Password reset instructions sent successfully to: ${email}`);
  return { message: "Password reset instructions sent successfully" };
}

export default userForgotPasswordRequest;
