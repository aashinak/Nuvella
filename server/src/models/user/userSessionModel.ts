import mongoose, { Schema, Document } from "mongoose";
import IUserSession from "../../entities/user/IUserSession";

// Create the UserSession schema
const userSessionSchema: Schema = new Schema<IUserSession>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    refreshToken: {
      type: String,
      required: true,
    },
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

// Create the UserSession model
const UserSession = mongoose.model<IUserSession & Document>(
  "UserSession",
  userSessionSchema
);

export default UserSession;
