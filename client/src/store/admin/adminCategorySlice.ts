import ICategory from "@/entities/ICategory";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define the type for the state
interface AdminCategoryState {
  categoryData: ICategory[] | null;
}

// Define the initial state
const initialState: AdminCategoryState = {
  categoryData: null,
};

// Create the slice
const adminCategorySlice = createSlice({
  name: "category", // Corrected slice name
  initialState,
  reducers: {
    setCategoryData: (state, action: PayloadAction<ICategory[]>) => {
      state.categoryData = action.payload;
    },
    clearCategoryData: (state) => {
      state.categoryData = null;
    },
  },
});

// Export actions and reducer
export const { setCategoryData, clearCategoryData } = adminCategorySlice.actions;
export default adminCategorySlice.reducer;
