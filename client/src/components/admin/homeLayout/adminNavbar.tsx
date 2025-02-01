"use client";
import { Button } from "@/components/ui/button";
import { ChartArea, LogOut } from "lucide-react";
import React, { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { adminLogout } from "@/api/admin/auth/auth";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

function AdminNavbar() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      const res = await adminLogout();
      toast({ title: "Logout successfull" });
      router.push("/");
    } catch (error) {
      toast({ title: "Logout failed" });
    }
  };

  return (
    <nav className="w-full h-[8vh] flex justify-between shadow-lg items-center px-10 ">
      <div className="flex items-center gap-2">
        <ChartArea />
        <h1 className="text-sm font-bold">
          <span className="font-italiana tracking-[5px] text-3xl">Nuvella</span>{" "}
          Admin
        </h1>
      </div>
      <Button
        onClick={() => setIsDialogOpen(true)}
        className="border-red-500 hover:text-red-400 text-red-500"
        variant={"outline"}
      >
        <LogOut />
        Logout
      </Button>

      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure you want to log out?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Logging out will end your current session. You can log back in
              anytime using your credentials.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleLogout}>
              Log Out
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </nav>
  );
}

export default AdminNavbar;
