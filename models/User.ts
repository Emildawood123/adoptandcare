import mongoose, { Schema, Document, Types } from "mongoose";

export interface IUser extends Document {
  id: Types.ObjectId
  name: string;
  email: string;
  password: string;
  address: string;
  phoneNumber: string;
  pets: Types.ObjectId[];
  avater: string;
}

export const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    address: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    avater: {type: String},
     pets: [{ type: Schema.Types.ObjectId, ref: "Pet" }],
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
