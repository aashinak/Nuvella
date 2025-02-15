"use client";
import React, { useCallback, useEffect, useState } from "react";
import ExistingBanners from "./existingBanners";
import { Button } from "@/components/ui/button";
import { getUiUpdates } from "@/api/admin/ui/uiUpdates";
import { Skeleton } from "@/components/ui/skeleton";
import BannerCreateDialog from "./createBannerDialog";
import { motion, AnimatePresence } from "framer-motion"; // Import AnimatePresence

export interface Banner {
  id: string;
  heroImage: string;
  heroText: string;
  subText1: string;
  subText2: string;
}

function UiUpdate() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [uiData, setUiData] = useState<Banner[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchUiData = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await getUiUpdates();
      setUiData(res.data as Banner[]);
    } catch (error) {
      console.error("Error fetching UI updates:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUiData();
  }, [fetchUiData]);

  return (
    <div className="w-full min-h-full p-5">
      <h1 className="text-2xl font-semibold tracking-wide">Banners</h1>
      <div className="p-3 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium">Existing categories</h2>
          <Button onClick={() => setIsDialogOpen(true)} className="w-32">
            Create banner
          </Button>
        </div>
        <div className="grid grid-cols-1 2xl:grid-cols-2 gap-2 relative transition-all duration-500">
          {isLoading ? (
            <div className="w-full grid absolute grid-cols-1 2xl:grid-cols-2 gap-2">
              <Skeleton className="w-full h-96 p-10" />
              <Skeleton className="w-full h-96 p-10" />
              <Skeleton className="w-full h-96 p-10" />
              <Skeleton className="w-full h-96 p-10" />
            </div>
          ) : uiData?.length > 0 ? (
            <AnimatePresence>
              {uiData.map((banner, index) => (
                <motion.div
                  key={banner.id} // Unique key for each banner
                  initial={{ opacity: 0, y: 5 }} // Start with hidden and slightly moved
                  animate={{ opacity: 1, y: 0 }} // Animate to full opacity and original position
                  exit={{ opacity: 0, y: -5 }} // Exit with fade out and upward movement
                  transition={{ duration: 0.3 }} // Transition duration
                  layout // This enables layout animation
                >
                  <ExistingBanners
                    setUiData={setUiData}
                    updateId={banner.id}
                    heroImage={banner.heroImage}
                    heroText={banner.heroText}
                    subText1={banner.subText1}
                    subText2={banner.subText2}
                    isPriority={index < 4}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          ) : (
            <p>No banners found.</p>
          )}
        </div>
      </div>
      <BannerCreateDialog
        setUiData={setUiData}
        isDialogOpen={isDialogOpen}
        setIsDialogOpen={setIsDialogOpen}
      />
    </div>
  );
}

export default UiUpdate;
