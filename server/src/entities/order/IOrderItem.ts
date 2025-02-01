export default interface IOrderItem {
  _id?: string;
  product: string;
  quantity: number;
  size?: string;
  totalPrice?: number;
}
