import { requireAdmin } from "@/lib/auth";
import { HttpError, jsonData, runHandler } from "@/lib/http";
import { prepareRequest } from "@/lib/prepare";
import { toCategory } from "@/lib/records";
import { parseCategory } from "@/lib/validate";
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
    const category = await CategoryModel.findOne({ id }).lean();
    if (!category) throw new HttpError(404, "Category not found");
    return jsonData(toCategory(category));
  });
}

export function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
  return runHandler(async () => {
    await prepareRequest();
    await requireAdmin();
    const id = await readParams(context.params);
    const body: unknown = await request.json().catch(() => null);
    const parsed = parseCategory(body, id);
    const updated = await CategoryModel.findOneAndUpdate({ id }, parsed, {
      new: true,
      runValidators: true,
    }).lean();
    if (!updated) throw new HttpError(404, "Category not found");
    return jsonData(toCategory(updated));
  });
}

export function DELETE(_request: Request, context: { params: Promise<{ id: string }> }) {
  return runHandler(async () => {
    await prepareRequest();
    await requireAdmin();
    const id = await readParams(context.params);
    const inUse = await FoodModel.exists({ categoryId: id });
    if (inUse) {
      throw new HttpError(400, "Move foods out of this category before deleting it.");
    }
    const deleted = await CategoryModel.findOneAndDelete({ id }).lean();
    if (!deleted) throw new HttpError(404, "Category not found");
    return jsonData(toCategory(deleted));
  });
}
