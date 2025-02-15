import { loginWithGoogle } from "@/api/user/auth/auth";
import { setAccessToken } from "@/axios/userAxiosInstance";
import { Button } from "@/components/ui/button";
import { useUserData } from "@/store/user/hooks/useUserData";
import { auth } from "@/utils/firbaseConfig";
import {
  GoogleAuthProvider,
  signInWithPopup,
  UserCredential,
} from "firebase/auth";
import React, { useState } from "react";
import { toast } from "sonner";

function SignUpWithGoogle() {
  const { setUserData } = useUserData();
  const [loading, setLoading] = useState<boolean>(false);
  const handleGoogleSignup = async () => {
    try {
      setLoading(true);
      const provider = new GoogleAuthProvider();
      const result: UserCredential = await signInWithPopup(auth, provider);

      // Get the signed-in user info
      const user = result.user;

      // Get the ID token
      const token = await user.getIdToken();
      const res = await loginWithGoogle(token);
      // set user details for persistence
      setAccessToken(res.accessToken);
      setUserData(res.user);
      localStorage.setItem("truthy", "true");
      toast.success("You have successfully logged in.");
    } catch (error: unknown) {
      let errorMessage = "Uh oh! Something went wrong.";

      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === "object" && error !== null) {
        const errObj = error as {
          response?: { data?: { message?: string } };
          details?: { message?: string };
        };
        errorMessage =
          errObj.response?.data?.message ||
          errObj.details?.message ||
          errorMessage;
      }

      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  return (
    <Button
      type="button"
      onClick={handleGoogleSignup}
      className="py-6"
      variant="outline"
    >
      {loading ? "Please wait ...." : "Continue with Google"}
    </Button>
  );
}

export default SignUpWithGoogle;
