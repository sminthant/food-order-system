import { HttpError, jsonData, runHandler } from "@/lib/http";
import { prepareRequest } from "@/lib/prepare";
import { toOrder } from "@/lib/records";
import { isRecord, parseOrder, parseStatus } from "@/lib/validate";
import { OrderModel } from "@/models/order";

async function readParams(params: Promise<{ id: string }>) {
  const { id } = await params;
  return decodeURIComponent(id);
}

export function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  return runHandler(async () => {
    await prepareRequest();
    const id = await readParams(context.params);
    const order = await OrderModel.findOne({ id }).lean();
    if (!order) throw new HttpError(404, "Order not found");
    return jsonData(toOrder(order));
  });
}

export function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
  return runHandler(async () => {
    await prepareRequest();
    const id = await readParams(context.params);
    const current = await OrderModel.findOne({ id });
    if (!current) throw new HttpError(404, "Order not found");
    const body: unknown = await request.json().catch(() => null);

    if (isRecord(body) && Array.isArray(body.items)) {
      const parsed = parseOrder(body, id, current.code);
      current.set(parsed);
    } else {
      current.status = parseStatus(body);
    }

    await current.save();
    return jsonData(toOrder(current));
  });
}

export function DELETE(_request: Request, context: { params: Promise<{ id: string }> }) {
  return runHandler(async () => {
    await prepareRequest();
    const id = await readParams(context.params);
    const deleted = await OrderModel.findOneAndDelete({ id }).lean();
    if (!deleted) throw new HttpError(404, "Order not found");
    return jsonData(toOrder(deleted));
  });
}
