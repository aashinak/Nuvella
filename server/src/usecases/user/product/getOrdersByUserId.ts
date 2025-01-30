import orderRepository from "../../../repository/order/orderRepository";

const getOrdersByUserId = async (userId: string) => {
  const orders = await orderRepository.getAllOrders(userId);
  return { message: "Orders fetched", orders };
};

export default getOrdersByUserId;
