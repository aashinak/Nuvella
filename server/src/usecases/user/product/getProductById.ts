import productRepository from "../../../repository/product/productRepository";

const getProductById = async (productId: string) => {
  const res = await productRepository.findById(productId);
  return { message: "Product data fetched", data: res };
};
export default getProductById;
