import React, { useState } from "react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { adminLoginOtpVerification } from "@/api/admin/auth/auth";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { useAdminData } from "@/store/hooks/useAdminData";
import { setAccessToken } from "@/axios/adminAxiosIntance";

interface Props {
  setIsDialogOpen: (value: boolean) => void; // Function to toggle dialog open state
  isDialogOpen: boolean; // Tracks if the dialog is open
  adminIdval: string; // Admin data object
}

function OtpForm({ isDialogOpen, setIsDialogOpen, adminIdval }: Props) {
  const { setAdminData } = useAdminData();
  const router = useRouter();
  const { toast } = useToast();
  const [otp, setOtp] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleOtpSubmit = async () => {
    setLoading(true); // Show loading state
    try {
      const res = await adminLoginOtpVerification(adminIdval, otp);
      setAccessToken(res.accessToken)
      setAdminData(res.admin);

      toast({
        title: "OTP Submission successfull",
        description: "",
      });
      if (res.success) {
        router.push("/admin/dashboard");
      }
      toast({
        title: "Login successfull",
        description: "",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: error.response?.data.message || error.details.message,
      });
    } finally {
      setLoading(false); // Hide loading state
    }
  };

  return (
    <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Enter the OTP sent to your email</AlertDialogTitle>
          <AlertDialogDescription>
            This OTP is valid for 3 minutes only.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="w-full flex justify-center">
          <InputOTP
            autoFocus
            maxLength={6}
            onChange={(value) => {
              setOtp(value);
            }}
          >
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
            </InputOTPGroup>
            <InputOTPSeparator />
            <InputOTPGroup>
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
        </div>
        <AlertDialogFooter>
          <AlertDialogAction onClick={handleOtpSubmit} disabled={loading}>
            {loading ? "Loading..." : "Submit OTP"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default OtpForm;
