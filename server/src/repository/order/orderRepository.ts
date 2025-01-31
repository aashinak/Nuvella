import Order from "../../models/order/orderModel";
import IOrder from "../../entities/order/IOrder";
import logger from "../../utils/logger";
import ApiError from "../../utils/apiError";
import productRepository from "../product/productRepository";
import orderItemRepository from "./orderItemRepository";
import mongoose from "mongoose";

class OrderRepository {
  /**
   * Create a new order
   * @param orderData Data to create a new order
   */
  async createOrder(orderData: IOrder): Promise<IOrder> {
    const session = await Order.startSession();
    session.startTransaction(); // Start a transaction for consistency

    try {
      // Fetch the order items from the database
      const orderItems = await orderItemRepository.getOrderItemsByIds(
        orderData.orderItems
      );

      // Ensure all order items exist in the database
      if (orderItems.length !== orderData.orderItems.length) {
        throw new ApiError(404, "Some order items were not found.");
      }

      const productUpdates = [];

      for (const item of orderItems) {
        const { product, size, quantity } = item;

        // Decrease stock for each product
        const updatedProduct = await productRepository.decreaseStock(
          product,
          size as string,
          quantity
        );
        productUpdates.push(updatedProduct);
      }

      // Create the order after successful stock updates
      const order = new Order(orderData);
      const savedOrder = await order.save({ session });

      await session.commitTransaction(); // Commit the transaction
      session.endSession();

      return savedOrder;
    } catch (error: any) {
      await session.abortTransaction(); // Rollback transaction in case of error
      session.endSession();

      logger.error("Error creating order: ", error);

      // Optional: Add rollback logic to revert stock changes if needed
      throw new ApiError(500, "Failed to create order", [error.message]);
    }
  }

  /**
   * Fetch all orders
   */
  async getAllOrders(customerId: string): Promise<IOrder[]> {
    try {
      return await Order.find({ customerId })
        .select("-customerId -address -updatedAt -paymentId -__v")
        .sort({ createdAt: -1 });
    } catch (error: any) {
      logger.error("Error fetching all orders: ", error);
      throw new ApiError(500, "Failed to fetch orders", [error.message]);
    }
  }

  /**
   * Fetch a single order by ID
   */

  async getOrderByIdAggregate(
    id: string,
    customerId: string
  ): Promise<IOrder | null> {
    try {
      const orders = await Order.aggregate([
        {
          $match: {
            _id: new mongoose.Types.ObjectId(id),
            customerId: new mongoose.Types.ObjectId(customerId),
          },
        },
        {
          $lookup: {
            from: "useraddresses",
            localField: "address",
            foreignField: "_id",
            as: "address",
            pipeline: [
              {
                $project: {
                  __v: 0,
                  createdAt: 0,
                  updatedAt: 0,
                  userId: 0,
                },
              },
            ],
          },
        },
        {
          $addFields: {
            address: { $arrayElemAt: ["$address", 0] },
          },
        },
        {
          $lookup: {
            from: "orderitems",
            localField: "orderItems",
            foreignField: "_id",
            as: "orderItems",
          },
        },
        {
          $unwind: {
            path: "$orderItems",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "products",
            localField: "orderItems.product",
            foreignField: "_id",
            as: "orderItems.productDetails",
          },
        },
        {
          $unwind: {
            path: "$orderItems.productDetails",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $group: {
            _id: "$_id",
            orderId: { $first: "$orderId" },
            paymentMethod: { $first: "$paymentMethod" },
            customerId: { $first: "$customerId" },
            orderItems: { $push: "$orderItems" },
            address: { $first: "$address" },
            status: { $first: "$status" },
            paymentId: { $first: "$paymentId" },
            totalAmount: { $first: "$totalAmount" },
            refundId: { $first: "$refundId" },
            createdAt: { $first: "$createdAt" },
            updatedAt: { $first: "$updatedAt" },
          },
        },
      ]);

      return orders[0] || null;
    } catch (error: any) {
      logger.error(`Error fetching order by ID: ${id}`, error);
      throw new ApiError(500, "Failed to fetch order by ID", [error.message]);
    }
  }

  async fetchOrder(orderId: string, customerId: string) {
    const order = await Order.findOne({
      _id: orderId,
      customerId: customerId,
    })
      .populate({
        path: "address",
        select: "-__v -createdAt -updatedAt -userId", // Exclude unnecessary fields
      })
      .populate({
        path: "orderItems",
        populate: {
          path: "product", // Populate product details for each orderItem
        },
      });

    return order;
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

  async getOrderById(id: string, userId: string): Promise<IOrder | null> {
    try {
      return await Order.findOne({ _id: id, customerId: userId });
    } catch (error: any) {
      logger.error(`Error fetching order by ID: ${id}`, error);
      throw new ApiError(500, "Failed to fetch order", [error.message]);
    }
  }
}

export default new OrderRepository();
