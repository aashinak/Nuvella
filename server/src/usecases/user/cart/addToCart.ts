import redisClient from "../../../config/redis/redis-client";
import userCartRepository from "../../../repository/user/userCartRepository";

const addToCart = async (userId: string, productId: string, size: string) => {
  const updatedCart = await userCartRepository.addToCart({
    productId,
    userId,
    size,
  });
  await redisClient.del(`cart:${userId}`);

  return { message: "Item added to cart successfully", cart: updatedCart };
};

export default addToCart;
