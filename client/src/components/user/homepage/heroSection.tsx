import React, { useCallback, useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { getBanners } from "@/api/user/ui/bannerData";
import IBanner from "@/entities/user/IBanner";
import { Skeleton } from "@/components/ui/skeleton";
import dynamic from "next/dynamic";

const CategorySection = dynamic(() => import("./categorySection"), {
  loading: () => <Skeleton className="w-full h-[300px]" />,
});

const SkeletonCarousel = () => (
  <div className="w-full h-[500px] relative">
    <Skeleton className="w-full h-full rounded-lg" />
    <div className="absolute inset-0 flex flex-col justify-center gap-4 px-6 lg:px-28">
      <Skeleton className="h-6 w-1/2 lg:w-1/3" />
      <Skeleton className="h-12 w-3/4 lg:w-1/2" />
      <Skeleton className="h-10 w-2/3 lg:w-1/3" />
    </div>
  </div>
);

function HeroSection() {
  const [bannerData, setBannerData] = useState<IBanner[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const plugin = React.useRef(
    Autoplay({ delay: 8000, stopOnInteraction: false })
  );

  const fetchBanners = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await getBanners();
      setBannerData(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBanners();
  }, [fetchBanners]);

  const carouselItems = useMemo(() => {
    return bannerData.map((banner, index) => {
      return (
        <CarouselItem key={index}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="absolute w-full h-[700px] md:h-[500px] px-6 lg:px-28 flex z-10 text-white flex-col justify-center gap-2"
          >
            {/* Text Content */}
            <div className="relative z-10">
              <h2
                className="text-xl sm:text-2xl md:text-3xl italic text-[#f0f0f0] font-bold tracking-wide"
                style={{ textShadow: "2px 2px 8px rgba(0, 0, 0, 0.6)" }}
              >
                {banner.subText1}
              </h2>

              <h1 style={{ textShadow: "2px 2px 8px rgba(0, 0, 0, 0.6)" }} className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight">
                {banner.heroText}
              </h1>
              <h2 style={{ textShadow: "2px 2px 8px rgba(0, 0, 0, 0.6)" }} className="text-3xl sm:text-4xl md:text-5xl font-medium">
                {banner.subText2}
              </h2>
            </div>
          </motion.div>

          {/* Image */}
          <Image
            priority={index === 0}
            loading={index === 0 ? "eager" : "lazy"}
            alt={`Banner ${index + 1}`}
            width={2000}
            height={2000}
            className="rounded-lg w-full h-[700px] md:h-[500px] object-cover brightness-75"
            src={banner?.heroImage}
          />
        </CarouselItem>
      );
    });
  }, [bannerData]);

  return (
    <div className="p-5 flex flex-col gap-3 relative">
      {isLoading ? (
        <SkeletonCarousel />
      ) : (
        <Carousel
          plugins={[plugin.current]}
          aria-label="Hero Banner Carousel"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <CarouselContent>{carouselItems}</CarouselContent>
        </Carousel>
      )}
      <CategorySection />
    </div>
  );
}

export default HeroSection;
