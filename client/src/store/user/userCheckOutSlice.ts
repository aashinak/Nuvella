import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define the type for the state
interface CheckoutState {
  checkoutId: string | null;
  checkoutItems: string[] | null;
}

// Define the initial state
const initialState: CheckoutState = {
  checkoutId: null,
  checkoutItems: null,
};

// Create the slice
const userCheckoutSlice = createSlice({
  name: "userCheckout",
  initialState,
  reducers: {
    setCheckoutData: (
      state,
      action: PayloadAction<{ checkoutId: string; checkoutItems: string[] }>
    ) => {
      state.checkoutId = action.payload.checkoutId;
      state.checkoutItems = action.payload.checkoutItems;
    },
    clearCheckoutData: (state) => {
      state.checkoutId = null;
      state.checkoutItems = null;
    },
  },
});

// Export actions and reducer
export const { setCheckoutData, clearCheckoutData } = userCheckoutSlice.actions;
export default userCheckoutSlice.reducer;
