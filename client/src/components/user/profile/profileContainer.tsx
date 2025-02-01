"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton"; // ShadCN Skeleton component
import { useUserData } from "@/store/user/hooks/useUserData";

function ProfileContainer() {
  const { userData } = useUserData();

  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    username: "",
    email: "",
    phone: "",
    avatar: "",
  });
  const [isAvatarLoading, setIsAvatarLoading] = useState(false);

  useEffect(() => {
    if (userData) {
      setFormData({
        firstname: userData.firstname || "",
        lastname: userData.lastname || "",
        username: userData.username || "",
        email: userData.email || "",
        phone: userData.phone || "",
        avatar: userData.avatar || "",
      });
    }
  }, [userData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setIsAvatarLoading(true);
      const imageUrl = URL.createObjectURL(file); // Preview the image
      setFormData((prev) => ({ ...prev, avatar: imageUrl }));
      // Simulate image upload or process
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Mock delay
      setIsAvatarLoading(false);
      // Here, you would upload the file to your server or storage service
    }
  };

  const handleSubmit = () => {
    console.log("Updated Data:", formData);
    // Add your API call to update the user data here
  };

  return (
    <div className="w-full h-[90vh] flex justify-center items-center">
      <div className="lg:w-1/2 md:w-3/4 w-full h-auto border rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-semibold mb-4">Profile</h1>
        <div className="flex flex-col items-center mb-6">
          <div className="w-24 h-24 relative mb-4">
            {isAvatarLoading ? (
              <Skeleton className="w-full h-full rounded-full" />
            ) : (
              <Avatar className="w-full h-full">
                <AvatarImage
                  src={formData.avatar}
                  alt="User Avatar"
                  className="w-full h-full object-cover"
                />
                <AvatarFallback>
                  {formData.username.charAt(0).toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
            )}
          </div>
          <div className="relative">
            <Input
              id="avatar"
              type="file"
              accept="image/*"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              onChange={handleAvatarChange}
            />
            <Label className="cursor-pointer" htmlFor="avatar">
              <Button className="cursor-pointer" variant="outline">
                Change Avatar
              </Button>
            </Label>
          </div>
        </div>

        <form className="space-y-4 p-6">
          <div>
            <Label htmlFor="firstname">First Name</Label>
            <Input
              id="firstname"
              name="firstname"
              value={formData.firstname}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <Label htmlFor="lastname">Last Name</Label>
            <Input
              id="lastname"
              name="lastname"
              value={formData.lastname}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleInputChange}
            />
          </div>
          <Button onClick={handleSubmit} className="mt-4 w-full">
            Save Changes
          </Button>
        </form>
      </div>
    </div>
  );
}

export default ProfileContainer;
