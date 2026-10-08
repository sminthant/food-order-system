export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

export async function api<T>(path: string, init?: RequestInit): Promise<T> {
  let response: Response;
  try {
    response = await fetch(path, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        ...(init?.headers ?? {}),
      },
    });
  } catch {
    throw new ApiError("FoodGo could not reach the server. Check that the app is running.", 0);
  }

  const body: unknown = await response.json().catch(() => null);
  const payload =
    typeof body === "object" && body !== null ? (body as { success?: boolean; message?: string; data?: T }) : null;

  if (!response.ok || !payload?.success) {
    const message =
      payload?.message ||
      (response.status === 404
        ? "That record could not be found."
        : "Something went wrong. Please try again.");
    throw new ApiError(message, response.status);
  }

  return payload.data as T;
}
