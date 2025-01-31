export default interface IOrder {
  _id?: string;
  orderId: number;
  customerId: string;
  orderItems: string[];
  address: string;
  status?: string;
  paymentId?: string;
  totalAmount: number;
  paymentMethod: string;
  refundId?: string;
}
