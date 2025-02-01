import userSessionRepository from "../../../../repository/user/userSessionRepository";
import ApiError from "../../../../utils/apiError";
import logger from "../../../../utils/logger";
import tokenService from "../../../../utils/tokenService";

async function userLogout(refreshToken: string) {
  // Verify the provided refresh token
  let decodedToken;
  try {
    decodedToken = await tokenService.verifyRefreshToken(refreshToken);
  } catch (error: any) {
    logger.info(`Invalid or expired refresh token ::: ${error.message}`);
    throw new ApiError(401, "Invalid or expired refresh token");
  }

  logger.info(`Token verified for user ID: ${decodedToken.id}`);

  // Remove the refresh token from the user's record
  const isTokenRemoved = await userSessionRepository.deleteSessionByUserId(
    decodedToken.id
  );
  if (!isTokenRemoved) {
    logger.error(
      `Failed to remove refresh token for user ID: ${decodedToken.id}`
    );
    throw new ApiError(500, "Failed to remove refresh token");
  }

  logger.info(`User ID: ${decodedToken.id} logged out successfully`);
  return { message: "User logged out successfully" };
}

export default userLogout;
