import { jsonData, runHandler } from "@/lib/http";
import { prepareRequest } from "@/lib/prepare";
import { toCustomer } from "@/lib/records";
import { CustomerModel } from "@/models/customer";

export function GET() {
  return runHandler(async () => {
    await prepareRequest();
    const customers = await CustomerModel.find().sort({ name: 1 }).lean();
    return jsonData(customers.map((customer) => toCustomer(customer)));
  });
}
