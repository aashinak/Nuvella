import userCartRepository from "../../../repository/user/userCartRepository";

const clearCart = async (userId: string) => {
  const cart = await userCartRepository.clearCart(userId);
  return { message: "Cart cleared successfully" };
};

export default clearCart;
