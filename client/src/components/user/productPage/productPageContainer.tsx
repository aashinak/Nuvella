"use client";
import { useCallback, useEffect, useState } from "react";
import ImageContainer from "./imageContainer";
import ProductDetailsContainer from "./productDetailsContainer";
import { getProductById } from "@/api/user/product/product";
import IProduct from "@/entities/user/IProduct";

interface ProductPageContainerProps {
  productId: string;
}

const ProductPageContainer: React.FC<ProductPageContainerProps> = ({
  productId,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [productData, setProductData] = useState<IProduct | null>(null); // Change to IProduct

  const fetchProductData = useCallback(async () => {
    try {
      const res = await getProductById(productId);
      setProductData(res.data); // Assuming res.data is an IProduct
      console.log(res);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    fetchProductData();
  }, [fetchProductData]);

  return (
    <div className="flex-grow w-full lg:p-9 flex flex-col lg:flex-row gap-2">
      {isLoading ? (
        <div className="flex justify-center items-center w-full h-full">
          {/* Spinner during loading */}
          <div className="spinner">loading</div>
        </div>
      ) : (
        productData && (
          <>
            {/* Ensure ImageContainer receives the correct property */}
            <ImageContainer images={productData.images} />{" "}
            {/* Assuming 'images' is a property */}
            {/* Passing productData to ProductDetailsContainer */}
            <ProductDetailsContainer product={productData} />{" "}
            {/* Assuming ProductDetailsContainer expects 'product' */}
          </>
        )
      )}
    </div>
  );
};

export default ProductPageContainer;
