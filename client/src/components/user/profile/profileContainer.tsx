"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { useUserData } from "@/store/user/hooks/useUserData";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateUserData } from "@/api/user/userData/userData";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useDropzone } from "react-dropzone";
import Image from "next/image";
import { ScrollArea } from "@/components/ui/scroll-area";

const profileSchema = z.object({
  firstname: z.string().min(2, "First name must be at least 2 characters"),
  lastname: z.string().min(2, "Last name must be at least 2 characters"),
  phone: z.string().min(10, "Phone number must be valid"),
  avatar: z.any().optional(),
});

function ProfileContainer() {
  const { userData, setUserData } = useUserData();

  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [openDialog, setOpenDialog] = useState(false);

  const form = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstname: "",
      lastname: "",
      phone: "",
      avatar: "",
      username: "",
      email: "",
    },
  });

  useEffect(() => {
    if (userData) {
      form.reset({
        firstname: userData.firstname || "",
        lastname: userData.lastname || "",
        phone: userData.phone || "",
        avatar: userData.avatar || "",
        username: userData.username || "",
        email: userData.email || "",
      });
      setAvatarPreview(userData.avatar || "");
    }
  }, [userData, form]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setAvatarPreview(URL.createObjectURL(file));
      setAvatarFile(file);
    }
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    maxFiles: 1,
  });

  const handleSubmit = async (data) => {
    setIsUpdating(true);
    toast({
      title: "Updating...",
      description: "Your profile is being updated.",
      variant: "default",
    });

    const formData = new FormData();
    formData.append("firstname", data.firstname);
    formData.append("lastname", data.lastname);
    formData.append("phone", data.phone);
    if (avatarFile) {
      formData.append("avatar", avatarFile);
    }

    try {
      const res = await updateUserData(formData);
      setUserData(res.user);
      toast({
        title: "Success",
        description: "Profile updated successfully!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile.",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
      setIsEditing(false);
    }
  };

  const handleConfirmAvatar = () => {
    if (avatarFile) {
      toast({
        title: "Avatar Updated",
        description: "New profile picture selected.",
      });
      setOpenDialog(false);
    } else {
      toast({
        title: "No Image Selected",
        description: "Please select an image before confirming.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="w-full min-h-[90vh] flex justify-center">
      <ScrollArea className="lg:w-1/2 md:w-3/4 w-full md:border h-[90vh] md:h-[85vh] rounded-lg md:mt-5 shadow-md p-6 flex flex-col overflow-y-auto">


        <h1 className="text-2xl font-semibold mb-4">Profile</h1>
        <div className="flex flex-col items-center mb-6">
          <div className="w-24 h-24 relative mb-2">
            {avatarPreview ? (
              <Avatar className="w-full h-full">
                <AvatarImage
                  src={avatarPreview}
                  alt="User Avatar"
                  className="w-full h-full object-cover"
                />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
            ) : (
              <Skeleton className="w-full h-full rounded-full" />
            )}
          </div>

          {isEditing && (
            <Dialog open={openDialog} onOpenChange={setOpenDialog}>
              <DialogTrigger asChild>
                <Button variant="outline" className="text-sm">
                  Edit Avatar
                </Button>
              </DialogTrigger>
              <DialogContent className="p-6">
                <DialogTitle>Upload Profile Picture</DialogTitle>
                <div
                  {...getRootProps()}
                  className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer"
                >
                  <input {...getInputProps()} />
                  {avatarPreview ? (
                    <Image
                      src={avatarPreview}
                      alt="Preview"
                      width={128}
                      height={128}
                      className="w-32 h-32 object-cover mx-auto rounded-full"
                      unoptimized
                    />
                  ) : (
                    <p>Drag & drop an image here, or click to select one</p>
                  )}
                </div>
                <DialogFooter className="mt-4">
                  <Button
                    variant="outline"
                    onClick={() => setOpenDialog(false)}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleConfirmAvatar}>Confirm</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4 p-6"
          >
            <FormField
              name="username"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input {...field} disabled />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input {...field} disabled />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              name="firstname"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={!isEditing} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              name="lastname"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={!isEditing} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              name="phone"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={!isEditing} />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-4">
              {isEditing ? (
                <>
                  <Button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    variant="outline"
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isUpdating}>
                    {isUpdating ? "Updating..." : "Save Changes"}
                  </Button>
                </>
              ) : (
                <Button type="button" onClick={() => setIsEditing(true)}>
                  Edit
                </Button>
              )}
            </div>
          </form>
        </Form>


      </ScrollArea>
    </div>
  );
}

export default ProfileContainer;
