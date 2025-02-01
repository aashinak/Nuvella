import React, { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getNewProducts } from "@/api/user/product/product";

interface Props {
  setSelectedDeal: (index: number) => void;
}

const SelectionBar: React.FC<Props> = ({ setSelectedDeal }) => {
  const options = ["Top Discounted", "New Arrivals", "Most Sold"];
  const [selected, setSelected] = useState(0);

  

  const handleClick = (index: number) => {
    setSelected(index); // Update selected state
    setSelectedDeal(index);
  };

  return (
    <div className="items-center gap-4 px-3 flex">
      {options.map((option, index) => (
        <motion.p
          key={index}
          className={`border px-3 font-bold py-2 text-xs md:text-base  rounded-md cursor-pointer ${
            selected === index
              ? "bg-black text-white scale-105"
              : "hover:bg-[#eeeded] text-black"
          }`}
          onClick={() => handleClick(index)}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            ease: "easeInOut",
          }}
        >
          {option}
        </motion.p>
      ))}
    </div>
  );
};

export default SelectionBar;
