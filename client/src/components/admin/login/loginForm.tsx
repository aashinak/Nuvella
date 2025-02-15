import React, { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";

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
import { adminLogin } from "@/api/admin/auth/auth";
import { useToast } from "@/hooks/use-toast";

// Validation Schema
const formSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long.")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter.")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter.")
    .regex(/[0-9]/, "Password must contain at least one number.")
    .regex(/[\W_]/, "Password must contain at least one special character."),
});

interface Props {
  setIsDialogOpen: (value: boolean) => void;
  setAdminIdval: (value: string) => void;
  adminId: string;
}

function LoginForm({ setIsDialogOpen, setAdminIdval, adminId }: Props) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleSubmitForm = async (values: z.infer<typeof formSchema>) => {
    try {
      setLoading(true);
      const res = await adminLogin(values.email, values.password, adminId);
      setAdminIdval(res.admin._id);
      setIsDialogOpen(true); // Open OTP dialog
      setLoading(false);
    } catch (error: unknown) {
      setLoading(false);

      let errorMessage = "An unexpected error occurred.";

      if (error instanceof Error) {
        errorMessage = error.message;
      }

      if (typeof error === "object" && error !== null) {
        const axiosError = error as {
          response?: { data?: { message?: string } };
          details?: { message?: string };
        };

        errorMessage =
          axiosError.response?.data?.message ||
          axiosError.details?.message ||
          errorMessage;
      }

      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: errorMessage,
      });
    }
  };
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmitForm)}
        className="space-y-6"
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl className="p-6">
                <Input
                  disabled={loading}
                  type="email"
                  placeholder="you@example.com"
                  {...field}
                />
              </FormControl>
              <FormDescription>Enter valid email address</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl className="p-6">
                <Input
                  disabled={loading}
                  type="password"
                  placeholder="••••••••"
                  {...field}
                />
              </FormControl>
              <FormDescription>Enter your password</FormDescription>

              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          disabled={loading}
          className="w-full p-6 font-bold"
          type="submit"
        >
          {loading ? (
            <div className="flex items-center gap-3">
              <div className="spinner-border animate-spin inline-block w-4 h-4 border-2 rounded-full border-t-transparent border-white"></div>
              Please wait ...
            </div>
          ) : (
            "Login"
          )}
        </Button>
      </form>
    </Form>
  );
}

export default LoginForm;
