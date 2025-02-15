import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import ICategory from "@/entities/user/ICategory";
import { useRouter } from "next/navigation";

interface CategoryCardsProps {
  data: ICategory;
}

function CategoryCards({ data }: CategoryCardsProps) {
  const router = useRouter();
  return (
    <motion.div
      whileHover={{ scale: 1.1 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="flex flex-col items-center gap-2 cursor-pointer"
      onClick={() => router.push(`/search/category/${data._id}`)}
    >
      <div className="border w-32 h-32 rounded-md md:rounded-full relative md:shadow-2xl">
        <Image
          priority
          sizes="500px"
          quality={90}
          loading="eager"
          fill
          className="object-cover rounded-md md:rounded-full"
          alt="categoryImage"
          src={data.image}
        />
      </div>
      <p className="font-bold font-sans">{data.name}</p>
    </motion.div>
  );
}

export default CategoryCards;
