import { loginAccount, loginFields } from "@/lib/auth";
import { HttpError, jsonData, runHandler } from "@/lib/http";
import { prepareRequest } from "@/lib/prepare";
import { isRecord } from "@/lib/validate";

export function POST(request: Request) {
  return runHandler(async () => {
    await prepareRequest();
    const body: unknown = await request.json().catch(() => null);
    if (!isRecord(body)) throw new HttpError(400, "Email and password are required.");
    const { email, password } = loginFields(body, false);
    return jsonData(await loginAccount(email, password));
  });
}
