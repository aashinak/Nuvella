"use client";
import { deleteCategory } from "@/api/admin/product/product";
import ICategory from "@/entities/ICategory";
import { useToast } from "@/hooks/use-toast";
import { useCategoryData } from "@/store/hooks/useCategoryData";
import { Edit, Trash2 } from "lucide-react";
import Image from "next/image";
import React, { useCallback } from "react";

interface CategoryCardProps {
  data: ICategory;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ data }) => {
  const { removeCategory } = useCategoryData();
  const { toast } = useToast();
  const handleDelete = useCallback(async () => {
    try {

      
      const res = await deleteCategory(data._id);
      if (res.success) {
        removeCategory(data._id);
        toast({ title: "Category deleted" });
      }
    } catch (error) {
      toast({ variant: "destructive", title: "Category deletion failed" });
    }
  }, [data._id, removeCategory, toast]);
  return (
    // <div className="px-5 py-2 border rounded-md flex items-center justify-between gap-4 hover:bg-[#f9f9f9] bg-[#f5f5f5] transition-all delay-300  basis-1/4 flex-auto">
    <div className="px-5 py-2 h-24 border rounded-md flex items-center justify-between gap-4 hover:bg-[#f9f9f9] bg-[#f5f5f5] transition-all delay-300 ">
      <div className="flex items-center gap-3">
        <div className="relative w-16 h-16">
          <Image
            className="rounded-full object-cover"
            layout="fill"
            alt="categoryImage"
            src={data.image}
          />
        </div>

        <p className="font-semibold">{data.name}</p>
      </div>
      <div className="flex gap-4 h-full justify-center items-center">
        <Edit className="text-[#707070] cursor-pointer" />
        <Trash2
          onClick={handleDelete}
          className="text-red-600 cursor-pointer"
        />
      </div>
    </div>
  );
};

export default CategoryCard;
