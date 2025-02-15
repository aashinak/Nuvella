import IProductDiscount from "../../../../entities/product/IProductDiscount";
import productDiscountRepository from "../../../../repository/product/productDiscountRepository";

const createDiscount = async (
  discountData: Omit<IProductDiscount, "active">
) => {
  const discount = await productDiscountRepository.createProductDiscount(
    discountData
  );

  return { message: "Discount created successfully", discount };
};

export default createDiscount;
