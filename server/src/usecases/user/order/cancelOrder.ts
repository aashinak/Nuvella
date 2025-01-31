import redisClient from "../../../config/redis/redis-client";
import orderItemRepository from "../../../repository/order/orderItemRepository";
import orderRepository from "../../../repository/order/orderRepository";
import productRepository from "../../../repository/product/productRepository";
import ApiError from "../../../utils/apiError";
import razorpayInstance from "../../../utils/razorPayInstance";

enum OrderStatus {
  CANCELLED = "Cancelled",
  DELIVERED = "Delivered",
}

const cancelOrder = async (orderId: string, userId: string) => {
  const order = await orderRepository.getOrderById(orderId, userId);
  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  if (
    [OrderStatus.CANCELLED, OrderStatus.DELIVERED].includes(
      order.status as OrderStatus
    )
  ) {
    throw new ApiError(400, `Order already ${order.status?.toLowerCase()}`);
  }

  await orderRepository.updateOrder(orderId, { status: OrderStatus.CANCELLED });

  const orderItems = await orderItemRepository.getOrderItemsByIds(
    order.orderItems
  );

  orderItems.forEach(async (item) => {
    await productRepository.increaseStock(
      item.product,
      item.size as string,
      item.quantity
    );
  });

  const refund = await razorpayInstance.payments.refund(
    order.paymentId as string,
    {
      amount: order.totalAmount * 100,
    }
  );

  await orderRepository.updateOrder(orderId, { refundId: refund.id });

  const cacheKey1 = `order:${userId}:${orderId}`;
  const cacheKey2 = `orders:${userId}`;
  const cacheKey3 = `cart:${userId}`;

  await Promise.all([
    redisClient.del(cacheKey1),
    redisClient.del(cacheKey2),
    redisClient.del(cacheKey3),
  ]);

  return { message: "Order cancelled successfully", refundId: refund.id };
};

export default cancelOrder;
