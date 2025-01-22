import productRepository from "../../../repository/product/productRepository";
import ApiError from "../../../utils/apiError";

const getProductByCategory = async (categoryId: string, index: number) => {
  const categories = await productRepository.findProductsByCategoryLimited(
    categoryId,
    index
  );
  if (!categories) {
    throw new ApiError(400, "Couldn't find products");
  }

  return { message: "Products fetched successfully", data: categories };
};

export default getProductByCategory;
