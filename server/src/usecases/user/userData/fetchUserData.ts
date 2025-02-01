import userRepository from "../../../repository/user/userRepository";
import ApiError from "../../../utils/apiError";
import sanitizeData from "../../../utils/sanitizeDataInput";

const fetchUserData = async (userId: string) => {
  const user = await userRepository.findUserById(userId);
  if (!user) {
    throw new ApiError(404, "User doesn't exists");
  }
  const sanitizedUser = sanitizeData(user, [
    "createdAt",
    "googleId",
    "isVerified",
    "password",
    "provider",
    "updatedAt",
  ]);
  return { message: "User details fetched", user: sanitizedUser };
};
export default fetchUserData;
