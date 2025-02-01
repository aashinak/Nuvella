import UserCart from "../../models/user/userCartModel";
import IUserCart from "../../entities/user/IUserCart";
import logger from "../../utils/logger";
import ApiError from "../../utils/apiError";

class UserCartRepository {
  // Add product to cart
  async addToCart(cartData: Partial<IUserCart>): Promise<IUserCart> {
    try {
      const cartItem = new UserCart(cartData);
      return await cartItem.save();
    } catch (error: any) {
      logger.error(`Error adding product to cart: ${error.message}`, error);
      throw new ApiError(500, "Internal Server Error while adding to cart", [
        error.message,
      ]);
    }
  }

  // Get all cart items for a user
  async getCartByUserId(userId: string): Promise<IUserCart[]> {
    try {
      return await UserCart.find({ userId }).populate("productId");
    } catch (error: any) {
      logger.error(
        `Error fetching cart for user ${userId}: ${error.message}`,
        error
      );
      throw new ApiError(500, "Internal Server Error while fetching cart", [
        error.message,
      ]);
    }
  }

  // Remove a product from cart
  async removeFromCart(
    userId: string,
    cartId: string
  ): Promise<IUserCart | null> {
    try {
      const cartItem = await UserCart.findOneAndDelete({ _id: cartId, userId });

      if (!cartItem) {
        throw new ApiError(404, "Cart item not found or unauthorized");
      }

      return cartItem;
    } catch (error: any) {
      logger.error(`Error removing product from cart: ${error.message}`, error);
      throw new ApiError(
        500,
        "Internal Server Error while removing from cart",
        [error.message]
      );
    }
  }

  // Update cart item (e.g., change size)
  async updateCartItem(
    cartId: string,
    updatedData: Partial<IUserCart>
  ): Promise<IUserCart | null> {
    try {
      return await UserCart.findByIdAndUpdate(cartId, updatedData, {
        new: true,
        runValidators: true,
      });
    } catch (error: any) {
      logger.error(`Error updating cart item: ${error.message}`, error);
      throw new ApiError(500, "Internal Server Error while updating cart", [
        error.message,
      ]);
    }
  }

  // Clear all cart items for a user
  async clearCart(userId: string): Promise<void> {
    try {
      await UserCart.deleteMany({ userId });
    } catch (error: any) {
      logger.error(
        `Error clearing cart for user ${userId}: ${error.message}`,
        error
      );
      throw new ApiError(500, "Internal Server Error while clearing cart", [
        error.message,
      ]);
    }
  }

  // Find multiple cart items by their IDs
  async findByIds(cartIds: string[]): Promise<IUserCart[]> {
    try {
      return await UserCart.find({ _id: { $in: cartIds } }).populate("productId");
    } catch (error: any) {
      logger.error(
        `Error fetching cart items by IDs: ${cartIds.join(", ")}: ${error.message}`,
        error
      );
      throw new ApiError(500, "Internal Server Error while fetching cart items", [
        error.message,
      ]);
    }
  }
}

export default new UserCartRepository();
