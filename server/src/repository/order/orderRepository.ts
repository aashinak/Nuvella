import Order from "../../models/order/orderModel";
import IOrder from "../../entities/order/IOrder";
import logger from "../../utils/logger";
import ApiError from "../../utils/apiError";
import productRepository from "../product/productRepository";
import orderItemRepository from "./orderItemRepository";
import mongoose from "mongoose";
import { startOfDay, startOfMonth, startOfYear } from "date-fns";

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

  async getAllOrdersForAdmin(
    pageIndex: number = 1,
    filterCondition: "today" | "month" | "year" = "today",
    monthNumber?: number, // Optional: Specify a month (1-12)
    year?: number // Optional: Specify a year (default: current year)
  ): Promise<IOrder[]> {
    try {
      const now = new Date();
      const selectedYear = year || now.getFullYear(); // Default to current year
      let dateFilter = {};

      if (filterCondition === "today") {
        // Orders created today
        dateFilter = { createdAt: { $gte: startOfDay(now) } };
      } else if (filterCondition === "month") {
        if (monthNumber) {
          // Orders for a specific month in a specific year
          dateFilter = {
            $expr: {
              $and: [
                { $eq: [{ $year: "$createdAt" }, selectedYear] }, // Given year
                { $eq: [{ $month: "$createdAt" }, monthNumber] }, // Given month
              ],
            },
          };
        } else {
          // Orders for the current month in the selected year
          dateFilter = {
            $expr: {
              $and: [
                { $eq: [{ $year: "$createdAt" }, selectedYear] }, // Selected year
                { $eq: [{ $month: "$createdAt" }, now.getMonth() + 1] }, // Current month
              ],
            },
          };
        }
      } else if (filterCondition === "year") {
        // Orders for a specific year
        dateFilter = {
          $expr: {
            $eq: [{ $year: "$createdAt" }, selectedYear],
          },
        };
      }

      const orders = await Order.aggregate([
        { $match: dateFilter }, // Apply date filter
        { $sort: { createdAt: -1 } }, // Sort by latest created first
        { $skip: (pageIndex - 1) * 10 },
        { $limit: 10 },

        // Lookup address details
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
        { $addFields: { address: { $arrayElemAt: ["$address", 0] } } },

        // Lookup order items
        {
          $lookup: {
            from: "orderitems",
            localField: "orderItems",
            foreignField: "_id",
            as: "orderItems",
          },
        },
        { $unwind: "$orderItems" },

        // Lookup product details
        {
          $lookup: {
            from: "products",
            localField: "orderItems.product",
            foreignField: "_id",
            as: "orderItems.productDetails",
          },
        },

        // Lookup customer details
        {
          $lookup: {
            from: "users",
            localField: "customerId",
            foreignField: "_id",
            as: "customerDetails",
          },
        },
        {
          $addFields: {
            customerDetails: { $arrayElemAt: ["$customerDetails", 0] },
          },
        },

        // Group order items back into an array
        {
          $group: {
            _id: "$_id",
            orderId: { $first: "$orderId" },
            paymentMethod: { $first: "$paymentMethod" },
            customerId: { $first: "$customerId" },
            customerDetails: { $first: "$customerDetails" },
            orderItems: { $push: "$orderItems" },
            address: { $first: "$address" },
            status: { $first: "$status" },
            paymentId: { $first: "$paymentId" },
            totalAmount: { $first: "$totalAmount" },
            createdAt: { $first: "$createdAt" },
            updatedAt: { $first: "$updatedAt" },
          },
        },
      ]);

      return orders;
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

  async findMostSoldProducts(): Promise<IOrder[] | null> {
    try {
      const products = await Order.aggregate([
        {
          $unwind: {
            path: "$orderItems",
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
          },
        },
        {
          $group: {
            _id: "$orderItems.product",
            totalSold: {
              $sum: "$orderItems.quantity",
            },
          },
        },
        {
          $sort: {
            totalSold: -1,
          },
        },
        {
          $limit: 8,
        },
        {
          $lookup: {
            from: "products",
            localField: "_id",
            foreignField: "_id",
            as: "product",
          },
        },
        {
          $unwind: {
            path: "$product",
          },
        },
        {
          $lookup: {
            from: "productdiscounts",
            localField: "product.discountId",
            foreignField: "_id",
            as: "product.discountDetails",
          },
        },
        {
          $addFields: {
            "product.discountDetails": {
              $arrayElemAt: ["$product.discountDetails", 0],
            },
          },
        },
        {
          $replaceRoot: { newRoot: "$product" }, // Makes "product" the top-level document
        },
      ]);

      return products || null;
    } catch (error: any) {
      logger.error(`Error fetching products`);
      throw new ApiError(500, "Failed to fetch products", [error.message]);
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
