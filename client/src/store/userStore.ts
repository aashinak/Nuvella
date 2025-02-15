import { configureStore } from "@reduxjs/toolkit";
import userAuthSlice from "./user/userAuthSlice";
import userCategorySlice from "./user/userCategorySlice";
import userCheckoutSlice from "./user/userCheckOutSlice";
import userOrderSlice from "./user/userOrderSlice";

const store = configureStore({
  reducer: {
    userAuth: userAuthSlice,
    userCategory: userCategorySlice,
    userCheckout: userCheckoutSlice,
    userOrder: userOrderSlice,
  },
});

export default store;

// Define and export RootState type
export type RootState = ReturnType<typeof store.getState>;
