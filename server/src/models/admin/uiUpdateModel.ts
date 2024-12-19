import mongoose, { Schema } from "mongoose";
import IUiUpdate from "../../entities/admin/IUiUpdate";

// Create the UiUpdate schema
const uiUpdateSchema: Schema = new Schema(
  {
    uiUpdates: [
      {
        id: { type: String, required: true },
        heroImage: { type: String, required: true },
        heroText: { type: String, required: true },
        subText1: { type: String, required: true },
        subText2: { type: String, required: true },
      },
    ],
  },
  { timestamps: true }
);

// Create the UiUpdate model
const UiUpdate = mongoose.model<IUiUpdate & Document>(
  "UiUpdate",
  uiUpdateSchema
);

export default UiUpdate;
