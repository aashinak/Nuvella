"use client";

import React, { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import ProductCard from "./productCard";
import {
  getProductByCategory,
  searchProductsByKeyword,
} from "@/api/user/product/product";
import IProduct from "@/entities/user/IProduct";
import { Skeleton } from "@/components/ui/skeleton";

function ProductGroup() {
  const pathname = usePathname(); // Gets the current path
  const searchParams = useSearchParams(); // Access query params
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true); // Default to true until data is loaded
  const [type, searchItem] = pathname?.split("/").slice(-2); // Extract dynamic segments

  useEffect(() => {
    if (!type || !searchItem) {
      setLoading(false);
      return; // Don't fetch if params are not available
    }

    const fetchProducts = async () => {
      setLoading(true);

      try {
        // Adjust the fetch logic depending on `type` and `searchItem`
        let res;

        if (type === "category" && searchItem) {
          res = await getProductByCategory(searchItem);
          setProducts(res.data);
        } else if (type === "keyword" && searchItem) {
          res = await searchProductsByKeyword(searchItem);

          setProducts(res.products);
        }

        if (res?.data) {
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [type, searchItem]); // Run effect whenever `type` or `searchItem` changes

  if (loading) {
    return (
      <div className="w-4/5 py-3 px-4 border-l flex flex-col  gap-3">
        <h1 className="text-2xl font-medium mb-3">Searching...</h1>
        <div className="grid grid-cols-5 gap-6">
          <Skeleton className="border  rounded-lg h-96 flex flex-col" />
          <Skeleton className="border  rounded-lg h-96 flex flex-col" />
          <Skeleton className="border  rounded-lg h-96 flex flex-col" />
        </div>
      </div>
    );
  }

  return (
    <div className="w-4/5 h-full border-l py-3 px-4">
      <div>
        <h1 className="text-2xl font-medium mb-3">
          {products.length} products found{" "}
          {products[0] ? `for ${products[0]?.categoryId.name}` : ""}
        </h1>
        <div className="grid grid-cols-5 gap-6">
          {products.length > 0 ? (
            products.map((product, index) => (
              <ProductCard key={index} product={product} />
            ))
          ) : (
            <div>No products found</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductGroup;
