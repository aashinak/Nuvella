import Image from "next/image";
import React, { useState } from "react";

interface ImageContainerProps {
  images: string[]; // Array of image URLs
}

const ImageContainer: React.FC<ImageContainerProps> = ({ images }) => {
  const [mainImage, setMainImage] = useState(images[0] || ""); // Fallback for empty array

  if (!images || images.length === 0) {
    return <div className="text-center">No images available</div>;
  }

  return (
    <div className="w-full md:w-1/2 sm:min-h-[90vh] gap-4 rounded-lg border p-4 flex flex-col">
      {/* Main Image */}
      <div className="w-full h-96  lg:h-4/5 border rounded-md relative">
        <Image
          priority
          fill
          className="object-cover rounded-md"
          alt="productImage"
          src={mainImage}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>

      {/* Thumbnail Images */}
      <div className="w-full flex gap-3 overflow-x-auto">
        {images.map((image, index) => (
          <div
            key={index}
            className={`w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-lg relative cursor-pointer ${
              mainImage === image
                ? "shadow-2xl border-4 border-[#959595]"
                : "border border-gray-300"
            }`}
            onClick={() => setMainImage(image)} // Set clicked image as the main image
          >
            <Image
              priority
              fill
              className="object-cover rounded-sm"
              alt={`Thumbnail ${index + 1}`}
              src={image}
              sizes="(max-width: 768px) 25vw, (max-width: 1200px) 12.5vw, 8vw"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageContainer;
