import React from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import DeliveryAddressSection from "./addressSection";
// import IProduct from "@/entities/user/IProduct";
import IOrderItem from "@/entities/user/IOrderItem";
// import DeliveryAddressSection from "./DeliveryAddressSection";

// interface OrderItem {
//   productId: IProduct;
//   size: string;
//   quantity: number;
//   index: number;
// }

interface Props {
  setPaymentButtonActive: (active: boolean) => void;
  orderItems: IOrderItem[];
  loading: boolean;
  updateQuantity: (index: number, quantity: number) => void;
  totalPrice: number;
  // setSelectedAddressId: (address: string) => void;
}

const OrderItemsSection: React.FC<Props> = ({
  orderItems,
  loading,
  updateQuantity,
  setPaymentButtonActive,
  // setSelectedAddressId,
}) => {
  const handleDropdown = (item: IOrderItem, index: number) => {
    const stock = item.product.sizes?.find(
      (sizeItem) => sizeItem.size === item.size
    );
    if (!stock) return null;

    const maxQty = Math.min(stock.stock, 5);
    return Array.from({ length: maxQty }, (_, i) => i + 1).map((qty) => (
      <DropdownMenuItem key={qty} onClick={() => updateQuantity(index, qty)}>
        {qty}
      </DropdownMenuItem>
    ));
  };

  return (
    <div className="lg:col-span-2 flex flex-col justify-between rounded-md">
      <div className="p-4 bg-[#fcfcfc] rounded-md flex flex-col">
        {loading ? (
          <p className="text-center text-gray-500">Loading order items...</p>
        ) : (
          <>
            <DeliveryAddressSection
              setPaymentButtonActive={setPaymentButtonActive}
              // setSelectedAddressId={setSelectedAddressId}
            />
            <div>
              <h2 className="text-lg font-medium text-gray-700 mb-2">
                Order Summary
              </h2>
              <div className="border p-4 rounded-md bg-white shadow-sm">
                {orderItems.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between text-gray-800 text-sm border-b py-3 last:border-b-0"
                  >
                    <div>
                      <p>{item.product.name}</p>
                      <p className="text-gray-500 text-xs">Size: {item.size}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="sm">
                            Qty: {item.quantity}
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          {handleDropdown(item, index)}
                        </DropdownMenuContent>
                      </DropdownMenu>
                      <span>
                        ₹
                        {item.product.discountedPrice
                          ? +item.product.discountedPrice * item.quantity
                          : +item.product.price * item.quantity}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default OrderItemsSection;
