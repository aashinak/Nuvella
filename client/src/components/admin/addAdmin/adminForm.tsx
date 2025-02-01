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
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { adminCreationRequest } from "@/api/admin/auth/auth";
import OtpForm from "./adminOtp";

// Validation Schema
const formSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters long."),
    email: z.string().email("Please enter a valid email address."),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters long.")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter.")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter.")
      .regex(/[0-9]/, "Password must contain at least one number.")
      .regex(/[\W_]/, "Password must contain at least one special character."),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

function AdminForm() {
  const [newAdminsId, setNewAdminsId] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [isOtpDialogOpen, setIsOtpDialogOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    mode: "onTouched", // Enables live validation
  });

  const { isValid } = form.formState; // Destructure isValid for form validation status

  const handleSubmitForm = async (data: z.infer<typeof formSchema>) => {
    setIsAlertOpen(false);
    setLoading(true);
    try {
      const res = await adminCreationRequest(
        data.name,
        data.email,
        data.password
      );
      console.log(res);
      setNewAdminsId(res.createdAdmin._id)
      toast({ title: "Admin added successfully!" });
      setIsOtpDialogOpen(true);
      form.reset();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error adding admin",
        description: error.response?.data.message || error.details.message,
      });
    } finally {
      setLoading(false);
      //   setIsAlertOpen(false); // Close the alert dialog after submission
    }
  };
  return (
    <Form {...form}>
      <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input
                  className="p-5"
                  disabled={loading}
                  type="text"
                  placeholder="John Doe"
                  {...field}
                />
              </FormControl>
              <FormDescription>Enter your full name</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  className="p-5"
                  disabled={loading}
                  type="email"
                  placeholder="you@example.com"
                  {...field}
                />
              </FormControl>
              <FormDescription>Enter a valid email address</FormDescription>
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
              <FormControl>
                <Input
                  className="p-5"
                  disabled={loading}
                  type="password"
                  placeholder="••••••••"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Enter a strong password with at least 8 characters
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <Input
                  className="p-5"
                  disabled={loading}
                  type="password"
                  placeholder="••••••••"
                  {...field}
                />
              </FormControl>
              <FormDescription>Re-enter your password</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Add Admin Button with AlertDialog Trigger */}
        <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
          <AlertDialogTrigger asChild>
            <Button
              disabled={loading || !isValid} // Disable if form is invalid
              className="w-full font-bold py-5"
              type="button"
            >
              {loading ? (
                <div className="flex items-center gap-3">
                  <div className="spinner-border animate-spin inline-block w-4 h-4 border-2 rounded-full border-t-transparent border-white"></div>
                  Please wait ...
                </div>
              ) : (
                "Add Admin"
              )}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirm Add Admin</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to create a new admin? This action will
                send OTPs to both the new admin&apos;s email and the core
                company&apos;s email.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogAction asChild>
                <Button
                  variant="secondary"
                  onClick={() => setIsAlertOpen(false)}
                  disabled={loading}
                >
                  Cancel
                </Button>
              </AlertDialogAction>
              <AlertDialogAction asChild>
                <Button
                  onClick={form.handleSubmit(handleSubmitForm)}
                  disabled={loading}
                >
                  Confirm
                </Button>
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </form>
      <OtpForm
        isOtpDialogOpen={isOtpDialogOpen}
        setIsOtpDialogOpen={setIsOtpDialogOpen}
        newAdminsId={newAdminsId}
      />
    </Form>
  );
}

export default AdminForm;
