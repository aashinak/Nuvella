import React, { useState, useEffect, useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { useDropzone } from "react-dropzone";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCategoryData } from "@/store/hooks/useCategoryData";
import {
  createDiscount,
  createProduct,
  getProductDiscounts,
} from "@/api/admin/product/product";
import IProduct from "@/entities/IProduct";
import { ScrollArea } from "@/components/ui/scroll-area";
import IProductDiscount from "@/entities/IProductDiscount";

// Validation Schema
const formSchema = z.object({
  name: z.string().min(3, "Product name must be at least 3 characters."),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters."),
  price: z.string().regex(/^[0-9]+(\.[0-9]{1,2})?$/, "Enter a valid price."),
  stock: z.number().min(0, "Stock must be at least 0."),
  sizes: z.array(
    z.object({
      size: z.string().min(1, "Size is required."),
      stock: z.number().min(0, "Stock for size cannot be negative."),
    })
  ),
  categoryId: z.string(),

  discountId: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, "Invalid discount ID format."),
});

interface Props {
  isDialogOpen: boolean;
  setIsDialogOpen: (value: boolean) => void;
}

const CreateProductDialog = ({ isDialogOpen, setIsDialogOpen }: Props) => {
  const { toast } = useToast();
  const [discountData, setDiscountData] = useState<IProductDiscount[]>([]);
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [activeSizes, setActiveSizes] = useState<Record<string, number>>({});
  const { categoryData } = useCategoryData();
  const [isCreateDiscountOpen, setIsCreateDiscountOpen] = useState(false);
  const [discountName, setDiscountName] = useState<string>("");
  const [discountPercentage, setDiscountPercentage] = useState<number>(0);

  const sizes = ["S", "M", "L", "XL", "2XL"]; // Define available sizes

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      price: "",
      stock: 0,
      sizes: [],
      categoryId: "",
      discountId: undefined,
    },
  });

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
      "image/webp": [".webp"],
    },
    onDrop: (acceptedFiles) => {
      setFiles([...files, ...acceptedFiles]);
      const previews = acceptedFiles.map((file) => URL.createObjectURL(file));
      setImagePreviews([...imagePreviews, ...previews]);
    },
  });

  // Toggle size activation
  const toggleSize = (size: string) => {
    setActiveSizes((prev) => {
      const updatedSizes = { ...prev };
      if (updatedSizes[size] !== undefined) {
        delete updatedSizes[size];
      } else {
        updatedSizes[size] = 0; // Default stock count
      }
      return updatedSizes;
    });
  };

  // Handle stock change for a specific size
  const handleSizeStockChange = (size: string, value: number) => {
    setActiveSizes((prev) => ({
      ...prev,
      [size]: value,
    }));
  };

  // fetch discount details
  useEffect(() => {
    const fetchDiscount = async () => {
      try {
        const response = await getProductDiscounts();
        console.log(response);
        setDiscountData(response.data);
      } catch (error) {}
    };
    fetchDiscount();
  }, []);

  // Update the stock field dynamically based on active sizes
  useEffect(() => {
    if (Object.keys(activeSizes).length > 0) {
      // If there are active sizes, update the sizes field
      const updatedSizes = Object.entries(activeSizes).map(([size, stock]) => ({
        size,
        stock,
      }));
      form.setValue("sizes", updatedSizes); // Set the sizes field

      // Update stock with the total stock
      const totalStock = updatedSizes.reduce(
        (acc, { stock }) => acc + stock,
        0
      );
      form.setValue("stock", totalStock); // Update stock with total value
    } else {
      // If no sizes are selected, reset stock to 0
      form.setValue("sizes", []);
      form.setValue("stock", 0); // Reset stock to 0
    }
  }, [activeSizes, form]);

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log(values);

    try {
      if (files.length === 0) {
        toast({
          variant: "destructive",
          title: "Images required",
          description: "Please upload at least one image for the product.",
        });
        return;
      }

      setLoading(true);

      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("description", values.description);
      formData.append("price", values.price);
      formData.append("stock", values.stock.toString());
      formData.append("categoryId", values.categoryId);
      formData.append("discountId", values.discountId);

      console.log(activeSizes);

      if (Object.keys(activeSizes).length > 0) {
        // Initialize an array to hold the size and stock objects
        const sizesArray = [];

        Object.entries(activeSizes).forEach(([size, stock], index) => {
          // Add each size and stock pair to the array
          sizesArray.push({ size, stock: stock.toString() });
        });

        // Append the stringified array of sizes to the form data
        formData.append("sizes", JSON.stringify(sizesArray));
      }

      files.forEach((file) => formData.append("images", file));

      const res = await createProduct(formData);
      if (res.success) {
        toast({
          title: "Product Created",
          description: "Product has been successfully created.",
        });
        form.reset();
        setFiles([]);
        setImagePreviews([]);
        setActiveSizes({});
        setIsDialogOpen(false);
      }

      // Submit data here
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Unable to create product. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const createDiscountHandler = useCallback(async () => {
    try {
      const response = await createDiscount({
        name: discountName,
        discount_percentage: discountPercentage,
      });
      toast({
        title: "Discount Created",
        description: "Discount has been successfully created.",
      });
      setDiscountData((prev) => [...prev, response.discount]);
      setIsCreateDiscountOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Unable to create discount. Please try again.",
      });
      console.error("Error creating discount", error);
    }
  }, [discountName, discountPercentage, toast]);

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogContent className="h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle>Create New Product</DialogTitle>
          <DialogDescription>
            Fill in the details to create a new product.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="p-2  h-full">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-4 p-2"
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Name</FormLabel>
                    <Input placeholder="Enter product name" {...field} />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <Textarea
                      placeholder="Enter product description"
                      {...field}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price</FormLabel>
                    <Input placeholder="Enter price" {...field} />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="categoryId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select
                      value={field.value} // Control the value of Select
                      onValueChange={(value) => {
                        form.setValue("categoryId", value); // Set the value in form state
                      }}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Categories" />
                      </SelectTrigger>
                      <SelectContent>
                        {categoryData && categoryData.length > 0
                          ? categoryData.map((category) => (
                              <SelectItem
                                key={category._id}
                                value={category._id}
                              >
                                {category.name}
                              </SelectItem>
                            ))
                          : null}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-between items-end">
                <FormField
                  control={form.control}
                  name="discountId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Discount</FormLabel>
                      <Select
                        value={field.value} // Control the value of Select
                        onValueChange={(value) => {
                          form.setValue("discountId", value); // Set the value in form state
                        }}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Discounts" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {discountData && discountData.length > 0
                              ? discountData.map((discount) => (
                                  <SelectItem
                                    key={discount._id}
                                    value={discount._id as string}
                                  >
                                    {discount.name} -{" "}
                                    {discount.discount_percentage}%
                                  </SelectItem>
                                ))
                              : null}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="button"
                  onClick={() => setIsCreateDiscountOpen(true)}
                  variant={"secondary"}
                >
                  Create discount
                </Button>
              </div>
              {isCreateDiscountOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                  className="border rounded-md p-2 space-y-4"
                >
                  <div className="flex justify-end items-center">
                    <Button
                      variant={"ghost"}
                      type="button"
                      onClick={() => setIsCreateDiscountOpen(false)}
                    >
                      X
                    </Button>
                  </div>
                  <Input
                    value={discountName}
                    onChange={(e) => setDiscountName(e.target.value)}
                    placeholder="Discount Name"
                  />
                  <Input
                    value={discountPercentage}
                    onChange={(e) =>
                      setDiscountPercentage(Number(e.target.value))
                    }
                    placeholder="Discount Percentage (in percentage)"
                  />
                  <Button
                    onClick={createDiscountHandler}
                    className=""
                    type="button"
                  >
                    Create Discount
                  </Button>
                </motion.div>
              )}

              <FormField
                control={form.control}
                name="stock"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Stock</FormLabel>
                    <Input
                      type="number"
                      placeholder="Enter stock quantity"
                      {...field}
                      disabled={Object.keys(activeSizes).length > 0} // Disable when sizes are active
                      onChange={(e) =>
                        field.onChange(Number(e.target.value) || 0)
                      }
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Sizes */}
              <div>
                <label className="block font-medium">Sizes</label>
                <div className="flex p-1 space-x-2 my-2">
                  {sizes.map((size) => (
                    <div
                      key={size}
                      className={`px-2 cursor-pointer rounded-lg ${
                        activeSizes[size] !== undefined
                          ? "bg-black text-white"
                          : "border text-black"
                      }`}
                      onClick={() => toggleSize(size)}
                    >
                      {size}
                    </div>
                  ))}
                </div>
                {Object.keys(activeSizes).map((size) => (
                  <FormItem key={size} className="mt-2">
                    <FormLabel>{`${size} Stock`}</FormLabel>
                    <Input
                      type="number"
                      placeholder={`Enter stock for ${size}`}
                      value={activeSizes[size]}
                      onChange={(e) =>
                        handleSizeStockChange(size, Number(e.target.value) || 0)
                      }
                    />
                  </FormItem>
                ))}
              </div>

              {/* File Upload */}
              <div>
                <label>Upload Images</label>
                <div
                  {...getRootProps()}
                  className="border-dashed border-2 rounded-lg p-4 text-center cursor-pointer"
                >
                  <input {...getInputProps()} />
                  <p>Drag & drop files here, or click to upload</p>
                </div>
                {imagePreviews.length > 0 && (
                  <div className="mt-2 grid grid-cols-5 gap-2">
                    {imagePreviews.map((src, index) => (
                      <div key={index} className="relative w-full h-32">
                        <Image
                          src={src}
                          alt={`Preview ${index + 1}`}
                          layout="fill"
                          objectFit="cover"
                          className="rounded-lg"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Submit Button inside the form */}
              <DialogFooter className="flex-shrink-0">
                <Button
                  variant="outline"
                  onClick={() => {
                    form.reset();
                    setFiles([]);
                    setImagePreviews([]);
                    setActiveSizes({});
                    setIsDialogOpen(false);
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? "Creating..." : "Create Product"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default CreateProductDialog;
