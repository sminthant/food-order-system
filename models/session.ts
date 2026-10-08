import mongoose, { type InferSchemaType } from "mongoose";

const sessionSchema = new mongoose.Schema(
  {
    tokenHash: { type: String, required: true, unique: true },
    accountId: { type: String, required: true, index: true },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: true },
);

export type SessionDocument = InferSchemaType<typeof sessionSchema>;

export const SessionModel =
  mongoose.models.Session || mongoose.model("Session", sessionSchema);
