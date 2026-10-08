import mongoose, { type InferSchemaType } from "mongoose";

const foodSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, trim: true },
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 1 },
    category: { type: String, required: true },
    categoryId: { type: String, required: true },
    image: { type: String, required: true },
    rating: { type: Number, required: true, min: 0, max: 5 },
    reviewCount: { type: Number, required: true, min: 0, default: 0 },
    available: { type: Boolean, required: true },
    popular: { type: Boolean, required: true, default: false },
    prepMinutes: { type: Number, required: true, min: 1, default: 15 },
    highlights: { type: [String], default: [] },
  },
  { timestamps: true },
);

export type FoodDocument = InferSchemaType<typeof foodSchema>;

export const FoodModel = mongoose.models.Food || mongoose.model("Food", foodSchema);
