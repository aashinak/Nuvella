export default interface IOrder {
  _id?: string;
  customerId: string;
  orderItems: string[];
  address: string;
  status?: string;
  paymentId?: string;
}
