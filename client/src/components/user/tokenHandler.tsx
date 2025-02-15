"use client";

import { userTokenRegen } from "@/api/user/auth/auth";
import { setAccessToken } from "@/axios/userAxiosInstance";
import { useUserData } from "@/store/user/hooks/useUserData";
import  { useCallback, useEffect } from "react";

function TokenHandler() {
  const { isLoggedIn, setUserData } = useUserData();
  // const [loading, setLoading] = useState(false);

  const regenToken = useCallback(async () => {
    try {
      // setLoading(true);
      const res = await userTokenRegen();
      setAccessToken(res.accessToken);
      setUserData(res.user);
    } catch (error) {
      localStorage.removeItem("truthy")
      console.error(error);
    } finally {
      // setLoading(false);
    }
  }, [setUserData]);

  useEffect(() => {
    if (!isLoggedIn && localStorage.getItem("truthy") === "true") {
      regenToken();
    }
  }, [isLoggedIn, regenToken]);

  return null;
}

export default TokenHandler;
