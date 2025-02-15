"use client";
import React, { useCallback, useEffect, useState } from "react";
import ProductCard from "./productCard";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
// import CreateProductDialog from "./categorySection/createProductDialog";
import { useCategoryData } from "@/store/hooks/useCategoryData";
import { useAdminProductData } from "@/store/hooks/useAdminProductData";
import { getProductByCategory } from "@/api/admin/product/product";
import { Skeleton } from "@/components/ui/skeleton";
import { AnimatePresence, motion } from "framer-motion";
import CreateProductDialog from "./createProductDialog";

function Products() {
  const [isLoading, setIsLoading] = useState(true);
  // const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { categoryData } = useCategoryData();
  const { adminProductData, setAdminProduct } = useAdminProductData();

  const fetchProductData = useCallback(
    async (categoryId: string) => {
      setIsLoading(true);
      // setError(null);
      try {
        const res = await getProductByCategory(categoryId);
        setAdminProduct(res.data);
      } catch (error) {
        console.error("Error fetching products:", error);
        // setError("Failed to load products. Please try again.");
      } finally {
        setIsLoading(false);
      }
    },
    [setAdminProduct]
  );

  useEffect(() => {
    // Set default category and fetch products on initial render
    if (categoryData && categoryData.length > 0) {
      const defaultCategory = categoryData[0]._id;
      setSelectedCategory(defaultCategory);
      fetchProductData(defaultCategory);
    }
  }, [categoryData, fetchProductData]);

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
    fetchProductData(categoryId);
  };

  return (
    <div className="p-5 rounded-lg">
      <h1 className="text-2xl font-semibold tracking-wide">Products</h1>
      <div className="p-3 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium">Existing Products</h2>
          <div className="flex items-center gap-2">
            Sort By
            <Select
              value={selectedCategory || ""}
              onValueChange={(value) => handleCategoryChange(value)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Categories" />
              </SelectTrigger>
              <SelectContent>
                {categoryData && categoryData.length > 0
                  ? categoryData.map((category) => (
                      <SelectItem key={category._id} value={category._id}>
                        {category.name}
                      </SelectItem>
                    ))
                  : null}
              </SelectContent>
            </Select>
            <Button onClick={() => setIsDialogOpen(true)} className="w-32">
              Create Product
            </Button>
          </div>
          <CreateProductDialog
            isDialogOpen={isDialogOpen}
            setIsDialogOpen={setIsDialogOpen}
          />
        </div>
        {/* <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-3 gap-4"> */}
        {isLoading ? (
          <div className="w-full h-min">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              <Skeleton className="border w-full h-32 rounded-md" />
              <Skeleton className="border w-full h-32 rounded-md" />
              <Skeleton className="border w-full h-32 rounded-md" />
              <Skeleton className="border w-full h-32 rounded-md" />
            </div>
          </div>
        ) : adminProductData && adminProductData.length > 0 ? (
          <div className="rounded-lg grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5 gap-4">
            <AnimatePresence>
              {adminProductData.map((product) => (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ duration: 0.3 }}
                  layout
                >
                  <ProductCard
                    fetchProductData={() =>
                      fetchProductData(selectedCategory as string)
                    }
                    data={product}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <p className="text-gray-500 text-center mt-5">
            No products found. Create one to get started!
          </p>
        )}
        {/* </div> */}
      </div>
    </div>
  );
}

export default Products;
