import productDiscountRepository from "../../../../repository/product/productDiscountRepository";

const deleteDiscount = async (discountId: string) => {
  await productDiscountRepository.deleteProductDiscountById(discountId);
  return { message: "Discount deleted successfully" };
};
export default deleteDiscount;
