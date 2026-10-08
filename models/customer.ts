import mongoose, { type InferSchemaType } from "mongoose";

const customerSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, trim: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    joinedAt: { type: String, required: true },
    orderCount: { type: Number, required: true, min: 0, default: 0 },
  },
  { timestamps: true },
);

export type CustomerDocument = InferSchemaType<typeof customerSchema>;

export const CustomerModel =
  mongoose.models.Customer || mongoose.model("Customer", customerSchema);
