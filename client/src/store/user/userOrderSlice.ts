import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import  { IMinimalOrderItem } from "@/entities/user/IOrderItem";

// Define the type for the state
interface OrderState {
  orderItems: IMinimalOrderItem[] | []; // Array to hold multiple order items
  address: string | null;  // Selected address for the order
}

// Define the initial state
const initialState: OrderState = {
  orderItems: [],  // Default to an empty array
  address: null,   // No address selected initially
};

// Create the slice
const userOrderSlice = createSlice({
  name: "userOrder",
  initialState,
  reducers: {
    // Add order items to the state
    setOrderItems: (state, action: PayloadAction<IMinimalOrderItem[]>) => {
      state.orderItems = action.payload;
    },
    // Set the delivery address
    setDeliveryAddress: (state, action: PayloadAction<string>) => {
      state.address = action.payload;
    },
    // Clear the order state
    clearOrder: (state) => {
      state.orderItems = [];
      state.address = null;
    },
  },
});

// Export actions and reducer
export const { setOrderItems, setDeliveryAddress, clearOrder } = userOrderSlice.actions;
export default userOrderSlice.reducer;
