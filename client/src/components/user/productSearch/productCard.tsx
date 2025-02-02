import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import IProduct from "@/entities/user/IProduct";
import { IndianRupeeIcon } from "lucide-react";
import Image from "next/image";
import React from "react";
import { useRouter } from "next/navigation";

interface ProductCardProps {
  product: IProduct;
}

function ProductCard({ product }: ProductCardProps) {
  const router = useRouter();
  const handleProductClick = () => {
    router.push(`/product/${product._id}`);
  };
  return (
    <motion.div
      onClick={handleProductClick}
      className="border shadow-sm rounded-lg h-72 flex flex-col cursor-pointer will-change-transform"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileTap={{ scale: 0.98 }} // Apply scaling effect only on click
    >
      {/* Wrap Image and Card Container in a motion.div to isolate scaling */}
      <motion.div
        className="w-full h-4/6 rounded-t-lg overflow-hidden"
        whileTap={{ scale: 0.98 }}
      >
        <Image
          width={2000}
          height={2000}
          alt="prodImg"
          className="w-full h-full object-cover"
          src={product.images[0]}
        />
      </motion.div>

      <div className="p-2 flex flex-col gap-2">
        <p className=" font-semibold antialiased">{product.name}</p>
        <div className="flex items-center">
          <IndianRupeeIcon className="h-5" />
          <p className="text-2xl font-bold">
            {product.discountId
              ? product.discountId.currentProductPrice
              : product.price}
          </p>
          <div>
            <p className="text-sm ml-2">
              MRP <s>{product.price}</s>
            </p>
          </div>
        </div>
        {/* <Button className="">Add to cart</Button> */}
      </div>
    </motion.div>
  );
}

export default ProductCard;
