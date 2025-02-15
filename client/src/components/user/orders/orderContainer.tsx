"use client";
import React, { useCallback, useEffect, useState } from "react";
import OrderCard from "./orderCard";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { getOrders } from "@/api/user/product/product";
import IOrder from "@/entities/user/IOrder";

function OrderContainer() {
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = useCallback(async () => {
    try {
      const res = await getOrders();
      console.log(res);
      const data: IOrder[] = res.orders;
      setOrders(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  return (
    <div className="w-full min-h-[90vh] flex justify-center">
      <ScrollArea className="lg:w-1/2 md:w-3/4 w-full md:border h-[90vh] md:h-[85vh] rounded-lg md:mt-5 shadow-md p-6 flex flex-col overflow-y-auto">
        <h1 className="text-2xl font-semibold">Orders</h1>
        
        {loading ? (
          <div className="mt-4 space-y-4">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="flex flex-col space-y-2 p-4 border rounded-lg shadow-sm">
                <Skeleton className="h-6 w-3/4 rounded" />
                <Skeleton className="h-4 w-1/2 rounded" />
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-1/4 rounded" />
                  <Skeleton className="h-4 w-1/4 rounded" />
                </div>
                <Skeleton className="h-4 w-full rounded" />
              </div>
            ))}
          </div>
        ) : orders.length === 0 ? (
          <p className="text-center mt-4">No orders found.</p>
        ) : (
          <div className="flex flex-col mt-4 gap-2">
            {orders.map((order) => (
              <OrderCard key={order._id} order={order} />
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}

export default OrderContainer;
