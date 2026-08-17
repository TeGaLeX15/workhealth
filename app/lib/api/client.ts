// app/lib/api/client.ts
export type ApiErrorResponse = {
  error?: unknown;
};

export class ApiError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);

    this.name = "ApiError";
    this.status = status;
  }
}

function getServerError(data: unknown): string {
  if (!data || typeof data !== "object") {
    return "";
  }

  if (!("error" in data)) {
    return "";
  }

  const error = data.error;

  if (typeof error !== "string") {
    return "";
  }

  return error.trim();
}

async function parseResponseBody(response: Response): Promise<unknown> {
  const contentType = response.headers.get("content-type");

  if (!contentType?.includes("application/json")) {
    return null;
  }

  try {
    return await response.json();
  } catch {
    return null;
  }
}

export async function apiClient<T>(
  url: string,
  options: RequestInit = {},
): Promise<T> {
  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  const data = await parseResponseBody(response);

  if (!response.ok) {
    const serverError = getServerError(data);

    throw new ApiError(
      serverError || "Произошла ошибка. Попробуй ещё раз.",
      response.status,
    );
  }

  return data as T;
}
