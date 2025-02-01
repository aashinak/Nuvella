"use client";

import React, { useCallback, useEffect, useState } from "react";
import CategoryCard from "./categoryCard";
import { Button } from "@/components/ui/button";
import CreateCategoryDialog from "./createCategoryDialog";
import { getAllCategories } from "@/api/admin/product/product";
import ICategory from "@/entities/ICategory";
import { Skeleton } from "@/components/ui/skeleton";
import { motion, AnimatePresence } from "framer-motion";
import { useCategoryData } from "@/store/hooks/useCategoryData";

function Category() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  // const [categoryData, setCategoryData] = useState<ICategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { setCategory, categoryData } = useCategoryData();

  const fetchCategoryData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await getAllCategories();
      setCategory(res.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
      setError("Failed to load categories. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [setCategory]);

  useEffect(() => {
    fetchCategoryData();
  }, [fetchCategoryData]);

  return (
    <div className="p-5 rounded-lg">
      <h1 className="text-2xl font-semibold tracking-wide">Categories</h1>

      <div className="p-3 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium">Existing categories</h2>
          <Button onClick={() => setIsDialogOpen(true)} className="w-32">
            Create Category
          </Button>
          <CreateCategoryDialog
            isDialogOpen={isDialogOpen}
            setIsDialogOpen={setIsDialogOpen}
          />
        </div>

        {error && <p className="text-red-500">{error}</p>}

        {isLoading ? (
          <div className="w-full h-min">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              <Skeleton className="border w-full h-24 rounded-md" />
              <Skeleton className="border w-full h-24 rounded-md" />
              <Skeleton className="border w-full h-24 rounded-md" />
              <Skeleton className="border w-full h-24 rounded-md" />
            </div>
          </div>
        ) : categoryData && categoryData?.length > 0 ? (
          <div className="rounded-lg grid grid-cols-1 md:grid-cols-2  lg:grid-cols-2 xl:grid-cols-3  2xl:grid-cols-4 gap-3">
            <AnimatePresence>
              {categoryData?.map((category) => (
                <motion.div
                  key={category._id}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ duration: 0.3 }}
                  layout
                >
                  <CategoryCard data={category} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <p className="text-gray-500 text-center mt-5">
            No categories found. Create one to get started!
          </p>
        )}
      </div>
    </div>
  );
}

export default Category;
