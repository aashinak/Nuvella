"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Separator } from "@/components/ui/separator";
import InitiateSignup from "./dialogs/signup/initiateSignup";
import UserLoginDialog from "./dialogs/login";
import { useUserData } from "@/store/user/hooks/useUserData";

function TopSection() {
  const [isLoginDialogOpen, setIsLoginDialogOpen] = useState(false);
  const [isSignupDialogOpen, setIsSignupDialogOpen] = useState(false);
  const { isLoggedIn } = useUserData();

  return (
    <AnimatePresence>
      {!isLoggedIn && (
        <motion.div
          className="flex items-center justify-between px-4 sm:px-8 md:px-16 py-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div></div>
          <div className="flex h-5 items-center space-x-6 font-semibold">
            <div
              className="cursor-pointer"
              onClick={() => setIsSignupDialogOpen(true)}
            >
              Sign Up
            </div>
            <InitiateSignup
              isSignupDialogOpen={isSignupDialogOpen}
              setIsSignupDialogOpen={setIsSignupDialogOpen}
            />
            <Separator
              className="w-0.5 bg-gray-500 opacity-50"
              orientation="vertical"
            />
            <div
              className="cursor-pointer"
              onClick={() => setIsLoginDialogOpen(true)}
            >
              Login
            </div>
            <UserLoginDialog
              isLoginDialogOpen={isLoginDialogOpen}
              setIsLoginDialogOpen={setIsLoginDialogOpen}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default TopSection;
