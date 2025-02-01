import IProduct from "@/entities/IProduct";
import Image from "next/image";
import React from "react";

interface ProductCardProps {
  data: IProduct;
}
const ProductCard: React.FC<ProductCardProps> = ({ data }) => {
  return (
    <div className="px-3 cursor-pointer py-2 border rounded-md flex items-center justify-between gap-4 hover:bg-[#f9f9f9] bg-[#f5f5f5] transition-all delay-300 ">
      <div className="flex  flex-col gap-3 w-full">
        <div className="relative w-full h-48">
          <Image
            className=" object-cover rounded-sm"
            layout="fill" // This makes the image fill the container
            alt="categoryImage"
            src={data.images[0]}
          />
        </div>

        <p className="font-semibold">{data.name}</p>
      </div>
      {/* <div className="flex gap-4 h-full justify-center items-center">
        <Edit className="text-[#707070]" />
        <Trash2 className="text-red-600" />
      </div> */}
    </div>
  );
};

export default ProductCard;
