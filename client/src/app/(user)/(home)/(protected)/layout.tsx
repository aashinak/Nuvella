"use client";

import { userTokenRegen } from "@/api/user/auth/auth";
import { setAccessToken } from "@/axios/userAxiosInstance";
import { useUserData } from "@/store/user/hooks/useUserData";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isLoggedIn, setUserData } = useUserData();
  const router = useRouter();
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      if (isLoggedIn) {
        setAuthChecked(true);
        return;
      }

      const hasTruthy = localStorage.getItem("truthy") === "true";

      if (hasTruthy) {
        try {
          const res = await userTokenRegen(); // Attempt token regeneration
          setAccessToken(res.accessToken);
          setUserData(res.user);
          setAuthChecked(true);
        } catch (error) {
          console.error("Token regeneration failed:", error);
          localStorage.removeItem("truthy");
          router.replace("/login");
        }
      } else {
        router.replace("/login");
      }
    };

    checkAuth();
  }, [isLoggedIn, router, setUserData]);

  if (!authChecked) {
    return (
      <div className="h-screen flex items-center justify-center">
        Checking authentication...
      </div>
    );
  }

  return <div>{children}</div>;
}
