"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import OtpDialog from "./otpDialog";
import {
  userRegisteration,
  userRegisterationOtpVerification,
  userRegisterationOtpVerificationResend,
} from "@/api/user/auth/auth";
import { useToast } from "@/hooks/use-toast";
import IUser from "@/entities/user/IUser";
import { useOtpHandler } from "./helper/useOtpHandler";

// Form Validation Schema using Zod
export const formSchema = z
  .object({
    username: z
      .string()
      .min(3, { message: "Username must be at least 3 characters." })
      .max(20, { message: "Username must be at most 20 characters." })
      .regex(/^[a-zA-Z0-9]+$/, {
        message:
          "Username must only contain alphanumeric characters (letters and numbers).",
      }),
    firstname: z.string().min(3, "First name must be at least 3 characters."),
    lastname: z
      .string()
      .optional()
      .transform((val) => (val === "" ? undefined : val)),
    email: z.string().email("Invalid email address."),
    phone: z
      .string()
      .optional()
      .transform((val) => (val === "" ? undefined : val)) // Convert empty string to undefined
      .refine((val) => !val || /^\d{10}$/.test(val), {
        message: "Phone number must be 10 digits.",
      }),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters.")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter.")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter.")
      .regex(/[0-9]/, "Password must contain at least one number.")
      .regex(/[\W_]/, "Password must contain at least one special character."),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

function SignupForm() {
  const [passwordVisible, setPasswordVisible] = useState<boolean>(false);
  const [isOtpDialogOpen, setIsOtpDialogOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [userDetails, setUserDetails] = useState<IUser | null>(null);
  const { toast } = useToast();
  const { handleOtpSubmit, handleResendOtp } = useOtpHandler({
    userId: userDetails?._id,
    verifyOtpFn: userRegisterationOtpVerification,
    resendOtpFn: userRegisterationOtpVerificationResend,
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      firstname: "",
      lastname: "",
      email: "",
      password: "",
      phone: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);
    try {
      const res = await userRegisteration(values);
      setUserDetails(res.user);

      if (res.success) {
        setIsOtpDialogOpen(true);
        toast({
          title: "Registration Successful",
          description: "Please verify your email via OTP.",
          variant: "default",
        });
      } else {
        toast({
          title: "Registration Failed",
          description: res.message || "Something went wrong. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      let errorMessage = "An unexpected error occurred";

      if (
        typeof error === "object" &&
        error !== null &&
        "details" in error &&
        typeof (error as { details: { message?: string } }).details?.message ===
          "string"
      ) {
        errorMessage = (error as { details: { message: string } }).details
          .message;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // const handleOtpSubmit = async (otp?: string) => {
  //   const parsedOtp = otp && !isNaN(Number(otp)) ? Number(otp) : null;

  //   if (!parsedOtp || !userDetails?._id) {
  //     toast({ title: "OTP submission failed", variant: "destructive" });
  //     return;
  //   }

  //   try {
  //     const res = await userRegisterationOtpVerification(
  //       parsedOtp,
  //       userDetails._id
  //     );
  //     if (res.success === true) {
  //       toast({ title: "User verified successfully" });
  //       router.push("/login");
  //     }
  //   } catch (error) {
  //     toast({ title: "Something went wrong", variant: "destructive" });
  //   }
  // };

  // const handleResendOtp = async () => {
  //   // Call API to resend OTP
  //   try {
  //     const res = await userRegisterationOtpVerificationResend(
  //       userDetails?._id as string
  //     );
  //     if (res.success === true) {
  //       toast({ title: "Resend otp successfully" });
  //     }
  //   } catch (error) {
  //     toast({ title: "Otp resend failed", variant: "destructive" });
  //   }
  // };

  return (
    <div className="md:w-2/3 w-full flex flex-col gap-6 items-center md:py-6">
      <h1 className="text-3xl font-semibold">Create an Account</h1>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full md:w-3/4 p-8 border rounded-lg shadow-md bg-white"
        >
          {/* Username */}
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="username" {...field} />
                </FormControl>
                <FormDescription>
                  This is your public display name.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* First Name */}
          <FormField
            control={form.control}
            name="firstname"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input placeholder="John" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Last Name */}
          <FormField
            control={form.control}
            name="lastname"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Name (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Email */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="example@email.com"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Phone Number */}
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number (Optional)</FormLabel>
                <FormControl>
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-2 bg-gray-200 text-gray-700 rounded-md">
                      +91
                    </span>
                    <Input
                      type="tel"
                      placeholder="9876543210"
                      className="flex-1"
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Password */}
          <div className="md:col-span-2">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type={passwordVisible ? "text" : "password"}
                      placeholder="********"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Confirm Password */}
          <div className="md:col-span-2">
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input
                      type={passwordVisible ? "text" : "password"}
                      placeholder="********"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Show/Hide Password */}
          <div className="md:col-span-2 flex items-center gap-2 text-gray-600">
            <input
              type="checkbox"
              id="showPassword"
              onChange={() => setPasswordVisible(!passwordVisible)}
            />
            <label htmlFor="showPassword" className="cursor-pointer">
              Show Password
            </label>
          </div>

          {/* Submit Button */}
          <div className="md:col-span-2 flex flex-col items-center justify-center">
            <Button
              disabled={loading}
              type="submit"
              className="w-full md:w-1/2"
            >
              {loading ? "Please wait ...." : "Sign Up"}
            </Button>
          </div>
        </form>
      </Form>
      <OtpDialog
        isOpen={isOtpDialogOpen}
        onClose={() => setIsOtpDialogOpen(false)}
        onSubmit={handleOtpSubmit}
        resendOtp={handleResendOtp}
      />
    </div>
  );
}

export default SignupForm;
