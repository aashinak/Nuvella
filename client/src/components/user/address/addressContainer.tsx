"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import React, { useCallback, useEffect, useState } from "react";
import AddressCard from "./addressCard";
import IUserAddress from "@/entities/user/IUserAddress";
import { getUserAddresses } from "@/api/user/userData/userData";
import { useToast } from "@/hooks/use-toast";
import AddAddressDialog from "./addAddressDialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { motion } from "framer-motion";

function AddressContainer() {
  const [addresses, setAddresses] = useState<IUserAddress[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const { toast } = useToast();

  const fetchUserAddress = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getUserAddresses();
      const data: IUserAddress[] = res.data;
      setAddresses(data);
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "An unexpected error occurred. Please try again later.";
      toast({
        title: "Error fetching addresses",
        description: errorMessage,
        variant: "destructive",
        action: (
          <Button
            variant="ghost"
            onClick={fetchUserAddress}
          >
            Retry
          </Button>
        ),
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchUserAddress();
  }, [fetchUserAddress]);

  const filteredAddresses = addresses.filter((address) =>
    address.address_line1.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full min-h-[90vh] flex justify-center">
      <ScrollArea className="xl:w-1/2 lg:w-3/4 w-full md:border h-[90vh] md:h-[85vh] rounded-lg md:mt-5 shadow-md p-6 flex flex-col overflow-y-auto">
        <h1 className="text-2xl font-semibold">Address</h1>

        <div className="flex justify-between items-center mt-2">
          <Button
            variant="ghost"
            onClick={fetchUserAddress}
            disabled={loading}
            className="flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </Button>
          <AddAddressDialog onAddressAdded={fetchUserAddress}/>
            
        </div>

        <input
          type="text"
          placeholder="Search addresses..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-2 border rounded-lg mb-4 mt-4"
        />

        {loading ? (
          <div className="mt-4 grid md:grid-cols-2 lg:grid-cols-3 gap-3">
            {[1, 2, 3].map((_, index) => (
              <Skeleton key={index} className="h-32 w-full rounded-lg" />
            ))}
          </div>
        ) : (
          <div className="mt-4 grid md:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredAddresses.length > 0 ? (
              filteredAddresses.map((address) => (
                <motion.div
                  key={address._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <AddressCard
                    onChange={fetchUserAddress}
                    address={address}
                  />
                </motion.div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center mt-8">
                
                <p className="mt-4 text-gray-500">No addresses found.</p>
              </div>
            )}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}

export default React.memo(AddressContainer);