import redisClient from "../../../config/redis/redis-client";
import productRepository from "../../../repository/product/productRepository";

const searchProductsByKeyword = async (
  searchKey: string,
  pageIndex: number = 1
) => {
  const cachekKey = `searchProductsByKeyword:${searchKey}-${pageIndex}`;
  const cacheData = await redisClient.get(cachekKey);
  if (cacheData) {
    return { message: "Products fetched", products: JSON.parse(cacheData) };
  }
  const products = await productRepository.searchProductByName(
    searchKey,
    pageIndex
  );
  return { message: "Products fetched", products };
};
export default searchProductsByKeyword;
