"use client";
import React, { useEffect, useState, useCallback, useMemo } from "react";
import FilterPanel from "./filterPanel";
import ProductGroup from "./productGroup";
import { usePathname, useSearchParams } from "next/navigation";
import IProduct from "@/entities/user/IProduct";
import {
  getProductByCategory,
  searchProductsByKeyword,
} from "@/api/user/product/product";

function SearchContainer() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [products, setProducts] = useState<IProduct[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [type, searchItem] = pathname?.split("/").slice(-2);

  // Extract filter values from URL
  const inStock = searchParams.get("inStock") === "true";
  const minPrice = Number(searchParams.get("minPrice")) || 0;
  const maxPrice = Number(searchParams.get("maxPrice")) || 5000;
  const sizes = useMemo(() => {
    return searchParams.get("sizes")?.split(",") || [];
  }, [searchParams]);


  // Fetch products (memoized)
  const fetchProducts = useCallback(async () => {
    if (!type || !searchItem) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      let res;
      if (type === "category" && searchItem) {
        res = await getProductByCategory(searchItem);
        setProducts(res.data);
      } else if (type === "keyword" && searchItem) {
        res = await searchProductsByKeyword(searchItem);
        setProducts(res.products);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  }, [type, searchItem]);

  // Local filtering function (memoized)
  const handleFilterChange = useCallback(() => {
    let updatedProducts = products;

    // Filter by in-stock status if enabled
    if (inStock) {
      updatedProducts = updatedProducts.filter((product) => product.stock > 0);
    }

    // (Optional) Add price and sizes filtering if needed:
    updatedProducts = updatedProducts.filter(
      (product) => +product.price >= minPrice && +product.price <= maxPrice
    );
    if (sizes.length) {
      updatedProducts = updatedProducts.filter((product) =>
        sizes.some((size) => product.sizes.some(s => s.size === size))
      );
    }

    setFilteredProducts(updatedProducts);
  }, [inStock, maxPrice, minPrice, products, sizes]);

  // Fetch products when type or searchItem changes
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Run local filter whenever products or filter criteria change
  useEffect(() => {
    handleFilterChange();
  }, [products, inStock, minPrice, maxPrice, sizes, handleFilterChange]);

  return (
    <div className="w-full min-h-[90vh] flex">
      <FilterPanel products={products} />
      <ProductGroup loading={loading} products={filteredProducts} />
    </div>
  );
}

export default SearchContainer;
