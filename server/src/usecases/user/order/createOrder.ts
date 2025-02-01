import crypto from "crypto";
import IOrder from "../../../entities/order/IOrder";
import orderRepository from "../../../repository/order/orderRepository";
import generateUniqueOrderId from "../../../utils/generateOrderId";
import razorpayInstance from "../../../utils/razorPayInstance";
import redisClient from "../../../config/redis/redis-client";

interface createOrderData extends IOrder {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

const createOrder = async (data: createOrderData) => {
  const sign = data.razorpay_order_id + "|" + data.razorpay_payment_id;
  const expectedSign = crypto
    .createHmac("sha256", process.env.RAZORPAY_SECRET as string)
    .update(sign.toString())
    .digest("hex");
  const isAuthentic = expectedSign === data.razorpay_signature;
  const paymentData = await razorpayInstance.payments.fetch(
    data.razorpay_payment_id
  );
  const amountPaid = (paymentData.amount as number) / 100;
  const paymentMethod = paymentData.method;
  console.log(paymentMethod);

  if (isAuthentic) {
    const orderId = generateUniqueOrderId();
    const order = await orderRepository.createOrder({
      paymentMethod,
      orderId: +orderId,
      totalAmount: +amountPaid,
      customerId: data.customerId,
      orderItems: data.orderItems,
      address: data.address,
      status: "Processing",
      paymentId: data.razorpay_payment_id,
    });
    const cacheKey1 = `orders:${data.customerId}`;
    const cacheKey2 = `cart:${data.customerId}`;
    await Promise.all([redisClient.del(cacheKey1), redisClient.del(cacheKey2)]);
    return { message: "Order placed successfully", order };
  }
  return { message: "Order couldnt placed" };
};

export default createOrder;
