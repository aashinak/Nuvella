"use client";

import { userTokenRegen } from "@/api/user/auth/auth";
import { setAccessToken } from "@/axios/userAxiosInstance";
import { useUserData } from "@/store/user/hooks/useUserData";
import React, { useCallback, useEffect, useState } from "react";

function TokenHandler() {
  const { isLoggedIn, setUserData } = useUserData();
  const [loading, setLoading] = useState(false);

  const regenToken = useCallback(async () => {
    try {
      setLoading(true);
      const res = await userTokenRegen();
      setAccessToken(res.accessToken);
      setUserData(res.user);
    } catch (error) {
      localStorage.removeItem("truthy")
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [setUserData]);

  useEffect(() => {
    if (!isLoggedIn && localStorage.getItem("truthy") === "true") {
      regenToken();
    }
  }, [isLoggedIn, regenToken]);

  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-gray-100">
        <div className="spinner border-4 border-t-4 border-gray-300 rounded-full w-16 h-16 animate-spin"></div>
        <p className="ml-4 text-gray-600">Loading...</p>
      </div>
    );
  }

  return null;
}

export default TokenHandler;
