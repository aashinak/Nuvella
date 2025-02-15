import React, { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import IOrderItem from "@/entities/user/IOrderItem";
import { createOrder, createOrderItems } from "@/api/user/product/product";
import { useUserOrder } from "@/store/user/hooks/useUserOrder";
import { IExtendedOrder } from "@/entities/user/IOrder";
import { useUserData } from "@/store/user/hooks/useUserData";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation"; // Import from next/navigation

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
  }
}
interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: RazorpayResponse) => void;
  prefill: {
    name: string;
    email: string;
    contact: string;
  };
  theme: {
    color: string;
  };
}

interface RazorpayInstance {
  open: () => void;
}

interface Props {
  orderItemsData: IOrderItem[];
  totalPrice: number;
  isPaymentButtonActive: boolean;
}

interface RazorpayResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

const PaymentDetailsSection: React.FC<Props> = ({
  orderItemsData,
  totalPrice,
  isPaymentButtonActive,
}) => {
  const { orderItems, address } = useUserOrder();
  const [razorpayScriptLoaded, setRazorpayScriptLoaded] =
    useState<boolean>(false);
  const { userData } = useUserData();
  const { toast } = useToast();
  const router = useRouter(); // Initialize router

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => setRazorpayScriptLoaded(true);
    script.onerror = () => {
      console.error("Failed to load Razorpay script");
      toast({
        title: "Error",
        description: "Failed to load Razorpay. Please refresh the page.",
        variant: "destructive",
      });
    };
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, [toast]);

  const handlePaymentClick = useCallback(async () => {
    if (!razorpayScriptLoaded) {
      toast({
        title: "Error",
        description:
          "Razorpay script is not loaded yet. Please try again later.",
        variant: "destructive",
      });
      return;
    }

    try {
      const res = await createOrderItems(orderItems);
      const orderItemsId = res.items.map((item: IOrderItem) => item._id);

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID as string,
        amount: res.totalAmount,
        currency: res.paymentData.currency,
        name: "Nuvella",
        description: "Test Transaction",
        order_id: res.paymentData.id,
        handler: async (response: RazorpayResponse) => {
          const orderData: IExtendedOrder = {
            address: address ?? "",
            customerId: userData?._id ?? "",
            orderItems: orderItemsId,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          };

          const verification = await createOrder(orderData);
          console.log("Order verification response:", verification);

          toast({
            title: "Payment Successful",
            description: "Your order has been placed successfully!",
            variant: "default",
          });

          router.push("/orders"); // Navigate to /orders after success
        },
        prefill: {
          name: userData?.username ?? "",
          email: userData?.email ?? "",
          contact: userData?.phone ?? "",
        },
        theme: {
          color: "#303030",
        },
      };

      if (window.Razorpay) {
        const razorpay = new window.Razorpay(options);
        razorpay.open();
      } else {
        console.error("Razorpay is not available in the window object");
        toast({
          title: "Error",
          description: "Unable to initiate payment. Please try again later.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error during payment:", error);
      toast({
        title: "Payment Error",
        description:
          "Something went wrong during the payment process. Please try again.",
        variant: "destructive",
      });
    }
  }, [address, orderItems, razorpayScriptLoaded, toast, userData, router]);

  return (
    <div className="w-full lg:w-auto border p-4 rounded-md shadow-sm bg-gray-100">
      <h2 className="text-lg font-medium text-gray-700 mb-4">
        Payment Details
      </h2>
      <div className="flex flex-col gap-3">
        {orderItemsData.map((item, index) => (
          <div
            key={index}
            className="flex justify-between text-gray-800 text-sm border-b pb-2"
          >
            <span>
              {item.product.name} (x{item.quantity})
            </span>
            <span>
              ₹
              {item.product.discountedPrice
                ? +item.product.discountedPrice * item.quantity
                : +item.product.price * item.quantity}
            </span>
          </div>
        ))}
        <div className="flex justify-between font-semibold text-gray-900 border-t pt-2">
          <span>Total</span>
          <span>₹{totalPrice}</span>
        </div>
        <Button
          disabled={!isPaymentButtonActive}
          className="text-white mt-4 w-full"
          onClick={handlePaymentClick}
        >
          Pay Now
        </Button>
      </div>
    </div>
  );
};

export default PaymentDetailsSection;
