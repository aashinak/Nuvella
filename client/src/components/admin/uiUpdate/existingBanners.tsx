import { EllipsisVertical } from "lucide-react";
import Image from "next/image";
import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { uiUpdateDelete } from "@/api/admin/ui/uiUpdates";
import { useToast } from "@/hooks/use-toast";
import { Banner } from "./uiUpdate";

// Define types for the props the component expects
interface ExistingBannersProps {
  updateId: string;
  heroImage: string;
  heroText: string;
  subText1: string;
  subText2: string;
  isPriority: boolean;
  setUiData: React.Dispatch<React.SetStateAction<Banner[]>>;
}

const ExistingBanners: React.FC<ExistingBannersProps> = ({
  setUiData,
  updateId,
  isPriority,
  heroImage,
  heroText,
  subText1,
  subText2,
}) => {
  const { toast } = useToast();
  const handleDelete = async () => {
    try {

       await uiUpdateDelete(updateId);
      toast({ title: "Successfully deleted banner" });
      setUiData((prev: Banner[]) => prev.filter((banner) => banner.id !== updateId));
      
    } catch {
      toast({ variant: "destructive", title: "Banner deletion failed" });
    }
  };
  return (
    <div className="w-full h-96 relative border-2 rounded-lg">
      <Image
        alt="coverImage"
        layout="fill"
        className="rounded-lg object-cover"
        src={heroImage} // Dynamically use the passed heroImage prop
        loading={isPriority ? "eager" : "lazy"} // Use "eager" for priority images
        {...(isPriority ? { priority: true } : {})}
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <EllipsisVertical className="text-white  right-3 border rounded-full w-8 h-8 p-1 hover:bg-white hover:text-black hover:opacity-30 cursor-pointer top-3 absolute" />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-24">
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={handleDelete}>
              <span className="text-red-600">Delete</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      <div className="absolute flex h-full flex-col justify-center p-16 gap-1 text-white font-bold">
        <input
          value={subText1} // Dynamically use the subText1 prop
          className="w-min text-2xl italic text-[#404040] bg-transparent p-3 rounded-lg"
          type="text"
          readOnly // To make the input readonly (assuming you don't want users to edit)
        />
        <input
          value={heroText} // Dynamically use the heroText prop
          className="w-min text-4xl bg-transparent p-3 rounded-lg"
          type="text"
          readOnly // To make the input readonly (assuming you don't want users to edit)
        />
        <input
          value={subText2} // Dynamically use the subText2 prop
          className="w-min text-2xl text-[#404040] bg-transparent p-3 rounded-lg italic"
          type="text"
          readOnly // To make the input readonly (assuming you don't want users to edit)
        />
      </div>
    </div>
  );
};

export default ExistingBanners;
