import React, { useCallback, useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import { getUserAddresses } from "@/api/user/product/product";
import IUserAddress from "@/entities/user/IUserAddress";
import { useUserOrder } from "@/store/user/hooks/useUserOrder";
import AddAddressDialog from "../address/addAddressDialog";

interface Props {
  setPaymentButtonActive: (active: boolean) => void;
  // setSelectedAddressId: (address: string) => void;
}

const DeliveryAddressSection: React.FC<Props> = ({
  setPaymentButtonActive,
  // setSelectedAddressId,
}) => {
  const { updateAddress, orderItems } = useUserOrder();
  const [addresses, setAddresses] = useState<IUserAddress[]>([]);
  // const [isDialogOpen, setDialogOpen] = useState(false);
  // const [newAddress, setNewAddress] = useState<IUserAddress>({
  //   address_line1: "",
  //   address_line2: "",
  //   city: "",
  //   postal_code: "",
  //   state: "",
  //   phone: "",
  // });

  const fetchAddress = useCallback(async () => {
    try {
      const res = await getUserAddresses();
      const data: IUserAddress[] = res.data;
      setAddresses(data);
    } catch (error) {
      console.error("Error fetching addresses:", error);
    }
  }, []);

  useEffect(() => {
    fetchAddress();
  }, [fetchAddress]);

  const handleAddressChange = (value: string) => {
    console.log("Selected Address ID:", value);
    updateAddress(value);
    console.log(orderItems);

    // setSelectedAddressId(value);
    setPaymentButtonActive(true);
  };

  // const handleNewAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const { name, value } = e.target;
  //   setNewAddress((prev) => ({ ...prev, [name]: value }));
  // };

  // const handleAddAddress = async () => {
  //   try {
  //     const res = await addNewAddress(newAddress);
  //     setAddresses((prev) => [...prev, res.data]);
  //     setDialogOpen(false);
  //     setNewAddress({
  //       address_line1: "",
  //       address_line2: "",
  //       city: "",
  //       postal_code: "",
  //       state: "",
  //       phone: "",
  //     });
  //   } catch (error) {
  //     console.error("Error adding new address:", error);
  //   }
  // };

  return (
    <div className="mb-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium text-gray-700 mb-4">
          Select Delivery Address
        </h2>
        <AddAddressDialog onAddressAdded={fetchAddress} />
      </div>

      <RadioGroup
        className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-3"
        onValueChange={handleAddressChange}
      >
        {addresses.map((address) => (
          <Label
            key={address._id}
            htmlFor={address._id}
            className="tracking-wide border p-2 h-24 rounded-md flex flex-col justify-center items-start cursor-pointer shadow-sm hover:shadow-md transition-shadow text-sm overflow-hidden"
          >
            <RadioGroupItem value={address._id as string} id={address._id} />
            <span
              className="font-medium text-gray-800 w-full truncate"
              title={address.address_line1}
            >
              {address.address_line1}
            </span>
            <span className="w-full truncate" title={address.city}>
              {address.city}
            </span>
            <span
              className="text-xs text-gray-600 w-full truncate"
              title={`${address.postal_code}, ${address.phone}`}
            >
              {address.postal_code}, {address.phone}
            </span>
          </Label>
        ))}

        {/* <div
          onClick={() => setDialogOpen(true)}
          className="border p-2 h-20 rounded-md flex items-center justify-center cursor-pointer shadow-sm hover:shadow-md transition-shadow text-sm"
        >
          <span className="text-gray-500">+ Add New Address</span>
        </div> */}
      </RadioGroup>

      {/* Dialog for Adding New Address */}
      {/* <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Address</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <Input
              placeholder="Address Line 1"
              name="address_line1"
              value={newAddress.address_line1}
              onChange={handleNewAddressChange}
              required
            />
            <Input
              placeholder="Address Line 2"
              name="address_line2"
              value={newAddress.address_line2}
              onChange={handleNewAddressChange}
            />
            <Input
              placeholder="City"
              name="city"
              value={newAddress.city}
              onChange={handleNewAddressChange}
              required
            />
            <Input
              placeholder="State"
              name="state"
              value={newAddress.state}
              onChange={handleNewAddressChange}
              required
            />
            <Input
              placeholder="Postal Code"
              name="postal_code"
              value={newAddress.postal_code}
              onChange={handleNewAddressChange}
              required
            />
            <Input
              placeholder="Phone Number"
              name="phone"
              value={newAddress.phone}
              onChange={handleNewAddressChange}
              required
            />
          </div>
          <div className="flex justify-end space-x-3 mt-4">
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddAddress}>Save Address</Button>
          </div>
        </DialogContent>
      </Dialog> */}
    </div>
  );
};

export default DeliveryAddressSection;
