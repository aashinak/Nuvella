import IProductDiscount from "./IProductDiscount";

export default interface IProduct {
  _id?: string;
  name: string;
  description: string;
  images: string[];
  price: string;
  categoryId: string;
  stock: number;
  sizes?: { size: string; stock: number }[];
  discountId: IProductDiscount | string;
}
