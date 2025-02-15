import orderRepository from "../../../../repository/order/orderRepository";
import ApiError from "../../../../utils/apiError";

const getAllOrders = async (
  pageIndex: number = 1,
  filterCondition: "today" | "month" | "year" = "today",
  monthNumber?: number, // Optional: Specify a month (1-12)
  year?: number
) => {
  const orders = await orderRepository.getAllOrdersForAdmin(
    pageIndex,
    filterCondition,
    monthNumber,
    year
  );

  return { message: "Orders fetched", orders };
};

export default getAllOrders;
