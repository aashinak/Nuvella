import { configureStore } from "@reduxjs/toolkit";
import adminAuthSlice from "./admin/adminAuthSlice";
import adminCategorySlice from "./admin/adminCategorySlice";
import adminProductSlice from "./admin/adminProductSlice";


const store = configureStore({
  reducer: {
    adminAuth: adminAuthSlice,
    category: adminCategorySlice,
    product: adminProductSlice,
  },
});

export default store;

// Define and export RootState type
export type RootState = ReturnType<typeof store.getState>;
