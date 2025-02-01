import productRepository from "../../../repository/product/productRepository";
import userCartRepository from "../../../repository/user/userCartRepository";

const searchProductsByIds = async (ids: string[], userId: string) => {
  const products = await userCartRepository.findByIds(ids);
  return { message: "Products fetched", data: products };
};

export default searchProductsByIds;
