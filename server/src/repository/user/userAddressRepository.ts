import mongoose from "mongoose";
import IUserAddress from "../../entities/user/IUserAddress";
import UserAddress from "../../models/user/userAddressModel";
import ApiError from "../../utils/apiError";
import logger from "../../utils/logger";

class UserAddressRepository {
  async createAddress(addressData: IUserAddress): Promise<IUserAddress> {
    try {
      const address = await UserAddress.create(addressData);
      return address;
    } catch (error: any) {
      logger.error(`Failed to create address. Error: ${error.message}`, {
        addressData,
      });
      throw new ApiError(500, "Failed to create address", [error.message]);
    }
  }

  async getAddressesByUserId(userId: string): Promise<IUserAddress[]> {
    try {
      const addresses = await UserAddress.find(
        { userId },
        { userId: 0, createdAt: 0, updatedAt: 0, __v: 0 }
      );
      return addresses;
    } catch (error: any) {
      logger.error(
        `Failed to get addresses for userId ${userId}. Error: ${error.message}`
      );
      throw new ApiError(500, `Failed to fetch addresses for userId ${userId}`);
    }
  }

  async updateAddressByIds(
    userId: string,
    addressId: string,
    updates: Partial<IUserAddress>
  ): Promise<IUserAddress | null> {
    try {
      const updatedAddress = await UserAddress.findOneAndUpdate(
        {
          _id: addressId,
          userId: userId,
        },
        updates,
        { new: true, runValidators: true }
      );
      return updatedAddress;
    } catch (error: any) {
      logger.error(
        `Failed to update address ${addressId}. Error: ${error.message}`,
        { updates }
      );
      throw new ApiError(500, `Failed to update address ${addressId}`);
    }
  }

  async deleteAddressById(addressId: string, userId: string): Promise<boolean> {
    try {
      const result = await UserAddress.findOneAndDelete({
        _id: addressId,
        userId: userId,
      });
      return result !== null;
    } catch (error: any) {
      logger.error(
        `Failed to delete address ${addressId}. Error: ${error.message}`
      );
      throw new ApiError(500, `Failed to delete address ${addressId}`);
    }
  }

  async deleteAddressesByUserId(userId: string): Promise<boolean> {
    try {
      const result = await UserAddress.deleteMany({ userId });
      return result.deletedCount > 0;
    } catch (error: any) {
      logger.error(
        `Failed to delete addresses for userId ${userId}. Error: ${error.message}`
      );
      throw new ApiError(
        500,
        `Failed to delete addresses for userId ${userId}`
      );
    }
  }

  async getAddressById(addressId: string): Promise<IUserAddress | null> {
    try {
      const address = await UserAddress.findById(addressId);
      return address;
    } catch (error: any) {
      logger.error(
        `Failed to get address ${addressId}. Error: ${error.message}`
      );
      throw new ApiError(500, `Failed to get address ${addressId}`);
    }
  }
}

export default new UserAddressRepository();
