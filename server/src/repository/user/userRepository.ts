import IUser from "../../entities/user/IUser";
import logger from "../../utils/logger";
import ApiError from "../../utils/apiError";
import User from "../../models/user/userModel";

class UserRepository {
  // Create a user
  async createUser(userData: Partial<IUser>): Promise<IUser> {
    try {
      const user = new User(userData);
      return await user.save();
    } catch (error: any) {
      logger.error(`Error creating user: ${error.message}`, error);
      throw new ApiError(500, "Internal Server Error while creating user", [
        error.message,
      ]);
    }
  }

  // Find user by email
  async findUserByEmail(email: string): Promise<IUser | null> {
    try {
      return await User.findOne({ email });
    } catch (error: any) {
      logger.error(`Error finding user by email: ${email}`, error);
      throw new ApiError(
        500,
        "Internal Server Error while finding user by email",
        [error.message]
      );
    }
  }

  // Find user by username
  async findUserByUserName(userName: string): Promise<IUser | null> {
    try {
      return await User.findOne({ username: userName });
    } catch (error: any) {
      logger.error(`Error finding user by username: ${userName}`, error);
      throw new ApiError(
        500,
        "Internal Server Error while finding user by username",
        [error.message]
      );
    }
  }

  // Find user by ID
  async findUserById(id: string): Promise<IUser | null> {
    try {
      return await User.findById(id);
    } catch (error: any) {
      logger.error(`Error finding user by ID: ${id}`, error);
      throw new ApiError(
        500,
        "Internal Server Error while finding user by ID",
        [error.message]
      );
    }
  }

  // Update user by ID
  async updateUserById(
    id: string,
    updatedData: Partial<IUser>
  ): Promise<IUser | null> {
    try {
      return await User.findByIdAndUpdate(id, updatedData, {
        new: true,
        runValidators: true,
      });
    } catch (error: any) {
      logger.error(`Error updating user by ID: ${id}`, error);
      throw new ApiError(500, "Internal Server Error while updating user", [
        error.message,
      ]);
    }
  }

  // Delete a user by ID
  async deleteUserById(id: string): Promise<IUser | null> {
    try {
      return await User.findByIdAndDelete(id);
    } catch (error: any) {
      logger.error(`Error deleting user by ID: ${id}`, error);
      throw new ApiError(500, "Internal Server Error while deleting user", [
        error.message,
      ]);
    }
  }

  // Verify a user
  async verifyUserById(id: string): Promise<IUser | null> {
    try {
      return await User.findByIdAndUpdate(
        id,
        { isVerified: true },
        { new: true }
      );
    } catch (error: any) {
      logger.error(`Error verifying user by ID: ${id}`, error);
      throw new ApiError(500, "Internal Server Error while verifying user", [
        error.message,
      ]);
    }
  }

  // Find all users
  async findAllUsers(): Promise<IUser[]> {
    try {
      return await User.find();
    } catch (error: any) {
      logger.error("Error fetching all users", error);
      throw new ApiError(
        500,
        "Internal Server Error while fetching all users",
        [error.message]
      );
    }
  }
}

export default new UserRepository();
