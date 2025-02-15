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
import { Input } from "@/components/ui/input";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { createCategory } from "@/api/admin/product/product";
import { useCategoryData } from "@/store/hooks/useCategoryData";

// Validation Schema
const formSchema = z.object({
  categoryName: z
    .string()
    .min(3, "Category name must be at least 3 characters.")
    .max(20, "Category name cannot exceed 20 characters.")
    .regex(
      /^[a-zA-Z\s]+$/,
      "Category name can only contain letters and spaces."
    ),
});

interface Props {
  setIsDialogOpen: (value: boolean) => void;
  isDialogOpen: boolean;
}

function CreateCategoryDialog({ isDialogOpen, setIsDialogOpen }: Props) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const { addCategory } = useCategoryData();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      categoryName: "",
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
      setFile(uploadedFile);
      const previewUrl = URL.createObjectURL(uploadedFile);
      setImagePreview(previewUrl);
    },
  });

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      if (!file) {
        toast({
          variant: "destructive",
          title: "Image is required.",
          description: "Please upload an image for the category.",
        });
        return;
      }

      setLoading(true);
      const res = await createCategory({
        name: values.categoryName,
        categoryImage: file,
      });
      if (res.success) {
        addCategory(res.newCategory);
      }

      toast({
        title: "Category created!",
        description: "The category has been successfully created.",
      });

      setIsDialogOpen(false);
      form.reset();
      setFile(null);
      setImagePreview(null);
    } catch {
      toast({
        variant: "destructive",
        title: "Error creating category",
        description: "Something went wrong. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFile(null);
    setImagePreview(null);
    form.reset();
    setIsDialogOpen(false);
  };

  return (
    <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Create New Category</AlertDialogTitle>
          <AlertDialogDescription>
            Fill in the fields below to create a new category.
          </AlertDialogDescription>
        </AlertDialogHeader>

        {/* File Upload */}
        <div className="w-full mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Upload Image <span className="text-red-500">*</span>
          </label>
          <div
            {...getRootProps()}
            className="border-2 border-dashed p-4 min-h-40 rounded-lg text-center cursor-pointer flex justify-center items-center"
          >
            <input {...getInputProps()} />
            {file ? (
              <div className="w-full">
                <p className="text-sm text-gray-600">{file.name}</p>
                {imagePreview && (
                  <div className="mt-2 w-full h-48 relative">
                    <Image
                      src={imagePreview}
                      alt="Preview"
                      layout="fill"
                      objectFit="cover"
                      className="rounded-lg w-full"
                    />
                  </div>
                )}
              </div>
            ) : (
              <p className="text-sm text-gray-400 ">
                Drag & drop an image here, or click to select one.
              </p>
            )}
          </div>
        </div>

        {/* Form */}
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            <FormField
              control={form.control}
              name="categoryName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Category Name <span className="text-red-500">*</span>
                  </FormLabel>
                  <Input
                    disabled={loading}
                    placeholder="Enter category name"
                    {...field}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            <AlertDialogFooter>
              <AlertDialogCancel onClick={handleCancel} disabled={loading}>
                Cancel
              </AlertDialogCancel>
              <Button type="submit" disabled={loading}>
                {loading ? "Loading..." : "Submit"}
              </Button>
            </AlertDialogFooter>
          </form>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default CreateCategoryDialog;
