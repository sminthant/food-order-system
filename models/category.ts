import mongoose, { type InferSchemaType } from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, trim: true },
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    icon: {
      type: String,
      required: true,
      enum: ["beef", "pizza", "drumstick", "soup", "cup-soda", "cake", "utensils"],
    },
    image: { type: String, required: true },
  },
  { timestamps: true },
);

export type CategoryDocument = InferSchemaType<typeof categorySchema>;

export const CategoryModel =
  mongoose.models.Category || mongoose.model("Category", categorySchema);
