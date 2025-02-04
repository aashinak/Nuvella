import productDiscountRepository from "../../../../repository/product/productDiscountRepository";

const viewAllDiscounts = async () => {
  const discounts = await productDiscountRepository.getAllProductDiscounts();
  return { message: "Discounts retrieved successfully", data: discounts };
};
export default viewAllDiscounts;
