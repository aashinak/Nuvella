"use client";

import { useEffect, useState, useCallback } from "react";
import LoginForm from "./loginForm";
import OtpForm from "./otpForm";
import { usePathname, useRouter } from "next/navigation";
import { adminExistsCheck } from "@/api/admin/auth/auth";

function AdminLoginComponent() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true); // Initialize as true
  const [adminIdval, setAdminIdval] = useState("");
  const pathname = usePathname();
  const router = useRouter();
  const adminId = pathname?.split("/")[3];

  const adminExistenceCheck = useCallback(
    async (adminId: string) => {
      try {
        const res = await adminExistsCheck(adminId);

        if (!res.success) {
          router.push("/not-found"); // Redirect to not found page
        } else {
          setLoading(false); // Loading completed only when success
        }
      } catch {
        // setLoading(false);
        router.push("/not-found"); // Redirect to not found page
      }
    },
    [router]
  );

  useEffect(() => {
    if (adminId) {
      adminExistenceCheck(adminId);
    }
  }, [adminId, adminExistenceCheck]);

  if (loading) {
    return (
      <div className="w-full h-screen flex justify-center items-center bg-gray-100">
        {/* Simple Loader */}
        <div className="w-12 h-12 border-4 border-[#404040] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="w-full h-screen flex justify-center items-center bg-gray-100 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-sm sm:max-w-md lg:max-w-lg xl:max-w-xl border rounded-lg p-6 sm:p-8 md:p-10 flex flex-col gap-6 shadow-lg bg-white">
        <h1 className="text-center font-bold text-xl sm:text-2xl md:text-3xl">
          <label className="font-italiana tracking-[3px] sm:tracking-[5px] text-2xl sm:text-3xl">
            Nuvella
          </label>{" "}
          Admin Login
        </h1>
        <LoginForm
          adminId={adminId}
          setIsDialogOpen={setIsDialogOpen}
          setAdminIdval={setAdminIdval}
        />
        <OtpForm
          isDialogOpen={isDialogOpen}
          setIsDialogOpen={setIsDialogOpen}
          adminIdval={adminIdval}
        />
      </div>
    </div>
  );
}

export default AdminLoginComponent;
