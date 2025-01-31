import userRepository from "../../../../repository/user/userRepository";
import userSessionRepository from "../../../../repository/user/userSessionRepository";
import ApiError from "../../../../utils/apiError";
import logger from "../../../../utils/logger";
import sanitizeData from "../../../../utils/sanitizeDataInput";
import tokenService from "../../../../utils/tokenService";

const userTokenRegeneration = async (oldRefreshToken: string) => {
  let decodedToken;
  try {
    decodedToken = await tokenService.verifyRefreshToken(oldRefreshToken);
  } catch (error: any) {
    logger.warn(`Invalid or expired refresh token ::: ${error.message}`);
    throw new ApiError(401, "Invalid or expired refresh token");
  }

  if (!decodedToken.id) {
    throw new ApiError(400, "Invalid refresh token");
  }

  const user = await userRepository.findUserById(decodedToken.id);
  if (!user) {
    logger.warn(
      `Access token regeneration attempt for non-existing user: ${decodedToken.id}`
    );
    throw new ApiError(404, "User not found");
  }

  if (!user.isVerified) {
    throw new ApiError(400, "User not verified");
  }

  const userSession = await userSessionRepository.findSessionByUserId(
    user._id as string
  );

  if (userSession?.refreshToken !== oldRefreshToken) {
    logger.info(`Mismatched refresh token for user: ${user._id}`);
    throw new ApiError(403, "Invalid refresh token");
  }

  const accessToken = await tokenService.generateAccessToken(
    user._id as string
  );

  const sanitizedData = sanitizeData(user, [
    "password",
    "isVerified",
    "googleId",
    "provider",
    "createdAt",
    "updatedAt",
  ]);

  return {
    message: "Token regeneration successfull",
    user: sanitizedData,
    accessToken,
  };
};

export default userTokenRegeneration;
