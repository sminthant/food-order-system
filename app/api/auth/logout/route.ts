import { logoutAccount } from "@/lib/auth";
import { jsonData, runHandler } from "@/lib/http";
import { prepareRequest } from "@/lib/prepare";

export function POST() {
  return runHandler(async () => {
    await prepareRequest();
    await logoutAccount();
    return jsonData({ ok: true });
  });
}
