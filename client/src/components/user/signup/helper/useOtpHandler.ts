import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

interface UseOtpHandlerProps {
  userId?: string;
  verifyOtpFn: (otp: number, userId: string) => Promise<{ success: boolean }>;
  resendOtpFn: (userId: string) => Promise<{ success: boolean }>;
}

export const useOtpHandler = ({
  userId,
  verifyOtpFn,
  resendOtpFn,
}: UseOtpHandlerProps) => {
  const router = useRouter();
  const toast = useToast();

  const handleOtpSubmit = async (
    otp?: string,
    route: string = "/login"
  ): Promise<void> => {
    const parsedOtp = otp && !isNaN(Number(otp)) ? Number(otp) : null;

    if (!parsedOtp || !userId) {
      toast.toast({ title: "OTP submission failed", variant: "destructive" });
      return;
    }

    try {
      const res = await verifyOtpFn(parsedOtp, userId);
      if (res.success) {
        toast.toast({ title: "User verified successfully" });
        router.push(route);
      }
    } catch {
      toast.toast({ title: "Something went wrong", variant: "destructive" });
    }
  };

  const handleResendOtp = async (): Promise<void> => {
    alert(userId);
    if (!userId) return;

    try {
      const res = await resendOtpFn(userId);
      if (res.success) {
        toast.toast({ title: "Resent OTP successfully" });
      }
    } catch {
      toast.toast({ title: "OTP resend failed", variant: "destructive" });
    }
  };

  return { handleOtpSubmit, handleResendOtp };
};
