import IUser from "@/entities/user/IUser";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define the type for the state
interface UserAuthState {
  status: boolean;
  userData: IUser | null;
}

// Define the initial state
const initialState: UserAuthState = {
  status: false,
  userData: null,
};

// Create the slice
const userAuthSlice = createSlice({
  name: "userAuth",
  initialState,
  reducers: {
    userLogin: (state, action: PayloadAction<{ userData: IUser }>) => {
      state.status = true;
      state.userData = action.payload.userData;
    },
    userLogout: (state) => {
      state.status = false;
      state.userData = null;
    },
  },
});

// Export actions and reducer
export const { userLogin, userLogout } = userAuthSlice.actions;
export default userAuthSlice.reducer;
