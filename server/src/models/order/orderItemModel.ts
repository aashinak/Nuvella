import mongoose, { Schema, Document } from "mongoose";
import IOrderItem from "../../entities/order/IOrderItem";

// Extend Mongoose's Document interface with IOrderItem
type OrderItemDocument = IOrderItem & Document;

// Define the OrderItem schema
const OrderItemSchema: Schema = new Schema(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: [1, "Quantity must be at least 1."],
    },
    size: {
      type: String,
      required: true,
      enum: ["S", "M", "L", "XL", "2XL"],
      default: null,
    },
    totalPrice: {
      type: Number,
      required: true,
    }
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

// Create the OrderItem model
const OrderItem = mongoose.model<OrderItemDocument>(
  "OrderItem",
  OrderItemSchema
);

export default OrderItem;
