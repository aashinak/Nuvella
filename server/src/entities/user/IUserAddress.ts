export default interface IUserAddress {
  _id?: string;
  userId: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  postal_code: string;
  state: string;
  phone: string;
}
