import IOrderItem from "./IOrderItem";
import IUserAddress from "./IUserAddress";

export default interface IOrder {
  _id?: string;
  orderId?: number;
  totalAmount?: number;
  customerId: string;
  orderItems: string[] | IOrderItem[];
  address: string | IUserAddress;
  status?: string;
  paymentId?: string;
  createdAt?: string;
  paymentMethod?: string;
  refundId?: string;
}

export interface IExtendedOrder extends IOrder {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}
