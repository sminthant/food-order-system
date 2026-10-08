import { categories } from "@/data/mock-categories";
import { customers } from "@/data/mock-customers";
import { foods } from "@/data/mock-foods";
import { orders } from "@/data/mock-orders";
import { hashPassword } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import { AccountModel } from "@/models/account";
import { CategoryModel } from "@/models/category";
import { CustomerModel } from "@/models/customer";
import { FoodModel } from "@/models/food";
import { OrderModel } from "@/models/order";
import type { AccountRole } from "@/types/account";

const defaultAccounts: { id: string; name: string; email: string; password: string; role: AccountRole }[] = [
  { id: "acc-admin", name: "admin", email: "admin@gmail.com", password: "admin1234", role: "admin" },
  { id: "acc-john", name: "john", email: "john@gmail.com", password: "john1234", role: "user" },
];

export async function ensureDefaultAccounts() {
  await connectDB();
  for (const account of defaultAccounts) {
    const existing = await AccountModel.findOne({ email: account.email }).lean();
    if (!existing) {
      await AccountModel.create({
        id: account.id,
        name: account.name,
        email: account.email,
        passwordHash: await hashPassword(account.password),
        role: account.role,
      });
    }
    if (account.role !== "user") continue;
    const customer = await CustomerModel.findOne({ email: account.email }).lean();
    if (customer) continue;
    await CustomerModel.create({
      id: account.id,
      name: account.name,
      email: account.email,
      phone: "Not provided",
      address: "Not provided",
      joinedAt: new Date().toISOString().slice(0, 10),
      orderCount: 0,
    });
  }
}

function categoryName(id: string) {
  return categories.find((category) => category.id === id)?.name ?? id;
}

function foodDocuments() {
  return foods.map((food) => ({
    ...food,
    category: categoryName(food.categoryId),
  }));
}

function orderDocuments() {
  return orders.map((order) => ({
    id: order.id,
    code: order.code,
    customerId: order.customerId,
    customer: {
      id: order.customerId,
      name: order.customerName,
      email: order.customerEmail,
      phone: order.customerPhone,
      address: order.address,
    },
    items: order.items.map((item) => ({
      ...item,
      subtotal: item.price * item.quantity,
    })),
    subtotal: order.subtotal,
    discount: order.discount,
    deliveryFee: order.deliveryFee,
    total: order.total,
    totalPrice: order.total,
    status: order.status,
    paymentMethod: order.paymentMethod,
    promoCode: order.promoCode,
    orderDate: new Date(order.createdAt),
  }));
}

function upserts<T extends { id: string }>(docs: T[]) {
  return docs.map((doc) => ({
    updateOne: {
      filter: { id: doc.id },
      update: { $set: doc },
      upsert: true,
    },
  }));
}

export async function seedDatabase(reset = false) {
  await connectDB();
  const categoryDocs = categories;
  const foodDocs = foodDocuments();
  const customerDocs = customers;
  const orderDocs = orderDocuments();

  if (reset) {
    await Promise.all([
      CategoryModel.deleteMany({}),
      FoodModel.deleteMany({}),
      CustomerModel.deleteMany({}),
      OrderModel.deleteMany({}),
    ]);
    await Promise.all([
      CategoryModel.insertMany(categoryDocs),
      FoodModel.insertMany(foodDocs),
      CustomerModel.insertMany(customerDocs),
      OrderModel.insertMany(orderDocs),
    ]);
    await ensureDefaultAccounts();
    return { categories: categoryDocs.length, foods: foodDocs.length, customers: customerDocs.length, orders: orderDocs.length };
  }

  await CategoryModel.bulkWrite(upserts(categoryDocs));
  await FoodModel.bulkWrite(upserts(foodDocs));
  await CustomerModel.bulkWrite(upserts(customerDocs));
  await OrderModel.bulkWrite(upserts(orderDocs));
  await ensureDefaultAccounts();
  return { categories: categoryDocs.length, foods: foodDocs.length, customers: customerDocs.length, orders: orderDocs.length };
}

let emptySeed: Promise<void> | null = null;

export function seedIfEmpty() {
  if (!emptySeed) {
    emptySeed = (async () => {
      await connectDB();
      const [categoryCount, foodCount, orderCount] = await Promise.all([
        CategoryModel.countDocuments(),
        FoodModel.countDocuments(),
        OrderModel.countDocuments(),
      ]);
      if (categoryCount === 0 && foodCount === 0 && orderCount === 0) {
        await seedDatabase(false);
      }
      await ensureDefaultAccounts();
    })().catch((error: unknown) => {
      emptySeed = null;
      throw error;
    });
  }
  return emptySeed;
}
