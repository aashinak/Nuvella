import { Button } from "@/components/ui/button";
import ProductPageContainer from "@/components/user/productPage/productPageContainer";
import React from "react";

function page({ params }) {
  const productId: string = params.productId;
  return (
    // <div className="flex-grow w-full  p-9 flex gap-2">
    //   {/* image section */}
    //   <div className="w-1/2 flex-grow gap-2 rounded-lg border p-4 flex flex-col">
    //     <div className="w-full h-4/5 border rounded-md"></div>
    //     <div className="w-full h-1/5  rounded-md gap-3 grid grid-cols-4">
    //       <div className="border rounded-md"></div>
    //       <div className="border rounded-md"></div>
    //       <div className="border rounded-md"></div>
    //       <div className="border rounded-md"></div>
    //     </div>
    //   </div>
    //   {/* product section */}
    //   <div className="w-1/2 flex-grow p-14 rounded-lg flex flex-col gap-6">
    //     <h1 className="text-4xl">Premium Black Executive Shoes for Men</h1>
    //     <p className="text-base text-gray-700 leading-relaxed tracking-wide w-11/12">
    //       Elevate your everyday style with these timeless black executive shoes,
    //       designed for ultimate comfort and versatility. Made from high-quality
    //       materials, they offer all-day support and durability. Whether you're
    //       at work, a formal event, or just out with friends, these shoes
    //       complement any outfit. Featuring a sleek design and superior
    //       craftsmanship, these shoes are a must-have for the modern man.
    //       Available in various sizes to ensure the perfect fit. Pair them with
    //       formal wear or casual attire for a polished, stylish look that lasts.
    //     </p>
    //     <div className="flex gap-2 flex-col">
    //       <h2 className="font-semibold">Select Size</h2>
    //       <div className="w-full flex gap-2">
    //         <div className="py-2 px-6 rounded-md border bg-black text-white cursor-pointer">S</div>
    //         <div className="py-2 px-6 rounded-md border">M</div>
    //         <div className="py-2 px-6 rounded-md border">L</div>
    //         <div className="py-2 px-6 rounded-md border">XL</div>
    //         <div className="py-2 px-6 rounded-md border bg-[#d3d3d3] text-white cursor-not-allowed">2XL</div>
    //       </div>
    //     </div>
    //     <div className="flex gap-2">
    //       <Button className="">Add to cart</Button>
    //       <Button variant={"outline"}>Share</Button>
    //     </div>
    //   </div>
    // </div>
    <ProductPageContainer productId={productId} />
  );
}

export default page;
