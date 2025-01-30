import mongoose, { Schema, Document } from "mongoose";
import IOrder from "../../entities/order/IOrder";

// Extend Mongoose's Document interface with IOrder
type OrderDocument = IOrder & Document;

// Define the Order schema
const OrderSchema: Schema = new Schema(
  {
    customerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    orderItems: [
      {
        type: Schema.Types.ObjectId,
        ref: "OrderItem",
        required: true,
      },
    ],
    address: {
      type: Schema.Types.ObjectId,
      ref: "UserAddress",
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"],
      default: "Pending",
    },
    paymentId: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

// Create the Order model
const Order = mongoose.model<OrderDocument>("Order", OrderSchema);

export default Order;
