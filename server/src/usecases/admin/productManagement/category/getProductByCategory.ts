import productRepository from "../../../../repository/product/productRepository";
import ApiError from "../../../../utils/apiError";

const getProductByCategory = async (categoryId: string) => {
  const categories = await productRepository.findProductsByCategory(categoryId);
  if (!categories) {
    throw new ApiError(400, "Couldn't find products");
  }

  return { message: "Products fetched successfully", data: categories };
};

export default getProductByCategory;
