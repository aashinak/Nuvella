import redisClient from "../../../config/redis/redis-client";
import productRepository from "../../../repository/product/productRepository";
import logger from "../../../utils/logger";

const getRecentlyAddedProducts = async () => {
  const cacheKey = "recently_added_products"; // Cache key for Redis

  // Check if the products are already in Redis cache
  const cachedProducts = await redisClient.get(cacheKey);
  if (cachedProducts) {
    // If products are found in cache, return them
    logger.info("Fetching products from Redis cache");
    return {
      message: "Products fetched from cache",
      products: JSON.parse(cachedProducts),
    };
  }
  const products = await productRepository.sortByRecentlyAdded();
  // Cache the fetched products in Redis for future requests
  await redisClient.setex(cacheKey, 3600, JSON.stringify(products)); // Cache for 1 hour (3600 seconds)
  return { message: "Products fetched", products };
};

export default getRecentlyAddedProducts;
