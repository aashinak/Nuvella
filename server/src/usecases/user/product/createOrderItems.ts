import items from "razorpay/dist/types/items";
import IOrderItem from "../../../entities/order/IOrderItem";
import orderItemRepository from "../../../repository/order/orderItemRepository";
import ApiError from "../../../utils/apiError";
import productRepository from "../../../repository/product/productRepository";
import IProductDiscount from "../../../entities/product/IProductDiscount";
import crypto from "crypto";
import razorpayInstance from "../../../utils/razorPayInstance";

const createOrderItems = async (data: IOrderItem[]) => {
  // Validate input data structure if needed
  if (!Array.isArray(data) || data.length === 0) {
    throw new ApiError(
      400,
      "Invalid data: expected a non-empty array of order items."
    );
  }

  const productIds = data.map((item) => item.product);
  const productDetails = await productRepository.findByIds(productIds);

  if (!productDetails || productDetails.length !== productIds.length) {
    throw new ApiError(404, "Some products could not be found.");
  }

  // Calculate total amount
  let totalAmount = 0;

  data.forEach((orderItem) => {
    const product = productDetails.find(
      (p) => p._id?.toString() === orderItem.product
    );

    if (!product) {
      throw new ApiError(
        404,
        `Product with ID ${orderItem.product} not found.`
      );
    }
    let finalPrice: number;

    // Determine the final price
    if (
      typeof product.discountId === "object" &&
      (product.discountId as IProductDiscount).currentProductPrice
    ) {
      finalPrice = (product.discountId as IProductDiscount).currentProductPrice;
    } else {
      finalPrice = parseFloat(product.price);
    }

    // Calculate the total price for this order item
    const itemTotal = finalPrice * orderItem.quantity;
    orderItem.totalPrice = itemTotal;
    totalAmount += itemTotal;
  });

  console.log(totalAmount);
  let order;
  try {
    const options = {
      amount: Number(totalAmount * 100),
      currency: "INR",
      receipt: crypto.randomBytes(10).toString("hex"), // Corrected "reciept" to "receipt"
    };

    // Use Promises instead of callback for Razorpay's create order
    order = await new Promise((resolve, reject) => {
      razorpayInstance.orders.create(options, (error, order) => {
        if (error) {
          reject(new ApiError(500, "Something went wrong"));
        } else {
          resolve(order);
        }
      });
    });
  } catch (err) {
    console.error("Error initiating payment:", err);
    throw err; // Re-throw the error for the caller to handle
  }

  const createdOrderItems = await orderItemRepository.createOrderItems(data);
  if (!createdOrderItems) {
    throw new ApiError(500, "OrderItem creation failed");
  }
  return {
    message: "Order items succesfully created",
    items: createdOrderItems,
    totalAmount,
    order,
  };
};

export default createOrderItems;
