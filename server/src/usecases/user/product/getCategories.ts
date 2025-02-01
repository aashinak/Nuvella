import redisClient from "../../../config/redis/redis-client";
import productCategoryRepository from "../../../repository/product/productCategoryRepository";

const getCategories = async () => {
  const cachedCategories = await redisClient.get("categories");

  if (cachedCategories) {
    return {
      data: JSON.parse(cachedCategories),
      message: "Categorylist fetched successfully",
    };
  }
  const categoryList =
    await productCategoryRepository.getAllProductCategories();

  await redisClient.setex("categories", 3600, JSON.stringify(categoryList));

  return { message: "Categorylist fetched successfully", data: categoryList };
};

export default getCategories;
