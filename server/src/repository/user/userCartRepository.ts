import mongoose from "mongoose";
import IUserCart from "../../entities/user/IUserCart";
import UserCart from "../../models/user/userCartModel";
import ApiError from "../../utils/apiError";
import logger from "../../utils/logger";

class UserCartRepository {
  async addProductToCart(
    userId: string,
    productId: string,
    size: string
  ): Promise<IUserCart | null> {
    try {
      const cart = await UserCart.create({ userId, productId, size });
      return cart;
    } catch (error: any) {
      logger.error(
        `Failed to add product ${productId} to cart for userId ${userId}. Error: ${error.message}`
      );
      throw new ApiError(
        500,
        `Failed to add product to cart for userId ${userId}`
      );
    }
  }

  async getCartByUserId(userId: string): Promise<IUserCart[] | null> {
    try {
      const cart = await UserCart.find({ userId }).populate("productId");
      return cart;
    } catch (error: any) {
      logger.error(
        `Failed to retrieve cart for userId ${userId}. Error: ${error.message}`
      );
      throw new ApiError(500, `Failed to retrieve cart for userId ${userId}`);
    }
  }

  async removeProductFromCart(
    userId: string,
    productId: string
  ): Promise<IUserCart | null> {
    try {
      const cart = await UserCart.findOneAndUpdate(
        { userId },
        { $pull: { productId } }, // Remove the productId from the array
        { new: true }
      );
      return cart;
    } catch (error: any) {
      logger.error(
        `Failed to remove product ${productId} from cart for userId ${userId}. Error: ${error.message}`
      );
      throw new ApiError(
        500,
        `Failed to remove product from cart for userId ${userId}`
      );
    }
  }

  async removeProductsFromCart(
    userId: string,
    productIds: string[]
  ): Promise<IUserCart | null> {
    try {
      const cart = await UserCart.findOneAndUpdate(
        { userId },
        { $pull: { productId: { $in: productIds } } }, // Remove all productIds in the array
        { new: true }
      );
      return cart;
    } catch (error: any) {
      logger.error(
        `Failed to remove products ${productIds} from cart for userId ${userId}. Error: ${error.message}`
      );
      throw new ApiError(
        500,
        `Failed to remove products from cart for userId ${userId}`
      );
    }
  }

  async clearCart(userId: string): Promise<boolean> {
    try {
      const result = await UserCart.deleteOne({ userId });
      return result.deletedCount === 1;
    } catch (error: any) {
      logger.error(
        `Failed to clear cart for userId ${userId}. Error: ${error.message}`
      );
      throw new ApiError(500, `Failed to clear cart for userId ${userId}`);
    }
  }

  async findByIds(ids: string[]): Promise<IUserCart[]> {
    try {
      const objectIds = ids.map((id) => new mongoose.Types.ObjectId(id));

      return await UserCart.find({ _id: { $in: objectIds } }).populate(
        "productId"
      );
    } catch (error: any) {
      logger.error(`Error finding products by IDs: ${ids}`, {
        error: error.stack,
      });
      throw new ApiError(500, "Internal Server Error while finding products", [
        error.message,
      ]);
    }
  }
}

export default new UserCartRepository();
