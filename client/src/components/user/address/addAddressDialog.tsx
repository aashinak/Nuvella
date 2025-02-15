"use client";

import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createUserAddress,
  editUserAddress,
} from "@/api/user/userData/userData";
import IUserAddress from "@/entities/user/IUserAddress";

// Define the validation schema
const addressSchema = z.object({
  address_line1: z.string().min(1, "Address Line 1 is required."),
  address_line2: z.string().optional(),
  city: z.string().min(1, "City is required."),
  postal_code: z
    .string()
    .regex(/^\d{6}$/, "Postal Code must be exactly 6 digits."),
  state: z.string().min(1, "State is required."),
  phone: z
    .string()
    .regex(
      /^\+91\d{10}$/,
      "Phone number must start with +91 and be followed by 10 digits."
    ),
});

type AddressFormValues = z.infer<typeof addressSchema>;

interface AddAddressDialogProps {
  onAddressAdded: () => void;
  initialData?: IUserAddress; // Optional prop for existing data
}

function AddAddressDialog({
  onAddressAdded,
  initialData,
}: AddAddressDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<AddressFormValues>({
    resolver: zodResolver(addressSchema),
    defaultValues: initialData || {
      address_line1: "",
      address_line2: "",
      city: "",
      postal_code: "",
      state: "",
      phone: "",
    },
  });

  useEffect(() => {
    if (initialData) {
      reset(initialData); // Populate form with initial data for editing
    }
  }, [initialData, reset]);

  const onSubmit = async (data: AddressFormValues) => {
    setLoading(true);
    try {
      if (initialData) {
        await editUserAddress(data, initialData._id as string);
      } else {
        await createUserAddress(data);
      }

      toast({
        title: initialData
          ? "Address updated successfully!"
          : "Address added successfully!",
        description: "The address has been saved.",
        variant: "default",
      });
      setIsOpen(false);
      reset();
      onAddressAdded();
    } catch (error) {
      toast({
        title: "Error saving address",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Button
        variant={initialData ? "outline" : "default"}
        onClick={() => setIsOpen(true)}
      >
        {initialData ? "Edit" : "Add Address"}
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {initialData ? "Edit Address" : "Add New Address"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Input
                className="p-6"
                placeholder="Address Line 1"
                {...register("address_line1")}
              />
              {errors.address_line1 && (
                <p className="text-red-500 text-sm">
                  {errors.address_line1.message}
                </p>
              )}
            </div>
            <div>
              <Input
                className="p-6"
                placeholder="Address Line 2 (Optional)"
                {...register("address_line2")}
              />
            </div>
            <div>
              <Input className="p-6" placeholder="City" {...register("city")} />
              {errors.city && (
                <p className="text-red-500 text-sm">{errors.city.message}</p>
              )}
            </div>
            <div>
              <Input
                className="p-6"
                placeholder="Postal Code"
                {...register("postal_code")}
              />
              {errors.postal_code && (
                <p className="text-red-500 text-sm">
                  {errors.postal_code.message}
                </p>
              )}
            </div>
            <div>
              <Input
                className="p-6"
                placeholder="State"
                {...register("state")}
              />
              {errors.state && (
                <p className="text-red-500 text-sm">{errors.state.message}</p>
              )}
            </div>
            <div>
              <Input
                className="p-6"
                placeholder="Phone (+91XXXXXXXXXX)"
                {...register("phone")}
              />
              {errors.phone && (
                <p className="text-red-500 text-sm">{errors.phone.message}</p>
              )}
            </div>
            <DialogFooter>
              <Button
                className="p-6"
                type="button"
                variant="outline"
                onClick={() => setIsOpen(false)}
              >
                Cancel
              </Button>
              <Button className="p-6" type="submit" disabled={loading}>
                {loading
                  ? initialData
                    ? "Updating..."
                    : "Saving..."
                  : initialData
                  ? "Update Address"
                  : "Save Address"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default AddAddressDialog;
