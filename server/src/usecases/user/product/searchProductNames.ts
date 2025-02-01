import productRepository from "../../../repository/product/productRepository";

interface SearchData {
    categoryId?: string;
  searchKey: string;
}
const searchProductNames = async (data: SearchData) => {
  const res = await productRepository.findProductNames({
    categoryId: data.categoryId,
    searchKey: data.searchKey,
  });
  return { message: "Products names fetched", data: res };
};

export default searchProductNames;
