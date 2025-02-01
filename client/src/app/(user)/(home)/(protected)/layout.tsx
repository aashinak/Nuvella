"use client";

import { userTokenRegen } from "@/api/user/auth/auth";
import { setAccessToken } from "@/axios/userAxiosInstance";
import { useUserData } from "@/store/user/hooks/useUserData";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";

function Layout({ children }: { children: React.ReactNode }) {
  const { isLoggedIn, setUserData } = useUserData();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  const handleCallback = useCallback(async () => {
    // If not logged in but `truthy` flag exists, try token regeneration
    // if (!isLoggedIn && localStorage.getItem("truthy") === "true") {
    //   try {
    //     setLoading(true);
    //     alert("lol2")
    //     const res = await userTokenRegen();
    //     setAccessToken(res.accessToken);
    //     setUserData(res.user);
    //   } catch (error) {
    //     console.error("Token regeneration failed:", error);
    //     localStorage.removeItem("truthy"); // Clean up invalid state
    //     router.push("/login");
    //   }
    // } else 
    if (!isLoggedIn) {
      // If not logged in and no `truthy` flag, redirect immediately
      router.push("/login");
    }
    setLoading(false);
  }, [isLoggedIn, router]);

  useEffect(() => {
    handleCallback();
  }, [handleCallback]);

  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-gray-100">
        <div
          className="spinner border-4 border-t-4 border-gray-300 rounded-full w-16 h-16 animate-spin"
          aria-label="Loading"
        ></div>
        <p className="ml-4 text-gray-600">Checking authentication...</p>
      </div>
    );
  }

  // Render children after authentication check
  return <div>{children}</div>;
}

export default Layout;
