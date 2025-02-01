import productCategoryRepository from "../../../../repository/product/productCategoryRepository";
import ApiError from "../../../../utils/apiError";
import logger from "../../../../utils/logger";

const deleteCategory = async (categoryId: string) => {
  const existingCategory =
    await productCategoryRepository.getProductCategoryById(categoryId);
  if (!existingCategory) {
    throw new ApiError(400, "Category not found");
  }
  const isExistingCategoryDeleted =
    await productCategoryRepository.deleteCategoryAndProducts(categoryId);
  if (!isExistingCategoryDeleted) {
    logger.error("Category deletion failed");
    throw new ApiError(500, "Category deletion failed");
  }

  return {
    message: "Category deleted successfully",
    deletedProductsCount: isExistingCategoryDeleted.deletedProducts,
  };
};

export default deleteCategory;
