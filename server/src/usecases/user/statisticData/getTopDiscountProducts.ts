import redisClient from "../../../config/redis/redis-client";
import productRepository from "../../../repository/product/productRepository";
import logger from "../../../utils/logger";

// Function to get most discounted products with Redis caching
const getMostDiscountedProducts = async () => {
  const cacheKey = "most_discounted_products"; // Cache key for Redis

  // Check if the discounted products are already in Redis cache
  const cachedProducts = await redisClient.get(cacheKey);

  if (cachedProducts) {
    // If products are found in cache, return them
    logger.info("Fetching discounted products from Redis cache");
    return {
      message: "Discounted products fetched from cache",
      products: JSON.parse(cachedProducts),
    };
  }

  // If not found in cache, fetch from the database
  const products = await productRepository.findMostDiscountedProducts(8);

  // Cache the fetched products in Redis for future requests
  await redisClient.setex(cacheKey, 3600, JSON.stringify(products)); // Cache for 1 hour (3600 seconds)

  logger.info("Fetching discounted products from database");
  return { message: "Discounted products fetched from database", products };
};

export default getMostDiscountedProducts;
