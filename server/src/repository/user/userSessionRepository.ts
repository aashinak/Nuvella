import IUserSession from "../../entities/user/IUserSession";
import logger from "../../utils/logger";
import ApiError from "../../utils/apiError";
import UserSession from "../../models/user/userSessionModel";

class UserSessionRepository {
  // Create or update a user session (upsert)
  async createOrUpdateSession(
    sessionData: Partial<IUserSession>
  ): Promise<IUserSession> {
    try {
      const session = await UserSession.findOneAndUpdate(
        { userId: sessionData.userId }, // Find by userId
        { $set: sessionData }, // Update or set the session data
        { upsert: true, new: true, runValidators: true } // Upsert options
      ).populate("userId");

      return session as IUserSession;
    } catch (error: any) {
      logger.error(
        `Error creating or updating session for userId: ${sessionData.userId}`,
        error
      );
      throw new ApiError(500, "Internal Server Error while creating session", [
        error.message,
      ]);
    }
  }

  // Find a session by user ID
  async findSessionByUserId(userId: string): Promise<IUserSession | null> {
    try {
      return await UserSession.findOne({ userId });
    } catch (error: any) {
      logger.error(`Error finding session by user ID: ${userId}`, error);
      throw new ApiError(
        500,
        "Internal Server Error while finding session by user ID",
        [error.message]
      );
    }
  }

  // Find a session by refresh token
  async findSessionByRefreshToken(
    refreshToken: string
  ): Promise<IUserSession | null> {
    try {
      return await UserSession.findOne({ refreshToken });
    } catch (error: any) {
      logger.error(
        `Error finding session by refresh token: ${refreshToken}`,
        error
      );
      throw new ApiError(
        500,
        "Internal Server Error while finding session by refresh token",
        [error.message]
      );
    }
  }

  // Update a session's refresh token by user ID
  async updateSessionRefreshTokenByUserId(
    userId: string,
    refreshToken: string
  ): Promise<IUserSession | null> {
    try {
      return await UserSession.findOneAndUpdate(
        { userId },
        { refreshToken },
        { new: true, runValidators: true }
      );
    } catch (error: any) {
      logger.error(
        `Error updating session refresh token for userId: ${userId}`,
        error
      );
      throw new ApiError(
        500,
        "Internal Server Error while updating session refresh token",
        [error.message]
      );
    }
  }

  // Delete a session by user ID
  async deleteSessionByUserId(userId: string): Promise<IUserSession | null> {
    try {
      return await UserSession.findOneAndDelete({ userId });
    } catch (error: any) {
      logger.error(`Error deleting session by user ID: ${userId}`, error);
      throw new ApiError(500, "Internal Server Error while deleting session", [
        error.message,
      ]);
    }
  }

  // Delete a session by refresh token
  async deleteSessionByRefreshToken(
    refreshToken: string
  ): Promise<IUserSession | null> {
    try {
      return await UserSession.findOneAndDelete({ refreshToken });
    } catch (error: any) {
      logger.error(
        `Error deleting session by refresh token: ${refreshToken}`,
        error
      );
      throw new ApiError(
        500,
        "Internal Server Error while deleting session by refresh token",
        [error.message]
      );
    }
  }

  // Delete all sessions for a user
  async deleteAllSessionsByUserId(userId: string): Promise<void> {
    try {
      await UserSession.deleteMany({ userId });
    } catch (error: any) {
      logger.error(`Error deleting all sessions for user ID: ${userId}`, error);
      throw new ApiError(
        500,
        "Internal Server Error while deleting all sessions for user",
        [error.message]
      );
    }
  }
}

export default new UserSessionRepository();
