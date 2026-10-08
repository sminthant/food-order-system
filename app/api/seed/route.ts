import { jsonData, jsonError, runHandler } from "@/lib/http";
import { prepareRequest } from "@/lib/prepare";
import { seedDatabase } from "@/lib/seed";
import { isRecord } from "@/lib/validate";

export function POST(request: Request) {
  return runHandler(async () => {
    if (process.env.NODE_ENV === "production") {
      return jsonError(403, "Seeding is only available in development.");
    }
    await prepareRequest();
    const body: unknown = await request.json().catch(() => null);
    const reset = isRecord(body) && body.reset === true;
    const counts = await seedDatabase(reset);
    return jsonData(counts);
  });
}
