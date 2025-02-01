import redisClient from "../../../config/redis/redis-client";
import orderRepository from "../../../repository/order/orderRepository";
import logger from "../../../utils/logger";

const topSellingProducts = async () => {
  const cacheKey = "most_sold_products";
  const cachedProducts = await redisClient.get(cacheKey);
  if (cachedProducts) {
    // If products are found in cache, return them
    logger.info("Fetching most sold products from Redis cache");
    return {
      message: "Discounted products fetched",
      products: JSON.parse(cachedProducts),
    };
  }
  const products = await orderRepository.findMostSoldProducts();
  console.log(products);
  
  await redisClient.setex(cacheKey, 3600, JSON.stringify(products));

  return { message: "top selling products fetched from database", products };
};

export default topSellingProducts;
