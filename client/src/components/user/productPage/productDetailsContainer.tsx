import { addToCart } from "@/api/user/product/product";
import { Button } from "@/components/ui/button";
import IProduct from "@/entities/user/IProduct";
import { useToast } from "@/hooks/use-toast";
import { useUserData } from "@/store/user/hooks/useUserData";
import { IndianRupeeIcon } from "lucide-react";
import React, { useState } from "react";

interface ProductDetailsContainerProps {
  product: IProduct; // Accepting IProduct as prop
}

const ProductDetailsContainer: React.FC<ProductDetailsContainerProps> = ({
  product,
}) => {
  const { toast } = useToast();
  const { userData } = useUserData();
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const handleAddToCartClick = async () => {
    try {
      const res = await addToCart(
        userData?._id as string,
        product._id as string,
        selectedSize as string
      );
      console.log(res);
    } catch (error) {}
  };

  const handleSizeSelect = (size: string) => {
    setSelectedSize(size);
  };

  return (
    <div className="w-full md:w-1/2 flex-grow p-6 lg:p-14 rounded-lg flex flex-col gap-6">
      <h1 className="text-3xl md:text-4xl font-bold">{product.name}</h1>
      <p className="text-base text-gray-700 leading-relaxed tracking-wide w-11/12">
        {product.description}
      </p>
      <div className="flex items-center gap-2">
        <IndianRupeeIcon />
        <h2 className="text-2xl font-bold">
          {product.discountedPrice ?? product.price}
        </h2>
        <div className="flex">
          <p className="text-sm">
            MRP <s>{product.price}</s>
          </p>
        </div>
      </div>
      <div className="flex gap-2 flex-col">
        {product.stock > 0 && product.stock <= 5 ? (
          <h2 className="text-red-600">Limited stocks left</h2>
        ) : product.stock === 0 ? (
          <h2 className="text-red-600">Out of stock</h2>
        ) : null}
        {product.discountId && (
          <div className="bg-yellow-100 text-yellow-800 text-sm font-semibold px-3 py-1 rounded-full whitespace-nowrap w-fit">
            <span className="mr-2">🎉</span>{" "}
            {/* Optional: Add an emoji or icon */}
            {product.discountId.name} get upto{" "}
            {product.discountId.discount_percentage}% off
          </div>
        )}
        <h2 className="font-semibold">Select Size</h2>
        <div className="w-full flex gap-2">
          {product.sizes?.map((size, index) => (
            <div
              key={index}
              className={`py-2 px-6 rounded-md border cursor-pointer ${
                size.stock > 0
                  ? selectedSize === size.size
                    ? "bg-black text-white"
                    : ""
                  : "bg-[#d3d3d3] text-white cursor-not-allowed"
              }`}
              onClick={() => size.stock > 0 && handleSizeSelect(size.size)}
            >
              {size.size}
            </div>
          ))}
        </div>
        {selectedSize && (
          <p className="text-sm text-gray-500">
            Selected Size: <strong>{selectedSize}</strong>
          </p>
        )}
      </div>
      <div className="flex gap-2">
        <Button onClick={handleAddToCartClick} className="">
          Add to cart
        </Button>
        <Button
          onClick={() => {
            navigator.clipboard.writeText(window.location.href);
            toast({
              title: "Link copied",
            });
          }}
          variant={"outline"}
        >
          Share
        </Button>
      </div>
    </div>
  );
};

export default ProductDetailsContainer;
