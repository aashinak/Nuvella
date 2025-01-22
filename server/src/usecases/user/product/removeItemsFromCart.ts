import userCartRepository from "../../../repository/user/userCartRepository";

const removeItemsFromCart = async (userId: string, productIds: string[]) => {
  const updatedCart = await userCartRepository.removeProductsFromCart(
    userId,
    productIds
  );
  return { message: "Items removed from cart successfully", cart: updatedCart };
};

export default removeItemsFromCart;
