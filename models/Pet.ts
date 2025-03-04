import mongoose, { Schema, Document, Types } from "mongoose";
export interface IPets extends Document {
  breed: string;
  name: string;
  description: string;
  image: string;
  age: number;
  user: Types.ObjectId;
  
}
const vetSchema = new Schema<IPets>({
  breed: { type: String, required: true },
   name: { type: String, required: true },
  image: { type: String, required: true },
  description: { type: String },
  age: { type: Number, required: true },
  user: { type: Schema.Types.ObjectId, ref: "User", required: true }, 
},{ timestamps: true })
export default mongoose.models.Pet || mongoose.model<IPets>("Pet", vetSchema);
