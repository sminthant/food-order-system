import mongoose, { type InferSchemaType } from "mongoose";

const orderItemSchema = new mongoose.Schema(
  {
    foodId: { type: String, required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    quantity: { type: Number, required: true, min: 1 },
    subtotal: { type: Number, required: true, min: 0 },
    image: { type: String, default: "" },
  },
  { _id: false },
);

const customerSnapshotSchema = new mongoose.Schema(
  {
    id: { type: String, default: null },
    name: { type: String, required: true },
    email: { type: String, default: "" },
    phone: { type: String, default: "" },
    address: { type: String, default: "" },
  },
  { _id: false },
);

const orderSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, trim: true },
    code: { type: String, required: true, unique: true },
    customerId: { type: String, default: null },
    customer: { type: customerSnapshotSchema, required: true },
    items: { type: [orderItemSchema], required: true },
    subtotal: { type: Number, required: true, min: 0 },
    discount: { type: Number, required: true, min: 0, default: 0 },
    deliveryFee: { type: Number, required: true, min: 0, default: 0 },
    total: { type: Number, required: true, min: 0 },
    totalPrice: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      required: true,
      enum: ["pending", "confirmed", "preparing", "ready", "completed", "cancelled"],
    },
    paymentMethod: { type: String, required: true, enum: ["cash", "card"] },
    promoCode: { type: String, default: null },
    orderDate: { type: Date, required: true },
  },
  { timestamps: true },
);

export type OrderDocument = InferSchemaType<typeof orderSchema>;

export const OrderModel = mongoose.models.Order || mongoose.model("Order", orderSchema);
