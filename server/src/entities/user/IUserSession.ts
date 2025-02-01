import { ObjectId } from "mongoose";

export default interface IUserSession {
  _id?: string;
  userId: string | ObjectId;
  refreshToken: string;
}
