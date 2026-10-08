import mongoose, { type InferSchemaType } from "mongoose";

const accountSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, trim: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    role: { type: String, required: true, enum: ["user", "admin"] },
  },
  { timestamps: true },
);

export type AccountDocument = InferSchemaType<typeof accountSchema>;

export const AccountModel =
  mongoose.models.Account || mongoose.model("Account", accountSchema);
