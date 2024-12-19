import OrderItem from "../../models/order/orderItemModel";
import IOrderItem from "../../entities/order/IOrderItem";
import logger from "../../utils/logger";
import ApiError from "../../utils/apiError";

class OrderItemRepository {
  /**
   * Create a new order item
   * @param itemData Order item data
   */
  async createOrderItem(
    itemData: IOrderItem
  ): Promise<IOrderItem> {
    try {
      const orderItem = new OrderItem(itemData);
      return await orderItem.save();
    } catch (error: any) {
      logger.error("Error creating order item: ", error);
      throw new ApiError(500, "Failed to create order item", [
        error.message,
      ]);
    }
  }

  /**
   * Get all order items
   */
  async getAllOrderItems(): Promise<IOrderItem[]> {
    try {
      return await OrderItem.find();
    } catch (error: any) {
      logger.error("Error fetching all order items: ", error);
      throw new ApiError(500, "Failed to fetch order items", [
        error.message,
      ]);
    }
  }

  /**
   * Get an order item by its ID
   */
  async getOrderItemById(
    id: string
  ): Promise<IOrderItem | null> {
    try {
      return await OrderItem.findById(id);
    } catch (error: any) {
      logger.error(`Error fetching order item by ID: ${id}`, error);
      throw new ApiError(500, "Failed to fetch order item by ID", [
        error.message,
      ]);
    }
  }

  /**
   * Update an order item by ID
   */
  async updateOrderItem(
    id: string,
    updateData: Partial<IOrderItem>
  ): Promise<IOrderItem | null> {
    try {
      return await OrderItem.findByIdAndUpdate(id, updateData, {
        new: true,
      });
    } catch (error: any) {
      logger.error(`Error updating order item by ID: ${id}`, error);
      throw new ApiError(500, "Failed to update order item", [
        error.message,
      ]);
    }
  }

  /**
   * Delete an order item by ID
   */
  async deleteOrderItem(
    id: string
  ): Promise<IOrderItem | null> {
    try {
      return await OrderItem.findByIdAndDelete(id);
    } catch (error: any) {
      logger.error(`Error deleting order item by ID: ${id}`, error);
      throw new ApiError(500, "Failed to delete order item", [
        error.message,
      ]);
    }
  }
}

export default new OrderItemRepository();
