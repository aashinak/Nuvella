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
import { useToast } from "@/hooks/use-toast";
import { adminCreationRequestVerification } from "@/api/admin/auth/auth";

interface Props {
  setIsOtpDialogOpen: (value: boolean) => void; // Function to toggle dialog open state
  isOtpDialogOpen: boolean; // Tracks if the dialog is open
  newAdminsId: string;
}

function OtpForm({ isOtpDialogOpen, setIsOtpDialogOpen, newAdminsId }: Props) {
  const { toast } = useToast();
  const [otp, setOtp] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [isUrlDialogOpen, setIsUrlDialogOpen] = useState<boolean>(false);

  const handleOtpSubmit = async () => {
    setLoading(true); // Show loading state
    try {
      const otp1 = otp.slice(0, 3); // First 3 digits
      const otp2 = otp.slice(3, 6); // Last 3 digits
      const res = await adminCreationRequestVerification(
        +otp1,
        +otp2,
        newAdminsId
      );
      console.log(res);

      toast({
        title: "OTP Submission successful",
        description: "",
      });

      // Show the URL dialog
      setIsOtpDialogOpen(false);
      setIsUrlDialogOpen(true);
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

  const url = `${process.env.NEXT_PUBLIC_FRONTEND_URL}/admin/login/${newAdminsId}`;


  return (
    <>
      {/* OTP Dialog */}
      <AlertDialog  open={isOtpDialogOpen} onOpenChange={setIsOtpDialogOpen}>
        <AlertDialogContent >
          <AlertDialogHeader>
            <AlertDialogTitle>
              Enter the OTP sent to your email
            </AlertDialogTitle>
            <AlertDialogDescription>
              This OTP is valid for 3 minutes only. Please enter the OTP as
              follows:
              <br />
              <strong>The first 3 fields</strong> for the OTP sent to the new
              admin&apos;s email.
              <br />
              <strong>The next 3 fields</strong> for the OTP sent to the core
              company&apos;s email.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="w-full flex flex-col items-center ">
            <InputOTP
              required
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

      {/* URL Dialog */}
      <AlertDialog open={isUrlDialogOpen} onOpenChange={setIsUrlDialogOpen}>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Important: Copy this URL</AlertDialogTitle>
      <AlertDialogDescription className="flex flex-col gap-2">
          <span>Please copy the following URL for accessing the admin panel:</span>
          <code
            className="bg-gray-200 p-2 rounded mt-2 text-sm break-all overflow-auto max-h-20"
          >
            {url}
          </code>
          <span>
            Make sure to save this URL securely, as it is required for the new
            admin to access the panel.
          </span>
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogAction
        onClick={() => {
          navigator.clipboard.writeText(url); // Copy URL to clipboard
          toast({
            title: "URL copied to clipboard!",
          });
          setIsUrlDialogOpen(false);
        }}
      >
        Copy URL
      </AlertDialogAction>
      <AlertDialogAction
        onClick={() => setIsUrlDialogOpen(false)}
        variant="secondary"
      >
        Close
      </AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>

    </>
  );
}

export default OtpForm;
