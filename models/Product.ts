import mongoose, { Schema, Document, Types } from "mongoose";

export interface IProduct extends Document {
  id: Types.ObjectId
  name: string;
  price: number;
    description: string;
    image: string
}

export const ProductSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true},
    description: { type: String, required: true },
    image: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.Product || mongoose.model<IProduct>("Product", ProductSchema);
