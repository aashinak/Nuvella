import Order from "../../models/order/orderModel";
import IOrder from "../../entities/order/IOrder";
import logger from "../../utils/logger";
import ApiError from "../../utils/apiError";

class OrderRepository {
  /**
   * Create a new order
   * @param orderData Data to create a new order
   */
  async createOrder(orderData: IOrder): Promise<IOrder> {
    try {
      const order = new Order(orderData);
      return await order.save();
    } catch (error: any) {
      logger.error("Error creating order: ", error);
      throw new ApiError(500, "Failed to create order", [error.message]);
    }
  }

  /**
   * Fetch all orders
   */
  async getAllOrders(): Promise<IOrder[]> {
    try {
      return await Order.find().populate("orderItems").populate("customerId");
    } catch (error: any) {
      logger.error("Error fetching all orders: ", error);
      throw new ApiError(500, "Failed to fetch orders", [error.message]);
    }
  }

  /**
   * Fetch a single order by ID
   */
  async getOrderById(id: string): Promise<IOrder | null> {
    try {
      return await Order.findById(id)
        .populate("orderItems")
        .populate("customerId");
    } catch (error: any) {
      logger.error(`Error fetching order by ID: ${id}`, error);
      throw new ApiError(500, "Failed to fetch order by ID", [error.message]);
    }
  }

  /**
   * Update an order by its ID
   */
  async updateOrder(
    id: string,
    updateData: Partial<IOrder>
  ): Promise<IOrder | null> {
    try {
      return await Order.findByIdAndUpdate(id, updateData, { new: true });
    } catch (error: any) {
      logger.error(`Error updating order by ID: ${id}`, error);
      throw new ApiError(500, "Failed to update order", [error.message]);
    }
  }

  /**
   * Delete an order by its ID
   */
  async deleteOrder(id: string): Promise<IOrder | null> {
    try {
      return await Order.findByIdAndDelete(id);
    } catch (error: any) {
      logger.error(`Error deleting order by ID: ${id}`, error);
      throw new ApiError(500, "Failed to delete order", [error.message]);
    }
  }
}

export default new OrderRepository();
