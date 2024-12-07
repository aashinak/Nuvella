import { ObjectId } from "mongoose"

export default interface IUiUpdate {
    _id?: string 
  adminId: string | ObjectId
  heroImage: string[]
  heroText: string[]
  createdAt?: Date;
  updatedAt?: Date;
}