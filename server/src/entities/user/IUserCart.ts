import IProduct from "../product/IProduct";

export default interface IUserCart {
  _id?: string;
  productId: string | IProduct;
  userId: string;
  size: string;
}
