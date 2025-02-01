import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../userStore";
import { useCallback } from "react";
import { setCheckoutData, clearCheckoutData } from "../userCheckOutSlice";

// Custom Hook
export const useUserCheckoutData = () => {
  const dispatch = useDispatch();

  // Access checkout data from the Redux store
  const checkoutId = useSelector(
    (state: RootState) => state.userCheckout.checkoutId
  );
  const checkoutItems = useSelector(
    (state: RootState) => state.userCheckout.checkoutItems
  );

  // Function to set checkout data
  const setCheckout = useCallback(
    (checkoutId: string, checkoutItems: string[]) => {
      dispatch(setCheckoutData({ checkoutId, checkoutItems }));
    },
    [dispatch]
  );

  // Function to clear checkout data
  const clearCheckout = useCallback(() => {
    dispatch(clearCheckoutData());
  }, [dispatch]);

  return { checkoutId, checkoutItems, setCheckout, clearCheckout };
};
