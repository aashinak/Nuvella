import IUser from "../../../entities/user/IUser";
import userRepository from "../../../repository/user/userRepository";
import ApiError from "../../../utils/apiError";
import cleanUpAvatar from "../../../utils/avatarCleanup";
import uploadToCloudinary from "../../../utils/cloudinary";
import logger from "../../../utils/logger";
import sanitizeData from "../../../utils/sanitizeDataInput";

const updateUserData = async (userId: string, updateData: Partial<IUser>) => {
  let { avatar } = updateData;
  const user = await userRepository.findUserById(userId);
  if (!user) {
    await cleanUpAvatar(avatar as string);
    throw new ApiError(400, "User doesn't exist");
  }

  // Upload avatar to Cloudinary
  let uploadedAvatar;
  if (avatar) {
    try {
      uploadedAvatar = await uploadToCloudinary(avatar, "/userAvatar");
      await cleanUpAvatar(avatar);
    } catch (error: any) {
      await cleanUpAvatar(avatar);
      logger.error(`Failed to upload avatar for ${userId}: ${error.message}`);
      throw new ApiError(500, "Failed to upload avatar");
    }
  }

  avatar = uploadedAvatar;

  const updatedUser = await userRepository.updateUserById(userId, {
    ...updateData,
    avatar,
  });

  const sanitizedUser = sanitizeData(updatedUser, [
    "createdAt",
    "googleId",
    "isVerified",
    "password",
    "provider",
    "updatedAt",
  ]);
  return { message: "User updated successfully", user: sanitizedUser };
};
export default updateUserData;
