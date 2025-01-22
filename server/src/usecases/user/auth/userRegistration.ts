import redisClient from "../../../config/redis/redis-client";
import IUser from "../../../entities/user/IUser";
import userOtpRepository from "../../../repository/user/userOtpRepository";
import userRepository from "../../../repository/user/userRepository";
import ApiError from "../../../utils/apiError";
import cleanUpAvatar from "../../../utils/avatarCleanup";
import uploadToCloudinary from "../../../utils/cloudinary";
import sendMail from "../../../utils/emailService";
import generateOtp from "../../../utils/generateOtp";
import hashOtp from "../../../utils/hashOtp";
import hashService from "../../../utils/hashService";
import logger from "../../../utils/logger";
import emailFormat from "../../../utils/otpEmailFormat";
import sanitizeData from '../../../utils/sanitizeDataInput'

const userRegistration = async (userData: Partial<IUser>) => {
  let { email, avatar, username, password, lastname, firstname, phone } =
    userData;
  const key = `user:registration:log:${email}`;
  const initUser = await redisClient.get(key);
  if (initUser) {
    if (avatar) {
      await cleanUpAvatar(avatar as string);
    }
    logger.info(`Log exists for user ${email}`);
    throw new ApiError(400, "Frequent call on registration");
  }
  const value = "User registration initiated";
  const expiration = 20;
  redisClient.set(key, value, "EX", expiration);

  const existingUserName = await userRepository.findUserByUserName(
    username as string
  );

  if (existingUserName) {
    if (avatar) {
      await cleanUpAvatar(avatar);
    }
    logger.warn(`User with username ${username} already exists`);
    throw new ApiError(400, `User with username ${username} already exists`);
  }

  // Check if user already exists
  const existingUser = await userRepository.findUserByEmail(email as string);
  if (existingUser) {
    if (avatar) {
      await cleanUpAvatar(avatar);
    }
    logger.warn(`User with email ${email} already exists`);
    throw new ApiError(400, `User with email ${email} already exists`);
  }

  // Upload avatar to Cloudinary
  let uploadedAvatar;
  if (avatar) {
    try {
      uploadedAvatar = await uploadToCloudinary(avatar, "/userAvatar");
      await cleanUpAvatar(avatar);
    } catch (error: any) {
      await cleanUpAvatar(avatar);
      logger.error(`Failed to upload avatar for ${email}: ${error.message}`);
      throw new ApiError(500, "Failed to upload avatar");
    }
  }

  avatar = uploadedAvatar;

  // Hash password
  const hashedPassword = await hashService.hashPassword(password as string);

  // Generate and hash OTP
  const otp = generateOtp();
  const hashedOtp = await hashOtp.hashOtp(otp);

  // Prepare email content
  const htmlEmailFormat = emailFormat(
    otp,
    username as string,
    "User verification"
  );
  const mail = {
    subject: "OTP Verification",
    html: htmlEmailFormat,
    to: email as string,
  };

  // Create and save new user
  const newUser: Partial<IUser> = {
    username: username?.toLowerCase(),
    email,
    avatar,
    password: hashedPassword,
    firstname,
    lastname,
    phone,
  };

  const savedUser = await userRepository.createUser(newUser);
  if (!savedUser) {
    throw new ApiError(500, "User registration failed");
  }

  // Save OTP to database
  if (savedUser._id) {
    await userOtpRepository.saveOtp(savedUser._id, hashedOtp, "USER_REGISTRATION");
  }

  // Send verification email
  const isEmailSent = await sendMail(mail);
  if (!isEmailSent) {
    logger.error(`Failed to send email to ${email}`);
    throw new ApiError(500, "Failed to send verification email");
  }

  const otpData = {
    otp: hashedOtp,
    reason: "USER_REGISTRATION",
  };

  // Store OTP and reason in Redis hash
  await redisClient.hset(`otp:${savedUser._id}`, otpData);
  await redisClient.expire(`otp:${savedUser._id}`, 180); // Expire in 3 minutes

  const sanitizedData = sanitizeData(savedUser, [
    "password",
    "isVerified",
    "googleId",
    "provider",
    "createdAt",
    "updatedAt",
  ]);

  return { message: "User data saved successfully", savedUser: sanitizedData };
};

export default userRegistration;
