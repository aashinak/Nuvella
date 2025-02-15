import { deleteProduct } from "@/api/admin/product/product";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import IProduct from "@/entities/IProduct";
import { useToast } from "@/hooks/use-toast";
import { EllipsisVertical } from "lucide-react";
import Image from "next/image";
import React, { useCallback, useState } from "react";
import CreateProductDialog from "./createProductDialog";
import { Button } from "@/components/ui/button";

interface ProductCardProps {
  data: IProduct;
  fetchProductData: () => void;
}
const ProductCard: React.FC<ProductCardProps> = ({
  data,
  fetchProductData,
}) => {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  const handleDelete = useCallback(async () => {
    try {
      const res = await deleteProduct(data._id as string);
      if (res.success) {
        fetchProductData();
      }
      toast({ title: "Prodcut deleted" });
    } catch (error: unknown) {
      let errorMessage = "An unexpected error occurred.";

      if (error instanceof Error) {
        errorMessage = error.message;
      }

      toast({
        title: "Product deletion failed",
        description: errorMessage,
        variant: "destructive",
      });
    }
  }, [data._id, fetchProductData, toast]);

  return (
    <div className="px-3 relative cursor-pointer py-2 border rounded-md flex items-center justify-between gap-4 hover:bg-[#f9f9f9] bg-[#f5f5f5] transition-all delay-300 ">
      <CreateProductDialog
        isDialogOpen={isDialogOpen}
        setIsDialogOpen={setIsDialogOpen}
        productData={data}
      />
      <Button
        className="absolute z-10 left-4 top-3 text-yellow-400 font-semibold"
        onClick={() => setIsDialogOpen(true)}
      >
        Edit
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <EllipsisVertical className="text-white z-10  right-4 border rounded-full w-8 h-8 p-1 hover:bg-white hover:text-black hover:opacity-30 cursor-pointer top-3 absolute" />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-24">
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={handleDelete}>
              <span className="text-red-600">Delete</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      <div className="flex  flex-col gap-3 w-full">
        <div className="relative w-full h-48">
          <Image
            className=" object-cover rounded-sm"
            layout="fill" // This makes the image fill the container
            alt="categoryImage"
            src={data.images[0]}
          />
        </div>

        <p className="font-semibold">{data.name}</p>
      </div>
      {/* <div className="flex gap-4 h-full justify-center items-center">
        <Edit className="text-[#707070]" />
        <Trash2 className="text-red-600" />
      </div> */}
    </div>
  );
};

export default ProductCard;
