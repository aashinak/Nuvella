import { deleteUserAddress } from "@/api/user/userData/userData";
import { Button } from "@/components/ui/button";
import IUserAddress from "@/entities/user/IUserAddress";
import { useToast } from "@/hooks/use-toast";
import React, { useCallback } from "react";
import AddAddressDialog from "./addAddressDialog";

interface AddressCardProps {
  address: IUserAddress;
  onChange: () => void;
}

function AddressCard({ address, onChange }: AddressCardProps) {
  const { toast } = useToast();
  const handleDelete = useCallback(async () => {
    try {
      await deleteUserAddress(address._id as string);
      onChange();
    } catch (error) {
      if (error instanceof Error) {
        toast({
          title: "Error deleting address",
          description:
            error.message ||
            "An unexpected error occurred. Please try again later.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error deleting address",
          description: "An unexpected error occurred. Please try again later.",
          variant: "destructive",
        });
      }
    }
  }, [address._id, onChange, toast]);

  // const handleEdit = useCallback(async () => {}, []);
  return (
    <div className="border h-44 shadow-sm rounded-lg p-4 bg-white justify-between flex flex-col space-y-4">
      <div className="space-y-1">
        <p className="font-semibold text-lg truncate">
          {address.address_line1}
        </p>
        {address.address_line2 && (
          <p className="text-gray-500 text-sm truncate">
            {address.address_line2}
          </p>
        )}
        <p className="text-gray-700 text-sm">
          {address.city}, {address.state} - {address.postal_code}
        </p>
        <p className="text-gray-700 text-sm">{address.phone}</p>
      </div>
      <div className="flex justify-end gap-2">
        <AddAddressDialog onAddressAdded={onChange} initialData={address} />
        <Button
          variant="outline"
          className="text-sm px-4 py-1 hover:text-red-400 border-red-400 border text-red-400"
          onClick={handleDelete}
        >
          Delete
        </Button>
      </div>
    </div>
  );
}

export default AddressCard;
