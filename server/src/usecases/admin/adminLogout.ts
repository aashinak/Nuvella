import adminRepository from "../../repository/admin/adminRepository";
import ApiError from "../../utils/apiError";
import logger from "../../utils/logger";
import tokenService from "../../utils/tokenService";

const adminLogout = async (refreshToken: string) => {
  let decodedToken;
  try {
    decodedToken = await tokenService.verifyRefreshToken(refreshToken);
  } catch (error: any) {
    logger.warn(`Invalid or expired refresh token ::: ${error.message}`);
    throw new ApiError(401, "Invalid or expired refresh token");
  }

  // Remove the refresh token from the admin's record
  const isTokenRemoved = await adminRepository.removeRefreshToken(
    decodedToken.id
  );
  if (!isTokenRemoved) {
    logger.error(
      `Failed to remove refresh token for user ID: ${decodedToken.id}`
    );
    throw new ApiError(500, "Failed to remove refresh token");
  }

  return { message: "User logged out successfully" };
};

export default adminLogout;
