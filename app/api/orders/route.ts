import { createId, nextOrderCode } from "@/lib/cart";
import { HttpError, jsonData, runHandler } from "@/lib/http";
import { prepareRequest } from "@/lib/prepare";
import { toOrder } from "@/lib/records";
import { isRecord, parseOrder, readId } from "@/lib/validate";
import { OrderModel } from "@/models/order";

export function GET() {
  return runHandler(async () => {
    await prepareRequest();
    const orders = await OrderModel.find().sort({ orderDate: -1 }).lean();
    return jsonData(orders.map((order) => toOrder(order)));
  });
}

export function POST(request: Request) {
  return runHandler(async () => {
    await prepareRequest();
    const body: unknown = await request.json().catch(() => null);
    const id = isRecord(body) && typeof body.id === "string" ? readId(body.id) : createId("ord");
    const existing = await OrderModel.findOne({ id }).lean();
    if (existing) throw new HttpError(400, "An order with this id already exists.");

    const codes = await OrderModel.find().select("code").lean();
    const requested =
      isRecord(body) && typeof body.code === "string" && /^FO-\d+$/.test(body.code) ? body.code : "";
    const codeTaken = requested ? codes.some((order) => order.code === requested) : true;
    const code = requested && !codeTaken ? requested : nextOrderCode(codes.map((order) => order.code));

    const parsed = parseOrder(body, id, code);
    const created = await OrderModel.create(parsed);
    return jsonData(toOrder(created), 201);
  });
}
