import IUser from "../../../../entities/user/IUser";
import userRepository from "../../../../repository/user/userRepository";
import userSessionRepository from "../../../../repository/user/userSessionRepository";
import ApiError from "../../../../utils/apiError";
import auth from "../../../../utils/fireBaseProvider";
import logger from "../../../../utils/logger";
import sanitizeData from "../../../../utils/sanitizeDataInput";
import tokenService from "../../../../utils/tokenService";

async function userLoginWithGoogle(idToken: string) {
  // Decode the Google ID token to get user details
  let decodedInfo;
  try {
    // Verify the ID token
    decodedInfo = await auth.verifyIdToken(idToken);
  } catch (error: any) {
    if (
      error.code === "auth/invalid-id-token" ||
      error.message.includes("does not correspond to a known public key")
    ) {
      logger.warn(`Invalid or expired ID token: ${error.message}`);
      // You can return or throw a specific error, prompting the client to refresh the token
      throw new ApiError(
        400,
        "The token is invalid or expired, please refresh the token."
      );
    }
    // Catch any other errors that may occur
    logger.error(`Error verifying token: ${error.message}`);
    throw new Error("Failed to verify ID token.");
  }

  // Check if the user already exists in the database
  const existingUser = await userRepository.findUserByEmail(
    decodedInfo.email as string
  );

  if (existingUser) {
    // Case 1: User already exists and registered with Google
    if (existingUser.provider === "google") {
      // Generate and store access and refresh tokens
      const refreshToken = await tokenService.generateRefreshToken(
        existingUser._id as string
      );
      const accessToken = await tokenService.generateAccessToken(
        existingUser._id as string
      );

      // Update the user's refresh token in the database
      const upadtedSession = await userSessionRepository.createOrUpdateSession({
        userId: existingUser._id,
        refreshToken,
      });
      const sanitizedData = sanitizeData(existingUser, [
        "password",
        "isVerified",
        "googleId",
        "provider",
        "createdAt",
        "updatedAt",
      ]);

      // Return updated user with tokens
      return { user: sanitizedData, refreshToken, accessToken };
    }

    // Case 2: User exists but is registered with a different provider (e.g., email/password)
    logger.warn(`Login attempt for email user: ${decodedInfo.email}`);
    throw new ApiError(400, "Use your email and password to log in");
  } else {
    // Case 3: User does not exist in the system. Offer to create a new account
    logger.info(`Creating new user with Google login: ${decodedInfo.email}`);

    const newUser: IUser = {
      username: decodedInfo.email?.split("@")[0] as string,
      email: decodedInfo.email as string,
      firstname:
        decodedInfo.name || (decodedInfo.email?.split("@")[0] as string), // Default name is email if not provided
      avatar: decodedInfo.picture || "", // Default avatar if not provided
      provider: "google", // Mark user as registered with Google
      isVerified: true,
      googleId: decodedInfo.sub,
      phone: decodedInfo.phone_number,
    };

    // Save the new user in the database
    const savedUser = await userRepository.createUser(newUser);

    // Generate and store access and refresh tokens
    const refreshToken = await tokenService.generateRefreshToken(
      savedUser?._id as string
    );
    const accessToken = await tokenService.generateAccessToken(
      savedUser?._id as string
    );
    const newSession = await userSessionRepository.createOrUpdateSession({
      userId: savedUser._id,
      refreshToken,
    });

    const sanitizedData = sanitizeData(savedUser, [
      "password",
      "isVerified",
      "googleId",
      "provider",
      "createdAt",
      "updatedAt",
    ]);

    // Return the newly created user with tokens
    return { user: sanitizedData, refreshToken, accessToken };
  }
}

export default userLoginWithGoogle;
