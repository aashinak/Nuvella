import IProduct from "@/entities/IProduct";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define the type for the state
interface AdminProductState {
  productData: IProduct[] | null;
}

// Define the initial state
const initialState: AdminProductState = {
  productData: null,
};

// Create the slice
const adminProductSlice = createSlice({
  name: "product", 
  initialState,
  reducers: {
    setAdminProductData: (state, action: PayloadAction<IProduct[]>) => {
      state.productData = action.payload;
    },
    clearAdminCategoryData: (state) => {
      state.productData = null;
    },
  },
});

// Export actions and reducer
export const { setAdminProductData, clearAdminCategoryData } =
  adminProductSlice.actions;
export default adminProductSlice.reducer;
