import React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  GoogleAuthProvider,
  signInWithPopup,
  UserCredential,
} from "firebase/auth";
import { auth } from "@/utils/firbaseConfig";

interface Props {
  isSignupDialogOpen: boolean;
  setIsSignupDialogOpen: (value: boolean) => void;
}

function InitiateSignup({ isSignupDialogOpen, setIsSignupDialogOpen }: Props) {
  const handleGoogleSignup = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result: UserCredential = await signInWithPopup(auth, provider);

      // Get the signed-in user info
      const user = result.user;
      console.log("User:", user);

      // Get the ID token
      const token = await user.getIdToken();
      console.log("Token:", token);

      // Handle user and token (send to backend, save in storage, etc.)
    } catch (error: any) {
      console.error("Error during Google Sign-In:", error.message || error);
    }
  };

  return (
    <Dialog open={isSignupDialogOpen} onOpenChange={setIsSignupDialogOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Sign Up</DialogTitle>
          <DialogDescription>Choose how you want to sign up.</DialogDescription>
        </DialogHeader>
        <Button className="py-6">Continue with Email</Button>
        <Button onClick={handleGoogleSignup} className="py-6" variant="outline">
          Continue with Google
        </Button>
      </DialogContent>
    </Dialog>
  );
}

export default InitiateSignup;
