import mongoose, { Schema } from "mongoose";
import IAdmin from "../../entities/admin/IAdmin";

// Create the Admin schema
const adminSchema: Schema = new Schema<IAdmin>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    refreshToken: { type: String, default: null },
    isVerified: { type: Boolean, required: true, default: false },
    isBlocked: { type: Boolean, required: true, default: false}
  },
  { timestamps: true }
);

// Create the Admin model
const Admin = mongoose.model<IAdmin & Document>("Admin", adminSchema);

export default Admin;
