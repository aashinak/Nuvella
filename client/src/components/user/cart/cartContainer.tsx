"use client";
import {
  clearCart,
  getAllCartItems,
  removeCartItem,
} from "@/api/user/product/product";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import ICart from "@/entities/user/ICart";
import IProduct from "@/entities/user/IProduct";
import { useToast } from "@/hooks/use-toast";
import { useUserCheckoutData } from "@/store/user/hooks/useUserCheckoutData";
import { useUserData } from "@/store/user/hooks/useUserData";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

function CartContainer() {
  const { clearCheckout, setCheckout } = useUserCheckoutData();
  const router = useRouter();
  const { userData } = useUserData();
  const [cartData, setCartData] = useState<ICart[]>([]);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const { toast } = useToast();

  const fetchCartItems = useCallback(async () => {
    try {
      const res = await getAllCartItems(userData?._id as string);
      setCartData(res.data);
    } catch (error) {
      console.error("Error fetching cart items", error);
    }
  }, [userData?._id]);

  useEffect(() => {
    fetchCartItems();
  }, [fetchCartItems]);

  const handleCheckboxChange = (id: string, isChecked: boolean) => {
    setSelectedItems((prev) =>
      isChecked ? [...prev, id] : prev.filter((item) => item !== id)
    );
  };

  const handleRemoveItem = async (id: string) => {
    try {
      await removeCartItem(id);
      setCartData((prev) => prev.filter((item) => item._id !== id));
      toast({
        title: "Item Removed",
        description: "The item has been successfully removed from your cart.",
      });
    } catch (error) {
      console.error("Error removing item from cart", error);
      toast({
        title: "Error",
        description: "Failed to remove item from cart. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleEmptyCart = async () => {
    try {
      await clearCart();
      setCartData([]);
      setSelectedItems([]);
      toast({ title: "Cart Cleared", description: "Your cart is now empty." });
    } catch (error) {
      console.error("Error clearing cart", error);
      toast({
        title: "Error",
        description: "Failed to clear the cart. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleCheckoutButtonClick = async () => {
    const id = await uuidv4();
    clearCheckout();
    setCheckout(id, selectedItems);
    router.push(`/checkout/${id}`);
  };

  const isSizeInStock = (
    cart: ICart,
    selectedSize: IProduct["sizes"][number]["size"]
  ): boolean => {
    const sizeData = cart.productId.sizes?.find(
      (size: IProduct["sizes"][number]) => size.size === selectedSize
    );
    return sizeData ? sizeData.stock > 0 : false;
  };

  return (
    <div className="w-full flex-grow flex flex-col gap-2 items-center md:mt-5">
      <ScrollArea className="md:border h-[80vh] md:h-[75vh] w-full xl:w-1/2 overflow-y-auto rounded-lg p-6 shadow">
        <h1 className="text-2xl font-semibold">Your Cart</h1>
        {cartData.length === 0 ? (
          <div className="text-center text-gray-500 mt-10">
            <p className="text-lg">Your cart is currently empty.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-2 mt-4">
            {cartData.map((cart, index) => {
              const outOfStock = !isSizeInStock(cart, cart.size);
              return (
                <div
                  key={index}
                  className={`border px-4 py-3 rounded-md flex items-center gap-2 ${
                    outOfStock ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  <Checkbox
                    disabled={outOfStock}
                    onCheckedChange={(isChecked) =>
                      handleCheckboxChange(
                        cart._id as string,
                        isChecked as boolean
                      )
                    }
                  />
                  <div className="w-14 h-14 border rounded-lg relative">
                    <Image
                      priority
                      fill
                      className="object-cover rounded-sm w-14 h-14"
                      sizes="56px"
                      alt="Product Image"
                      src={cart.productId.images[0]}
                    />
                  </div>
                  <div className="flex flex-col flex-grow">
                    <p
                      onClick={() =>
                        router.push(`/product/${cart.productId._id}`)
                      }
                      className="font-semibold text-sm md:text-lg hover:underline hover:cursor-pointer"
                    >
                      {cart.productId.name}
                    </p>
                    <p className="text-sm text-gray-600">
                      Selected Size: {cart.size}
                    </p>
                  </div>
                  <p
                    className={`${
                      outOfStock ? "text-red-500" : "hidden"
                    }`}
                  >
                    Out of stock
                  </p>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleRemoveItem(cart._id as string)}
                  >
                    Remove
                  </Button>
                </div>
              );
            })}
          </div>
        )}
      </ScrollArea>
      <div className="w-full h-[10vh] fixed xl:bottom-3 bottom-0 xl:w-1/2 p-4 border rounded-lg flex items-center justify-between shadow-lg bg-white">
        <Button
          variant="destructive"
          disabled={cartData.length === 0}
          onClick={handleEmptyCart}
        >
          Empty Cart
        </Button>
        <Button
          className="p-6"
          disabled={selectedItems.length === 0}
          onClick={handleCheckoutButtonClick}
        >
          Proceed to Checkout
        </Button>
      </div>
    </div>
  );
}

export default CartContainer;
