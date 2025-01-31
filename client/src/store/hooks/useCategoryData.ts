import { useDispatch, useSelector } from "react-redux";
import {
  setCategoryData,
  clearCategoryData,
} from "../admin/adminCategorySlice";
import { RootState } from "../store";
import { useCallback } from "react";
import ICategory from "@/entities/ICategory";

// Custom Hook for Category Data
export const useCategoryData = () => {
  const dispatch = useDispatch();
  // Access category data from the Redux store
  const categoryData: ICategory[] | null = useSelector(
    (state: RootState) => state.category.categoryData
  );

  // Function to set category data (used after API calls)
  const setCategory = useCallback(
    (categories: ICategory[]) => {
      dispatch(setCategoryData(categories));
    },
    [dispatch]
  );

  // Function to clear category data
  const clearCategory = useCallback(() => {
    dispatch(clearCategoryData());
  }, [dispatch]);

  // Function to remove a category by _id
  const removeCategory = useCallback(
    (categoryId: string) => {
      if (categoryData) {
        const updatedCategories = categoryData.filter(
          (category) => category._id !== categoryId
        );
        dispatch(setCategoryData(updatedCategories));
      }
    },
    [dispatch, categoryData]
  );

  // Function to add a new category
  const addCategory = useCallback(
    (newCategory: ICategory) => {
      if (categoryData) {
        const updatedCategories = [...categoryData, newCategory];
        dispatch(setCategoryData(updatedCategories));
      } else {
        dispatch(setCategoryData([newCategory]));
      }
    },
    [dispatch, categoryData]
  );

  return {
    categoryData,
    setCategory,
    clearCategory,
    removeCategory,
    addCategory,
  };
};
