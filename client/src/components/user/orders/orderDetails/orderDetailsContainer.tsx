"use client";

import { cancelOrder, getOrder } from "@/api/user/product/product";
import { ScrollArea } from "@/components/ui/scroll-area";
import IOrder from "@/entities/user/IOrder";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader } from "lucide-react";
import getStatusBadgeColor from "@/utils/getStatusBageColor";
import OrderStatus from "@/utils/OrderStatus";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import IOrderItem from "@/entities/user/IOrderItem";
import IUserAddress from "@/entities/user/IUserAddress";
// import { useToast } from "@/components/ui/use-toast";

function OrderDetailsContainer({ orderId }: { orderId: string }) {
  const [order, setOrder] = useState<IOrder | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState<boolean>(false);
  const { toast } = useToast();

  const fetchOrderDetails = useCallback(async () => {
    if (!orderId) return;

    setIsLoading(true);
    setError(null);

    try {
      const res = await getOrder(orderId);
      const data: IOrder = res.orders;
      setOrder(data);
    } catch (err) {
      console.log(err);

      setError("Failed to fetch order details. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    fetchOrderDetails();
  }, [fetchOrderDetails]);

  const handleCancelOrder = async () => {
    try {
      const res = await cancelOrder(orderId);
      if (res.success) {
        toast({
          title: "Order Cancelled",
          description: "Your order has been cancelled successfully.",
          variant: "default",
        });
        setOrder((prevOrder) => ({
          ...prevOrder!,
          status: "Cancelled",
          refundId: res.refundId,
        }));
      } else {
        toast({
          title: "Error",
          description: "Failed to cancel order. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred. Please try again.",
        variant: "destructive",
      });
      console.log(error);
    } finally {
      setIsCancelDialogOpen(false);
    }
  };

  if (!orderId) {
    return <div>No order ID provided.</div>;
  }

  if (isLoading) {
    return (
      <div className="w-full min-h-[90vh] flex justify-center items-center">
        <Loader className="animate-spin text-gray-500" size={30} />
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  return (
    <div className="w-full h-[90vh] flex justify-center">
      <ScrollArea className="lg:w-1/2 md:w-3/4 w-full md:border h-[90vh] md:h-[85vh] rounded-lg md:mt-5 shadow-md md:p-6 p-2 flex flex-col overflow-y-auto space-y-6">
        {/* Order Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold">
            Order: <span className="text-gray-700">#{order?.orderId}</span>
          </h1>
          <Badge
            variant="outline"
            className={`text-sm px-3 py-1 ${getStatusBadgeColor(
              order?.status as OrderStatus
            )}`}
          >
            {order?.status}
          </Badge>
        </div>

        {/* Order Date */}
        <p className="text-gray-600">
          Placed on{" "}
          {new Date(order?.createdAt as string).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </p>

        {/* Refund Section */}
        {order?.refundId && (
          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-yellow-700">Refund ID: {order?.refundId}</p>
            <p className="text-yellow-700">
              Your refund has been initiated. It may take 5-7 business days to
              reflect in your account.
            </p>
          </div>
        )}

        {/* Order Items */}
        <div className="grid md:grid-cols-2 gap-4 mt-8">
          {order?.orderItems.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between border py-3 px-3 rounded-md"
            >
              <div className="flex items-center space-x-4">
                <div className="w-20 h-20 relative rounded-lg overflow-hidden">
                  <Image
                    src={
                      typeof item === "object"
                        ? item.productDetails?.images[0] || ""
                        : ""
                    }
                    alt={
                      typeof item === "object"
                        ? item.productDetails?.name || ""
                        : ""
                    }
                    layout="fill"
                    objectFit="cover"
                  />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">
                    {(item as IOrderItem).productDetails?.name}
                  </h3>
                  <p className="text-gray-500 text-sm">
                    Size: {(item as IOrderItem).size}
                  </p>
                  <p className="text-gray-500 text-sm">
                    Qty: {(item as IOrderItem).quantity}
                  </p>
                </div>
              </div>
              <p className="text-lg font-semibold">
                ₹{(item as IOrderItem).totalPrice}
              </p>
            </div>
          ))}
        </div>

        {/* Payment Details */}
        <div className="p-4 mt-4 bg-gray-50 rounded-lg shadow-sm border">
          <h2 className="text-xl font-semibold mb-3">Payment Details</h2>
          <p className="text-gray-600">
            Payment Method: {order?.paymentMethod?.toUpperCase()}
          </p>
          <p className="text-gray-600">Payment ID: {order?.paymentId}</p>
          <p className="text-lg font-semibold mt-2">
            Total Amount:{" "}
            <span className="text-green-600">₹{order?.totalAmount}</span>
          </p>
        </div>

        {/* Delivery Address */}
        <div className="p-4 bg-gray-50 mt-4 rounded-lg shadow-sm border">
          <h2 className="text-xl font-semibold mb-3">Delivery Address</h2>
          <p className="text-gray-600">
            {(order?.address as IUserAddress)?.address_line1 ||
              "No address available"}
          </p>
          <p className="text-gray-600">
            {(order?.address as IUserAddress)?.address_line2}
          </p>
          <p className="text-gray-600">
            {(order?.address as IUserAddress).city},{" "}
            {(order?.address as IUserAddress).state} -{" "}
            {(order?.address as IUserAddress).postal_code}
          </p>
          <p className="text-gray-600">
            Phone: {(order?.address as IUserAddress).phone}
          </p>
        </div>

        {/* Cancel Button */}
        <div className="flex justify-end">
          <Button
            onClick={() => setIsCancelDialogOpen(true)}
            variant="destructive"
            className="mt-4"
            disabled={order?.status !== "Processing"}
          >
            Cancel Order
          </Button>
        </div>

        {/* Cancel Order Confirmation Dialog */}
        <AlertDialog
          open={isCancelDialogOpen}
          onOpenChange={setIsCancelDialogOpen}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will cancel your order.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleCancelOrder}>
                Confirm
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </ScrollArea>
    </div>
  );
}

export default OrderDetailsContainer;
