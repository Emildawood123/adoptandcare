import mongoose, { Schema, Document, Types } from "mongoose";

export interface IAdoptionRequest extends Document {
  pet: Types.ObjectId;
  user: Types.ObjectId;
  message: string;
  status: "Pending" | "Approved" | "Rejected";
}

const adoptionRequestSchema = new Schema<IAdoptionRequest>(
  {
    pet: { type: Schema.Types.ObjectId, ref: "Pet", required: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    message: { type: String, required: true },
    status: { type: String, enum: ["Pending", "Approved", "Rejected"], default: "Pending" },
  },
  { timestamps: true }
);

export default mongoose.models.AdoptionRequest || mongoose.model<IAdoptionRequest>("AdoptionRequest", adoptionRequestSchema);
