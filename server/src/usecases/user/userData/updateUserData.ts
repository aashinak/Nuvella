import IUser from "../../../entities/user/IUser";
import userRepository from "../../../repository/user/userRepository";
import ApiError from "../../../utils/apiError";
import sanitizeData from "../../../utils/sanitizeDataInput";

const updateUserData = async (userId: string, updateData: Partial<IUser>) => {
  const user = await userRepository.findUserById(userId);
  if (!user) {
    throw new ApiError(400, "User doesn't exist");
  }
  if (updateData.username) {
    const isUserNameAlreadyExists = await userRepository.findUserByUserName(
      updateData.username
    );
    if (isUserNameAlreadyExists) {
      throw new ApiError(400, "Username already exists");
    }
  }
  const updatedUser = await userRepository.updateUserById(userId, updateData);
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
