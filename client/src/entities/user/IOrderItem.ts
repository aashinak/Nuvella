import IProduct from "../IProduct";

export default interface IOrderItem {
  _id?: string;
  product: IProduct;
  quantity: number;
  size?: string;
  totalPrice?: number;
  productDetails? : IProduct
}

export interface IMinimalOrderItem {
  _id?: string;
  product: string;
  quantity: number;
  size?: string;
  totalPrice?: number;
}
