import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../userStore";
import { useCallback } from "react";
import { userLogin, userLogout } from "../userAuthSlice";
import IUser from "@/entities/user/IUser";

// Custom Hook
export const useUserData = () => {
  const dispatch = useDispatch();

  // Access user data and login status from the Redux store
  const userData = useSelector((state: RootState) => state.userAuth.userData);
  const isLoggedIn = useSelector((state: RootState) => state.userAuth.status);

  // Function to set user data (used after API calls)
  const setUserData = useCallback(
    (data: IUser) => {
      dispatch(userLogin({ userData: data }));
    },
    [dispatch]
  );

  // Function to log out user
  const logoutUser = useCallback(() => {
    dispatch(userLogout());
  }, [dispatch]);

  return { userData, isLoggedIn, setUserData, logoutUser };
};
