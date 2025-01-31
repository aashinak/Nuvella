import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store";
import { useCallback } from "react";
import IProduct from "@/entities/IProduct";
import {
  clearAdminCategoryData,
  setAdminProductData,
} from "../admin/adminProductSlice";

// Custom Hook for Category Data
export const useAdminProductData = () => {
  const dispatch = useDispatch();

  // Access category data from the Redux store
  const adminProductData: IProduct[] | null = useSelector(
    (state: RootState) => state.product.productData
  );

  // Function to set category data (used after API calls)
  const setAdminProduct = useCallback(
    (products: IProduct[]) => {
      dispatch(setAdminProductData(products));
    },
    [dispatch]
  );

  // Function to clear category data
  const clearProduct = useCallback(() => {
    dispatch(clearAdminCategoryData());
  }, [dispatch]);

  // Function to remove a category by _id
  const removeProduct = useCallback(
    (productId: string) => {
      if (adminProductData) {
        const updatedProducts = adminProductData.filter(
          (product) => product._id !== productId
        );
        dispatch(setAdminProductData(updatedProducts));
      }
    },
    [dispatch, adminProductData]
  );

  // Function to add a new category
  const addProduct = useCallback(
    (newProduct: IProduct) => {
      if (adminProductData) {
        const updatedProducts = [...adminProductData, newProduct];
        dispatch(setAdminProductData(updatedProducts));
      } else {
        dispatch(setAdminProductData([newProduct]));
      }
    },
    [dispatch, adminProductData]
  );

  return {
    adminProductData,
    setAdminProduct,
    clearProduct,
    removeProduct,
    addProduct,
  };
};
