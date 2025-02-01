import { getCategories } from "@/api/user/product/product";
import { motion } from "framer-motion";
import CategoryCards from "./categoryCards";
import { Skeleton } from "@/components/ui/skeleton";
import ICategory from "@/entities/user/ICategory";
import { useUserCategoryData } from "@/store/user/hooks/useUserCategoryData";
import React, { useCallback, useEffect, useState } from "react";

function CategorySection() {
  const [isLoading, setIsLoading] = useState(true);
  const { setCategory, userCategoryData } = useUserCategoryData();

  const fetchCategories = useCallback(async () => {
    setIsLoading(true); // Start loading when fetching begins
    try {
      const { data }: { data: ICategory[] } = await getCategories();

      setCategory(data); // Dispatch to Redux state
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false); // Stop loading after fetching
    }
  }, [setCategory]);

  useEffect(() => {
    // Only fetch categories if not available in Redux state
    if (!userCategoryData || userCategoryData.length === 0) {
      fetchCategories();
    } else {
      setIsLoading(false); // If categories are already available, stop loading
    }
  }, [fetchCategories, userCategoryData]);

  const renderSkeletons = () => (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-6 gap-6">
      {Array.from({ length: 6 }).map((_, index) => (
        <Skeleton key={index} className="w-32 h-32 rounded-full" />
      ))}
    </div>
  );

  const renderCategoryCards = () => {
    if (userCategoryData?.length === 0) {
      return (
        <p className="text-center text-gray-500 col-span-full">
          No categories available.
        </p>
      );
    }
    return (
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: "all" }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="w-full grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6"
      >
        {userCategoryData?.slice(0, 6).map((category) => (
          <CategoryCards key={category._id} data={category} />
        ))}
      </motion.div>
    );
  };

  return (
    <div className="w-full py-14 px-4 flex flex-col items-center ">
      {isLoading ? renderSkeletons() : renderCategoryCards()}
    </div>
  );
}

export default CategorySection;
