import type { NextRequest } from "next/server";
import { createId } from "@/lib/cart";
import { HttpError, jsonData, runHandler } from "@/lib/http";
import { prepareRequest } from "@/lib/prepare";
import { toFood } from "@/lib/records";
import { isRecord, parseFood, readId } from "@/lib/validate";
import { CategoryModel } from "@/models/category";
import { FoodModel } from "@/models/food";

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

async function withCategoryName<T extends { categoryId: string; category: string }>(food: T) {
  const category = await CategoryModel.findOne({ id: food.categoryId }).lean();
  if (!category) throw new HttpError(400, "Category not found.");
  return { ...food, category: category.name };
}

export function GET(request: NextRequest) {
  return runHandler(async () => {
    await prepareRequest();
    const search = request.nextUrl.searchParams.get("search")?.trim() ?? "";
    const categoryId = request.nextUrl.searchParams.get("categoryId")?.trim() ?? "";
    const available = request.nextUrl.searchParams.get("available");
    const filter: Record<string, unknown> = {};

    if (categoryId) filter.categoryId = categoryId;
    if (available === "true") filter.available = true;
    if (available === "false") filter.available = false;
    if (search) {
      const pattern = new RegExp(escapeRegex(search), "i");
      filter.$or = [{ name: pattern }, { description: pattern }];
    }

    const foods = await FoodModel.find(filter).sort({ name: 1 }).lean();
    return jsonData(foods.map((food) => toFood(food)));
  });
}

export function POST(request: Request) {
  return runHandler(async () => {
    await prepareRequest();
    const body: unknown = await request.json().catch(() => null);
    const id = isRecord(body) && typeof body.id === "string" ? readId(body.id) : createId("food");
    const existing = await FoodModel.findOne({ id }).lean();
    if (existing) throw new HttpError(400, "A food with this id already exists.");
    const parsed = await withCategoryName(parseFood(body, id));
    const created = await FoodModel.create(parsed);
    return jsonData(toFood(created), 201);
  });
}
