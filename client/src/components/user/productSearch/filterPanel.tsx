"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import IProduct from "@/entities/user/IProduct";

interface FilterPanelProps {
  products: IProduct[];
}

const FilterPanel: React.FC<FilterPanelProps> = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Parse existing URL params or use defaults
  const [inStock, setInStock] = useState(
    searchParams.get("inStock") === "true"
  );
  const [priceRange, setPriceRange] = useState({
    min: Number(searchParams.get("minPrice")) || 0,
    max: Number(searchParams.get("maxPrice")) || 5000,
  });
  const [selectedSizes, setSelectedSizes] = useState<string[]>(
    searchParams.get("sizes")?.split(",") || []
  );

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();

    if (inStock) params.set("inStock", "true");
    if (priceRange.min > 0 || priceRange.max < 5000) {
      params.set("minPrice", String(priceRange.min));
      params.set("maxPrice", String(priceRange.max));
    }
    if (selectedSizes.length) params.set("sizes", selectedSizes.join(","));

    router.push(`?${params.toString()}`, { scroll: false });
  }, [inStock, priceRange, selectedSizes, router]);

  // Handlers
  const handleInStockChange = () => setInStock((prev) => !prev);

  const handlePriceChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "min" | "max"
  ) => {
    setPriceRange((prev) => ({ ...prev, [type]: Number(e.target.value) }));
  };

  const handleSizeChange = (size: string) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  return (
    <div className="w-1/5 max-h-screen flex justify-center">
      <div className="w-5/6 h-5/6 rounded-xl border mt-4 shadow-lg p-4 bg-white">
        <h1 className="text-2xl font-semibold text-gray-800">Filters</h1>

        <div className="mt-4 flex flex-col gap-4 text-gray-700">
          {/* In-stock Checkbox */}
          <div className="flex items-center gap-3 hover:bg-gray-100 p-2 rounded-md transition">
            <Checkbox
              id="inStock"
              checked={inStock}
              onCheckedChange={handleInStockChange}
            />
            <label htmlFor="inStock" className="cursor-pointer text-lg">
              In stock
            </label>
          </div>

          {/* Sort by Price */}
          <p className="font-semibold text-lg">Sort by price</p>
          <div className="flex items-center gap-3">
            <Input
              type="number"
              value={priceRange.min}
              onChange={(e) => handlePriceChange(e, "min")}
              className="w-20 h-10 px-3 rounded-lg border-gray-300 focus:ring-2 focus:ring-gray-400"
            />
            <span className="text-lg">-</span>
            <Input
              type="number"
              value={priceRange.max}
              onChange={(e) => handlePriceChange(e, "max")}
              className="w-20 h-10 px-3 rounded-lg border-gray-300 focus:ring-2 focus:ring-gray-400"
            />
          </div>

          {/* Sort by Available Sizes */}
          <p className="font-semibold text-lg">Sort by sizes</p>
          <div className="flex flex-col gap-2">
            {["S", "M", "L", "XL", "2XL"].map((size) => (
              <div
                key={size}
                className="flex items-center gap-3 hover:bg-gray-100 p-2 rounded-md transition"
              >
                <Checkbox
                  id={size}
                  checked={selectedSizes.includes(size)}
                  onCheckedChange={() => handleSizeChange(size)}
                />
                <label htmlFor={size} className="cursor-pointer text-lg">
                  {size}
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;
