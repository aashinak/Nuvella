import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define the type for userData
interface AdminData {
  _id: string;
  name: string;
  email: string;
}

// Define the type for the state
interface AdminAuthState {
  status: boolean;
  userData: AdminData | null;
}

// Define the initial state
const initialState: AdminAuthState = {
  status: false,
  userData: null,
};

// Create the slice
const adminAuthSlice = createSlice({
  name: "adminAuth",
  initialState,
  reducers: {
    adminLogin: (state, action: PayloadAction<{ userData: AdminData }>) => {
      state.status = true;
      state.userData = action.payload.userData;
    },
    adminLogout: (state) => {
      state.status = false;
      state.userData = null;
    },
  },
});

// Export actions and reducer
export const { adminLogin, adminLogout } = adminAuthSlice.actions;
export default adminAuthSlice.reducer;
