export default interface IUser {
  _id?: string;
  username: string;
  avatar?: string;
  password: string;
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  isVerified: boolean;
  googleId: string;
  provider: string;
}
