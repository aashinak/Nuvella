import redisClient from "../../../config/redis/redis-client";
import orderRepository from "../../../repository/order/orderRepository";

const getOrdersByUserId = async (userId: string) => {
  const cacheKey = `orders:${userId}`;
  const cachedOrders = await redisClient.get(cacheKey);
  
  if (cachedOrders) {
    return {
      message: "Orders fetched",
      orders: JSON.parse(cachedOrders),
    };
  }
  const orders = await orderRepository.getAllOrders(userId);
  await redisClient.set(cacheKey, JSON.stringify(orders), "EX", 300);

  return { message: "Orders fetched", orders };
};

export default getOrdersByUserId;
