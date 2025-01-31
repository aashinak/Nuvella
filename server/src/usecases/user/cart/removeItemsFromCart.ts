import redisClient from "../../../config/redis/redis-client";
import userCartRepository from "../../../repository/user/userCartRepository";

const removeItemsFromCart = async (userId: string, productId: string) => {
  const updatedCart = await userCartRepository.removeFromCart(
    userId,
    productId
  );
  await redisClient.del(`cart:${userId}`);

  return { message: "Items removed from cart successfully", cart: updatedCart };
};

export default removeItemsFromCart;
