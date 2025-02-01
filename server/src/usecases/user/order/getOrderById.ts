import redisClient from "../../../config/redis/redis-client";
import orderRepository from "../../../repository/order/orderRepository";
import ApiError from "../../../utils/apiError";

const getOrderById = async (orderId: string, userId: string) => {
  const cacheKey = `order:${userId}:${orderId}`; // Unique cache key for each order & user

  // 🔹 Check if order exists in Redis cache
  const cachedOrder = await redisClient.get(cacheKey);
  if (cachedOrder) {
    return {
      message: "Order fetched successfully",
      order: JSON.parse(cachedOrder),
    };
  }

  // 🔹 Fetch from DB if not in cache
  const order = await orderRepository.getOrderByIdAggregate(orderId, userId);
  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  // 🔹 Store in Redis with expiration (e.g., 5 minute)
  await redisClient.set(cacheKey, JSON.stringify(order), "EX", 300);

  return { message: "Order fetched successfully", order };
};

export default getOrderById;
