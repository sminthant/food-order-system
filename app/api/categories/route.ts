import { jsonData, runHandler } from "@/lib/http";
import { prepareRequest } from "@/lib/prepare";
import { toCategory } from "@/lib/records";
import { isRecord, parseCategory, readId } from "@/lib/validate";
import { CategoryModel } from "@/models/category";
import { createId } from "@/lib/cart";
import { HttpError } from "@/lib/http";

export function GET() {
  return runHandler(async () => {
    await prepareRequest();
    const categories = await CategoryModel.find().sort({ name: 1 }).lean();
    return jsonData(categories.map((category) => toCategory(category)));
  });
}

export function POST(request: Request) {
  return runHandler(async () => {
    await prepareRequest();
    const body: unknown = await request.json().catch(() => null);
    const id = isRecord(body) && typeof body.id === "string" ? readId(body.id) : createId("cat");
    const existing = await CategoryModel.findOne({ id }).lean();
    if (existing) throw new HttpError(400, "A category with this id already exists.");
    const parsed = parseCategory(body, id);
    const created = await CategoryModel.create(parsed);
    return jsonData(toCategory(created), 201);
  });
}
