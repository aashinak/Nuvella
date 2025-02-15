import IOrder from "@/entities/user/IOrder";
import getStatusBadgeColor from "@/utils/getStatusBageColor";
import OrderStatus from "@/utils/OrderStatus";
import { Calendar, Package } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";



interface OrderCardProps {
  order: IOrder;
}

function OrderCard({ order }: OrderCardProps) {
  

// Determine badge color based on order status
// const getStatusBadgeColor = (status: OrderStatus) => {
  
//   switch (status) {
//     case OrderStatus.Pending:
//       return "bg-yellow-100 text-yellow-700";
//     case OrderStatus.Processing:
//       return "bg-blue-100 text-blue-700";
//     case OrderStatus.Shipped:
//       return "bg-purple-100 text-purple-700";
//     case OrderStatus.Delivered:
//       return "bg-green-100 text-green-700";
//     case OrderStatus.Cancelled:
//       return "bg-red-100 text-red-700";
//     default:
//       return "bg-gray-100 text-blue-700";
//   }
// };



  // Format MongoDB date string to a user-friendly format
  const router = useRouter();
  const formattedDate = order.createdAt
    ? new Date(order.createdAt).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "Date not available";


  const handleCardClick = () => {
    router.push(`/orders/${order._id}`);
  };

  return (
    <div
      onClick={handleCardClick}
      className="w-full rounded-lg border border-gray-200 p-4 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow duration-200 bg-white hover:bg-gray-50"
    >
      {/* Order ID and Status */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Package className="h-5 w-5 text-blue-500" />
          <h3 className="font-semibold text-base sm:text-lg text-gray-800">
            Order #{order.orderId}
          </h3>
        </div>
        <span
          className={`text-xs sm:text-sm font-medium px-2.5 py-1 rounded-full ${getStatusBadgeColor(
            order.status as OrderStatus
          )}`}
        >
          {order.status}
        </span>
      </div>

      {/* Date and Total Amount */}
      <div className="flex justify-between items-center mt-2">
        <div className="flex items-center space-x-2">
          <Calendar className="h-4 w-4 text-gray-500" />
          <p className="text-xs sm:text-sm text-gray-600">{formattedDate}</p>
        </div>
        <div className="flex items-center space-x-1">
          <span className="text-xs sm:text-sm text-gray-700">₹</span>
          <p className="text-xs sm:text-sm font-medium text-gray-900">
            {order.totalAmount}
          </p>
        </div>
      </div>

      {/* Additional Details (if needed) */}
      <div className="flex justify-between items-center mt-2">
        <p className="text-xs sm:text-sm text-gray-500">
          Items: {order.orderItems.length || 0}
        </p>
        <p className="text-xs sm:text-sm text-gray-500">
          Payment: {order.paymentMethod}
        </p>
      </div>
    </div>
  );
}

export default OrderCard;
