export class HttpError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

export function jsonData(data: unknown, status = 200) {
  return Response.json({ success: true, data }, { status });
}

export function jsonError(status: number, message: string) {
  return Response.json({ success: false, message }, { status });
}

function isPrerenderAbort(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    "digest" in error &&
    error.digest === "HANGING_PROMISE_REJECTION"
  );
}

export async function runHandler(action: () => Promise<Response>) {
  try {
    return await action();
  } catch (error) {
    if (isPrerenderAbort(error)) throw error;
    if (error instanceof HttpError) {
      return jsonError(error.status, error.message);
    }
    console.error(error);
    return jsonError(500, "The database is unavailable. Please try again.");
  }
}
