import productRepository from "../../../../repository/product/productRepository";
import ApiError from "../../../../utils/apiError";

const deleteProduct = async (productId: string) => {
  const product = await productRepository.deleteProduct(productId);
  if (!product) {
    throw new ApiError(404, "Couldnt delete product");
  }
  return { message: "Product deletion successfull", deletedProduct: product };
};

export default deleteProduct;
