import { ObjectId } from "mongoose";

export default interface IUiUpdate {
  uiUpdates: {
    id: string;
    heroImage: string;
    heroText: string;
    subText1: string;
    subText2: string;
  }[];
}
