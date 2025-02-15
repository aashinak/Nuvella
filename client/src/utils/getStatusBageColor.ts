import OrderStatus from "./OrderStatus";

// Determine badge color based on order status
const getStatusBadgeColor = (status: OrderStatus) => {
  
  switch (status) {
    case OrderStatus.Pending:
      return "bg-yellow-100 text-yellow-700";
    case OrderStatus.Processing:
      return "bg-blue-100 text-blue-700";
    case OrderStatus.Shipped:
      return "bg-purple-100 text-purple-700";
    case OrderStatus.Delivered:
      return "bg-green-100 text-green-700";
    case OrderStatus.Cancelled:
      return "bg-red-100 text-red-700";
    default:
      return "bg-gray-100 text-blue-700";
  }
};

export default getStatusBadgeColor;
