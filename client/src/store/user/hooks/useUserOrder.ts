import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../userStore";
import { useCallback } from "react";
import {
  setOrderItems,
  setDeliveryAddress,
  clearOrder,
} from "../userOrderSlice";
import { IMinimalOrderItem } from "@/entities/user/IOrderItem";
// import {IMinimalOrderItem} from "@/entities/user/IMinimalOrderItem";

// Custom Hook
export const useUserOrder = () => {
  const dispatch = useDispatch();

  // Access order items and address from the Redux store
  const orderItems = useSelector(
    (state: RootState) => state.userOrder.orderItems
  );
  const address = useSelector((state: RootState) => state.userOrder.address);

  // Function to set order items
  const addOrderItems = useCallback(
    (items: IMinimalOrderItem[]) => {
      dispatch(setOrderItems(items));
    },
    [dispatch]
  );

  // Function to set delivery address
  const updateAddress = useCallback(
    (newAddress: string) => {
      dispatch(setDeliveryAddress(newAddress));
    },
    [dispatch]
  );

  // Function to clear order data
  const resetOrder = useCallback(() => {
    dispatch(clearOrder());
  }, [dispatch]);

  return { orderItems, address, addOrderItems, updateAddress, resetOrder };
};
