import ICategory from "@/entities/user/ICategory";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define the type for the state
interface UserCategoryState {
  userCategoryData: ICategory[] | null;
}

// Define the initial state
const initialState: UserCategoryState = {
  userCategoryData: null,
};

// Create the slice
const userCategorySlice = createSlice({
  name: "userCategory", // Corrected slice name
  initialState,
  reducers: {
    setCategoryData: (state, action: PayloadAction<ICategory[]>) => {
      state.userCategoryData = action.payload;
    },
    clearCategoryData: (state) => {
      state.userCategoryData = null;
    },
  },
});

// Export actions and reducer
export const { setCategoryData, clearCategoryData } = userCategorySlice.actions;
export default userCategorySlice.reducer;
