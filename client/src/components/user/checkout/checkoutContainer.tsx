"use client";

import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useUserCheckoutData } from "@/store/user/hooks/useUserCheckoutData";
import { getCheckoutItemsByIds } from "@/api/user/product/product";
import OrderItemsSection from "./orderSection";
import PaymentDetailsSection from "./paymentSection";
import { useUserOrder } from "@/store/user/hooks/useUserOrder";
import IOrderItem from "@/entities/user/IOrderItem";

function CheckoutContainer() {
  const { resetOrder, addOrderItems } = useUserOrder();
  const { checkoutItems } = useUserCheckoutData();
  const [orderItems, setOrderItems] = useState<IOrderItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [isPaymentButtonActive, setPaymentButtonActive] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState("");

  // Fetch order items based on checkout items
  const fetchOrderItems = useCallback(async () => {
    if (!checkoutItems?.length) return;

    setLoading(true);
    try {
      const res = await getCheckoutItemsByIds(checkoutItems);
      const updatedData = res.data.map(
        (item: { productId: any; size: string }) => ({
          product: item.productId,
          size: item.size,
          quantity: 1,
        })
      );
      setOrderItems(updatedData);
    } catch (error) {
      console.error("Error fetching order items:", error);
    } finally {
      setLoading(false);
    }
  }, [checkoutItems]);

  // Initialize order data on mount
  useEffect(() => {
    resetOrder(); // Clear previous order
    fetchOrderItems(); // Fetch new order items
  }, [resetOrder, fetchOrderItems]);

  // Sync orderItems with global state
  useEffect(() => {
    if (orderItems.length > 0) {
      addOrderItems(
        orderItems.map((item) => ({
          ...item,
          product: item.product._id as string,
        }))
      );
    }
  }, [addOrderItems, orderItems]);

  // Update quantity for a specific order item
  const updateQuantity = useCallback((index: number, quantity: number) => {
    setOrderItems((prevItems) =>
      prevItems.map((item, i) => (i === index ? { ...item, quantity } : item))
    );
  }, []);

  // Calculate total price
  const totalPrice = useMemo(
    () =>
      orderItems.reduce(
        (acc, item) =>
          acc +
          (item.product.discountedPrice
            ? +item.product.discountedPrice * item.quantity
            : +item.product.price * item.quantity),
        0
      ),
    [orderItems]
  );

  return (
    <div className="w-full flex-grow flex justify-center md:p-4 bg-gray-50 relative">
      <div className="w-full max-w-6xl flex flex-col border md:rounded-lg md:px-6 p-4 md:py-6 gap-6 shadow-lg bg-white overflow-y-auto">
        <h1 className="text-2xl font-semibold text-gray-800">Checkout</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <OrderItemsSection
            setSelectedAddressId={setSelectedAddressId}
            setPaymentButtonActive={setPaymentButtonActive}
            orderItems={orderItems}
            loading={loading}
            updateQuantity={updateQuantity}
            totalPrice={totalPrice}
          />
          <PaymentDetailsSection
            isPaymentButtonActive={isPaymentButtonActive}
            orderItemsData={orderItems}
            totalPrice={totalPrice}
          />
        </div>
      </div>
    </div>
  );
}

export default React.memo(CheckoutContainer);
