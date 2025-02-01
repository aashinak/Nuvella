import { useDispatch, useSelector } from "react-redux";
import { setCategoryData, clearCategoryData } from "../userCategorySlice";
import { RootState } from "../../userStore";
import { useCallback } from "react";
import ICategory from "@/entities/user/ICategory";

// Custom Hook for Category Data
export const useUserCategoryData = () => {
  const dispatch = useDispatch();

  // Access category data from the Redux store
  const userCategoryData: ICategory[] | null = useSelector(
    (state: RootState) => state.userCategory.userCategoryData
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
      if (userCategoryData) {
        const updatedCategories = userCategoryData.filter(
          (category) => category._id !== categoryId
        );
        dispatch(setCategoryData(updatedCategories));
      }
    },
    [dispatch, userCategoryData]
  );

  // Function to add a new category
  const addCategory = useCallback(
    (newCategory: ICategory) => {
      if (userCategoryData) {
        const updatedCategories = [...userCategoryData, newCategory];
        dispatch(setCategoryData(updatedCategories));
      } else {
        dispatch(setCategoryData([newCategory]));
      }
    },
    [dispatch, userCategoryData]
  );

  return {
    userCategoryData,
    setCategory,
    clearCategory,
    removeCategory,
    addCategory,
  };
};
