import Admin from "../../models/admin/adminModel";
import IAdmin from "../../entities/admin/IAdmin";
import logger from "../../utils/logger";
import ApiError from "../../utils/apiError";

class AdminRepository {
  // Create an admin
  async createAdmin(adminData: IAdmin): Promise<IAdmin> {
    try {
      const admin = new Admin(adminData);
      return await admin.save();
    } catch (error: any) {
      logger.error(`Error creating admin: ${error.message}`, error);
      throw new ApiError(500, "Internal Server Error while creating admin", [
        error.message,
      ]);
    }
  }

  // Find admin by email
  async findByEmail(email: string): Promise<IAdmin | null> {
    try {
      return await Admin.findOne({ email }); // Removed .exec()
    } catch (error: any) {
      logger.error(`Error finding admin by email: ${email}`, error);
      throw new ApiError(
        500,
        "Internal Server Error while finding admin by email",
        [error.message]
      );
    }
  }

  // Find admin by ID
  async findById(id: string): Promise<IAdmin | null> {
    try {
      return await Admin.findById(id); // Removed .exec()
    } catch (error: any) {
      logger.error(`Error finding admin by ID: ${id}`, error);
      throw new ApiError(
        500,
        "Internal Server Error while finding admin by ID",
        [error.message]
      );
    }
  }

  // Update admin by ID
  async updateById(
    id: string,
    updatedData: Partial<IAdmin>
  ): Promise<IAdmin | null> {
    try {
      return await Admin.findByIdAndUpdate(id, updatedData, {
        new: true,
      });
    } catch (error: any) {
      logger.error(`Error updating admin by ID: ${id}`, error);
      throw new ApiError(500, "Internal Server Error while updating admin", [
        error.message,
      ]);
    }
  }

  // Delete an admin by ID
  async deleteById(id: string): Promise<IAdmin | null> {
    try {
      return await Admin.findByIdAndDelete(id); // Removed .exec()
    } catch (error: any) {
      logger.error(`Error deleting admin by ID: ${id}`, error);
      throw new ApiError(500, "Internal Server Error while deleting admin", [
        error.message,
      ]);
    }
  }

  // Find all admins (optional)
  async findAll(): Promise<IAdmin[]> {
    try {
      return await Admin.find(); // Removed .exec()
    } catch (error: any) {
      logger.error("Error finding all admins", error);
      throw new ApiError(
        500,
        "Internal Server Error while finding all admins",
        [error.message]
      );
    }
  }

  async removeRefreshToken(adminId: string): Promise<IAdmin | null> {
    try {
      const updatedUser = await Admin.findByIdAndUpdate(
        adminId,
        { $unset: { refreshToken: 1 }, $set: { isVerified: false } },
        { new: true }
      ).exec();
      if (!updatedUser) {
        throw new ApiError(404, `User not found with ID ${adminId}`);
      }
      logger.info(`Refresh token removed for user with ID ${adminId}`);
      return updatedUser;
    } catch (error: any) {
      logger.error(
        `Failed to remove refreshToken for user with ID ${adminId}: ${error.message}`
      );
      throw new ApiError(500, "Failed to remove refresh token");
    }
  }
}

export default new AdminRepository();
