import ProductPageContainer from "@/components/user/productPage/productPageContainer";
import React from "react";

interface PageProps {
  params: { productId: string };
}

async function Page({ params }: PageProps) {
  const { productId } = params;

  return <ProductPageContainer productId={productId} />;
}

export default Page;
