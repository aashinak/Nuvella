import redisClient from "../../../config/redis/redis-client";
import userCartRepository from "../../../repository/user/userCartRepository";

const clearCart = async (userId: string) => {
  const cart = await userCartRepository.clearCart(userId);
  await redisClient.del(`cart:${userId}`);

  return { message: "Cart cleared successfully" };
};

export default clearCart;
