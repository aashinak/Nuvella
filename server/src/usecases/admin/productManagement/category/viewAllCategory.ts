import productCategoryRepository from "../../../../repository/product/productCategoryRepository";

const viewAllCategory = async () => {
  const categoryList =
    await productCategoryRepository.getAllProductCategories();
  return { message: "Categorylist fetched successfully", categoryList };
};

export default viewAllCategory;
