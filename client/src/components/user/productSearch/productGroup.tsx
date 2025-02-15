"use client";

import React from "react";
import ProductCard from "./productCard";
import { Skeleton } from "@/components/ui/skeleton";
import IProduct from "@/entities/user/IProduct";

interface ProductGroupProps {
  loading: boolean;
  products: IProduct[];
}

const ProductGroup: React.FC<ProductGroupProps> = ({ loading, products }) => {
  if (loading) {
    return (
      <div className="w-4/5 py-3 px-4 border-l flex flex-col gap-3">
        <h1 className="text-2xl font-medium mb-3">Searching...</h1>
        <div className="grid grid-cols-5 gap-6">
          {[...Array(3)].map((_, index) => (
            <Skeleton
              key={index}
              className="border rounded-lg h-96 flex flex-col"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-4/5 h-full border-l py-3 px-4">
      <h1 className="text-2xl font-medium mb-3">
        {products.length} products found{" "}
        {products.length > 0 && products[0]?.categoryId?.name
          ? `for ${products[0].categoryId.name}`
          : ""}
      </h1>
      <div className="grid grid-cols-5 gap-6">
        {products.length > 0 ? (
          products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))
        ) : (
          <div>No products found</div>
        )}
      </div>
    </div>
  );
};

export default ProductGroup;
