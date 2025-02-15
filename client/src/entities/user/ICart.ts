import IProduct from "../IProduct";

export default interface ICart {
  _id?: string;
  productId: IProduct;
  userId: string;
  size: string;
}
