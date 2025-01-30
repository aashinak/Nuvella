import redisClient from "../../../config/redis/redis-client";
import userCartRepository from "../../../repository/user/userCartRepository";

const getAllCartItems = async (userId: string) => {
  const cachedCart = await redisClient.get(`cart:${userId}`);
  if (cachedCart) {
    return { message: "Cart fetched successfully", cart: JSON.parse(cachedCart) };
  }

  // If not cached, fetch from the database
  const cart = await userCartRepository.getCartByUserId(userId);

  // Cache the cart data with a TTL
  if (cart) {
    await redisClient.setex(`cart:${userId}`, 300, JSON.stringify(cart));
  }

  return { message: "Cart fetched successfully", cart };
};

export default getAllCartItems;
