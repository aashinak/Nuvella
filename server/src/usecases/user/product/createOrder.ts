import crypto from "crypto";
import IOrder from "../../../entities/order/IOrder";
import orderRepository from "../../../repository/order/orderRepository";

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
  if (isAuthentic) {
    const order = await orderRepository.createOrder({
      customerId: data.customerId,
      orderItems: data.orderItems,
      address: data.address,
      status: "Processing",
      paymentId: data.razorpay_payment_id,
    });
    return { message: "Order placed successfully", order };
  }
  return { message: "Order couldnt placed" };
};

export default createOrder;
