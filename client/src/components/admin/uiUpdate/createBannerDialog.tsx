import React, { useState } from "react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useDropzone } from "react-dropzone";
import Image from "next/image";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { setUiUpdates } from "@/api/admin/ui/uiUpdates";
import { Banner } from "./uiUpdate";
import { AxiosError } from "axios";

// Validation Schema
const formSchema = z.object({
  heroText: z
    .string()
    .min(3, "Hero text must be at least 3 characters long.")
    .max(30, "Hero text cannot exceed 30 characters."),
  subText1: z
    .string()
    .min(3, "SubText1 must be at least 3 characters long.")
    .max(30, "SubText1 cannot exceed 30 characters."),
  subText2: z
    .string()
    .min(3, "SubText2 must be at least 3 characters long.")
    .max(30, "SubText2 cannot exceed 30 characters."),
});

interface Props {
  setIsDialogOpen: (value: boolean) => void;
  isDialogOpen: boolean;
  setUiData: React.Dispatch<React.SetStateAction<Banner[]>>;
}

function BannerCreateDialog({
  isDialogOpen,
  setIsDialogOpen,
  setUiData,
}: Props) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [heroImage, setHeroImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      heroText: "",
      subText1: "",
      subText2: "",
    },
  });

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
      "image/webp": [".webp"],
    },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      const uploadedFile = acceptedFiles[0];
      setHeroImage(uploadedFile);

      const previewUrl = URL.createObjectURL(uploadedFile);
      setImagePreview(previewUrl);
    },
  });

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setLoading(true);
      if (!heroImage) {
        toast({
          variant: "destructive",
          title: "Hero image is required.",
          description: "Please upload a hero image.",
        });
        setLoading(false);
        return;
      }
      const res = await setUiUpdates({
        heroImage,
        heroText: values.heroText,
        subText1: values.subText1,
        subText2: values.subText2,
      });
      console.log(res);
      setUiData(res.data as Banner[]);

      console.log(values);
      console.log(heroImage);
      setIsDialogOpen(false);
      setLoading(false);
      form.reset();
      setHeroImage(null);
      setImagePreview(null);
    } catch (error: unknown) {
      setLoading(false);
      console.error(error);

      let errorMessage = "An unexpected error occurred.";

      if (error instanceof AxiosError && error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: errorMessage,
      });
    }
  };

  const handleCancel = () => {
    setHeroImage(null);
    setImagePreview(null);
    form.reset();
    setIsDialogOpen(false);
  };

  return (
    <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Create New Banner</AlertDialogTitle>
          <AlertDialogDescription>
            Fill in all required fields to create a new banner.
          </AlertDialogDescription>
        </AlertDialogHeader>

        {/* Hero Image Upload */}
        <div className="w-full mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Upload Hero Image <span className="text-red-500">*</span>
          </label>
          <div
            {...getRootProps()}
            className="border-2 border-dashed p-4 min-h-40 flex justify-center items-center rounded-lg text-center cursor-pointer"
          >
            <input {...getInputProps()} />
            {heroImage ? (
              <div className="w-full">
                <p className="text-sm text-gray-600">{heroImage.name}</p>
                {imagePreview && (
                  <div className="mt-2 w-full h-48 relative">
                    <Image
                      src={imagePreview}
                      alt="Hero Preview"
                      layout="fill"
                      objectFit="cover"
                      className="rounded-lg w-full"
                    />
                  </div>
                )}
              </div>
            ) : (
              <p className="text-sm text-gray-400 text-center">
                Drag & drop an image here, or click to select
              </p>
            )}
          </div>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            <FormField
              control={form.control}
              name="heroText"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Hero Text <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      type="text"
                      placeholder="Great Sale is now live"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="subText1"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Sub Text 1 <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      type="text"
                      placeholder="# Festive season"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="subText2"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Sub Text 2 <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      type="text"
                      placeholder="Upto 20% off"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <AlertDialogFooter>
              <AlertDialogCancel
                className=""
                onClick={handleCancel}
                disabled={loading}
              >
                Cancel
              </AlertDialogCancel>
              {/* <Button
                className="w-full"
                onClick={handleCancel}
                disabled={loading}
              >
                Cancel
              </Button> */}
              <Button disabled={loading} className="w-full" type="submit">
                {loading ? "Submitting..." : "Submit"}
              </Button>
            </AlertDialogFooter>
          </form>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default BannerCreateDialog;
