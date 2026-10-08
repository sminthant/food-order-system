import { getCurrentAccount } from "@/lib/auth";
import { jsonData, runHandler } from "@/lib/http";

export function GET() {
  return runHandler(async () => jsonData(await getCurrentAccount()));
}
