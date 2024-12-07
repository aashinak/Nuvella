import adminRepository from "../../repository/admin/adminRepository";
import ApiError from "../../utils/apiError";
import logger from "../../utils/logger";
import tokenService from "../../utils/tokenService";

const adminRegenTokens = async (oldRefreshToken: string) => {
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

  const admin = await adminRepository.findById(decodedToken.id);
  if (!admin) {
    logger.warn(
      `Refresh token regeneration attempt for non-existing user: ${decodedToken.id}`
    );
    throw new ApiError(404, "User not found");
  }

  if (!admin.isVerified) {
    throw new ApiError(400, "Admin not verified");
  }

  if (admin.refreshToken !== oldRefreshToken) {
    logger.warn(`Mismatched refresh token for user: ${admin._id}`);
    throw new ApiError(403, "Invalid refresh token");
  }

  const refreshToken = await tokenService.generateRefreshToken(
    admin._id as string,
    "ADMIN",
    "1d"
  );
  const accessToken = await tokenService.generateAccessToken(
    admin._id as string,
    "ADMIN",
    "10m"
  );

  await adminRepository.updateById(admin._id as string, { refreshToken });

  return {
    message: "Token regeneration successfull",
    refreshToken,
    accessToken,
  };
};

export default adminRegenTokens;
