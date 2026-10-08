import { loginFields, readRole, registerAccount } from "@/lib/auth";
import { HttpError, jsonData, runHandler } from "@/lib/http";
import { prepareRequest } from "@/lib/prepare";
import { isRecord } from "@/lib/validate";

export function POST(request: Request) {
  return runHandler(async () => {
    await prepareRequest();
    const body: unknown = await request.json().catch(() => null);
    if (!isRecord(body)) throw new HttpError(400, "Account details are required.");
    const { name, email, password } = loginFields(body, true);
    const account = await registerAccount({
      name,
      email,
      password,
      role: readRole(body.role),
    });
    return jsonData(account, 201);
  });
}
