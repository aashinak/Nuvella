import { useDispatch, useSelector } from "react-redux";
import { adminLogin, adminLogout } from "../admin/adminAuthSlice"; // Adjust the path to your slice
import { RootState } from "../store"; // Adjust the path to your root store configuration
import { useCallback } from "react";

// Custom Hook
export const useAdminData = () => {
  const dispatch = useDispatch();

  // Access admin data and login status from the Redux store
  const adminData = useSelector((state: RootState) => state.adminAuth.userData);
  const isLoggedIn = useSelector((state: RootState) => state.adminAuth.status);

  // Function to set admin data (used after API calls)
  const setAdminData = useCallback(
    (data: { _id: string; name: string; email: string }) => {
      dispatch(adminLogin({ userData: data }));
    },
    [dispatch]
  );

  // Function to log out admin
  const logoutAdmin = useCallback(() => {
    dispatch(adminLogout());
  }, [dispatch]);

  return { adminData, isLoggedIn, setAdminData, logoutAdmin };
};
