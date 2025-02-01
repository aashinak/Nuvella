import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { userLogin } from "@/api/user/auth/auth";
import { useToast } from "@/hooks/use-toast";
import { useUserData } from "@/store/user/hooks/useUserData";
import { setAccessToken } from "@/axios/userAxiosInstance";
import { toast } from "sonner";

const loginSchema = z.object({
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
  isLoginDialogOpen: boolean;
  setIsLoginDialogOpen: (value: boolean) => void;
}
function UserLoginDialog({ isLoginDialogOpen, setIsLoginDialogOpen }: Props) {
  const [loading, setLoading] = useState(false);
  const { setUserData } = useUserData();

  // const { toast } = useToast();

  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleFormSubmit = async (data: z.infer<typeof loginSchema>) => {
    console.log("Login Data: ", data);
    try {
      setLoading(true);
      const res = await userLogin(data.email, data.password);
      setAccessToken(res.accessToken);
      console.log(res);
      toast.success("You have successfully logged in to your account.");
      setUserData(res.user);
      localStorage.setItem("truthy", "true");
      setIsLoginDialogOpen(false);
    } catch (error) {
      toast.error("Uh oh! Something went wrong.", {
        description: error.response?.data.message || error.details.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    console.log("Google Login Triggered");
    // Add Google OAuth logic here
  };

  return (
    <Dialog open={isLoginDialogOpen} onOpenChange={setIsLoginDialogOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Login</DialogTitle>
          <DialogDescription>
            Enter your credentials to log in to your account or continue with
            Google.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleFormSubmit)}
            className="space-y-6"
          >
            <fieldset disabled={loading}>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        className="py-6"
                        {...field}
                        type="email"
                        placeholder="Enter your email"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="mt-2">
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        className="py-6"
                        {...field}
                        type="password"
                        placeholder="Enter your password"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <div className="flex flex-col w-full gap-3 mt-4">
                  <Button className="py-6" type="submit" disabled={loading}>
                    {loading ? "Logging in..." : "Login"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleGoogleLogin}
                    className="py-6"
                    disabled={loading}
                  >
                    Login with Google
                  </Button>
                </div>
              </DialogFooter>
            </fieldset>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default UserLoginDialog;
