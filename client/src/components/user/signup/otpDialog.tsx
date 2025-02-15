import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
} from "@/components/ui/input-otp";
import { Loader2, RefreshCw } from "lucide-react";

interface OtpDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (otp: string) => void;
  resendOtp: () => void;
}

const OtpDialog: React.FC<OtpDialogProps> = ({
  isOpen,
  onClose,
  onSubmit,
  resendOtp,
}) => {
  const [otp, setOtp] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [isResendDisabled, setIsResendDisabled] = useState<boolean>(false);
  const [timer, setTimer] = useState<number>(30);

  useEffect(() => {
    if (isResendDisabled) {
      const countdown = setInterval(() => {
        setTimer((prev) => {
          if (prev === 1) {
            clearInterval(countdown);
            setIsResendDisabled(false);
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(countdown);
    }
  }, [isResendDisabled]);

  const handleOtpChange = (value: string) => {
    setOtp(value);
  };

  const handleResend = () => {
    resendOtp();
    setIsResendDisabled(true);
    setTimer(30);
  };

  const handleVerify = () => {
    if (otp.length !== 6) return;
    setLoading(true);
    onSubmit(otp);
    setTimeout(() => {
      setLoading(false);
      onClose();
    }, 1500);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md rounded-xl p-6 shadow-lg">
        <DialogHeader className="text-center">
          <DialogTitle className="text-2xl font-semibold text-gray-900">
            Enter Verification Code
          </DialogTitle>
          <p className="text-sm text-gray-500 mt-1">
            We&apos;ve sent a 6-digit code to your email.
          </p>
        </DialogHeader>

        {/* OTP Input Section */}
        <div className="flex justify-center mt-4">
          <InputOTP
            maxLength={6}
            value={otp}
            onChange={handleOtpChange}
            className="text-xl tracking-widest"
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

        {/* Verify Button */}
        <DialogFooter className="mt-6">
          <Button
            onClick={handleVerify}
            disabled={otp.length !== 6 || loading}
            className="w-full text-lg py-3 transition-all"
          >
            {loading ? (
              <Loader2 className="animate-spin mr-2" size={20} />
            ) : (
              "Verify Code"
            )}
          </Button>
        </DialogFooter>

        {/* Resend OTP Section */}
        <div className="flex justify-between items-center text-sm text-gray-600 mt-4">
          <span>Didn&apos;t receive the code?</span>
          <Button
            variant="ghost"
            disabled={isResendDisabled}
            onClick={handleResend}
            className="text-blue-500 hover:text-blue-600 transition"
          >
            {isResendDisabled ? (
              <span className="flex items-center">
                <RefreshCw className="animate-spin mr-2" size={16} /> Resend in{" "}
                {timer}s
              </span>
            ) : (
              "Resend OTP"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OtpDialog;
