import IProductDiscount from "../IProductDiscount";

export default interface IProduct {
  _id?: string;
  name: string;
  description: string;
  images: string[];
  price: string;
  categoryId: {
    _id: string;
    name: string;
    image: string;
  };
  stock: number;
  sizes: { size: string; stock: number }[];
  discountId?: string | IProductDiscount;
  discountedPrice?: string
}
