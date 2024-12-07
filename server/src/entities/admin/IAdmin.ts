export default interface IAdmin {
  _id?: string;
  name: string;
  email: string;
  password: string;
  refreshToken?: string;
  isVerified: boolean;
  isBlocked?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
