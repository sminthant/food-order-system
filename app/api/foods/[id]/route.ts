import { requireAdmin } from "@/lib/auth";
import { HttpError, jsonData, runHandler } from "@/lib/http";
import { prepareRequest } from "@/lib/prepare";
import { toFood } from "@/lib/records";
import { parseFood } from "@/lib/validate";
import { CategoryModel } from "@/models/category";
import { FoodModel } from "@/models/food";

async function readParams(params: Promise<{ id: string }>) {
  const { id } = await params;
  return decodeURIComponent(id);
}

export function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  return runHandler(async () => {
    await prepareRequest();
    const id = await readParams(context.params);
    const food = await FoodModel.findOne({ id }).lean();
    if (!food) throw new HttpError(404, "Food not found");
    return jsonData(toFood(food));
  });
}

export function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
  return runHandler(async () => {
    await prepareRequest();
    await requireAdmin();
    const id = await readParams(context.params);
    const body: unknown = await request.json().catch(() => null);
    const parsed = parseFood(body, id);
    const category = await CategoryModel.findOne({ id: parsed.categoryId }).lean();
    if (!category) throw new HttpError(400, "Category not found.");
    const updated = await FoodModel.findOneAndUpdate(
      { id },
      { ...parsed, category: category.name },
      { new: true, runValidators: true },
    ).lean();
    if (!updated) throw new HttpError(404, "Food not found");
    return jsonData(toFood(updated));
  });
}

export function DELETE(_request: Request, context: { params: Promise<{ id: string }> }) {
  return runHandler(async () => {
    await prepareRequest();
    await requireAdmin();
    const id = await readParams(context.params);
    const deleted = await FoodModel.findOneAndDelete({ id }).lean();
    if (!deleted) throw new HttpError(404, "Food not found");
    return jsonData(toFood(deleted));
  });
}
