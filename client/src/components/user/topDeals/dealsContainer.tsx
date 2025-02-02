import React, { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import SelectionBar from "./selectionBar";
import IProduct from "@/entities/user/IProduct";
import { getNewProducts, getTopSellingProducts } from "@/api/user/product/product";
import ProductCard from "../productSearch/productCard";

function DealsContainer() {
  const [selectedDeal, setSelectedDeal] = useState<number>(0);
  const [products, setProducts] = useState<IProduct[]>([]);

  const fetchProducts = useCallback(async () => {
    try {
      if (selectedDeal === 0) {
        const res = await getNewProducts();
        console.log(res);
        const data: IProduct[] = res.products;
        setProducts(data);
      } else if(selectedDeal === 2) {
        const res = await getTopSellingProducts();
        console.log(res);
        const data: IProduct[] = res.products;
        setProducts(data);
      }
    } catch (error) {}
  }, [selectedDeal]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return (
    <motion.div
      className="w-full h-[90vh] md:p-6"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="w-full h-full border rounded-lg md:p-16 p-1 flex flex-col ">
        <div className="flex w-full justify-between h-[5vh] items-center">
          <h2 className="md:text-2xl text-sm font-bold">Top Deals</h2>
          <SelectionBar setSelectedDeal={setSelectedDeal} />
        </div>

        <div className="mt-10 p-5 overflow-x-auto md:overflow-x-visible">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 flex-nowrap">
            {products.map((product, index) => (
              <ProductCard key={index} product={product} />
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default DealsContainer;
