import React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import SignUpWithGoogle from "../../signUpWithGoogle";
import { useRouter } from "next/navigation";

interface Props {
  isSignupDialogOpen: boolean;
  setIsSignupDialogOpen: (value: boolean) => void;
}

function InitiateSignup({ isSignupDialogOpen, setIsSignupDialogOpen }: Props) {
  const router = useRouter()
  return (
    <Dialog open={isSignupDialogOpen} onOpenChange={setIsSignupDialogOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Sign Up</DialogTitle>
          <DialogDescription>Choose how you want to sign up.</DialogDescription>
        </DialogHeader>
        <Button onClick={() => router.push("/signup")} className="py-6">Continue with Email</Button>
        <SignUpWithGoogle />
      </DialogContent>
    </Dialog>
  );
}

export default InitiateSignup;
