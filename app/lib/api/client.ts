// app/lib/api/client.ts

/**
 * Структура ошибки, которую API может вернуть клиенту.
 */
export type ApiErrorResponse = {
  error?: unknown;
};

/**
 * Ошибка HTTP-запроса к API.
 *
 * Помимо сообщения содержит HTTP-статус ответа,
 * чтобы вызывающий код мог различать типы ошибок.
 */
export class ApiError extends Error {
  readonly status: number;

  /**
   * @param message Сообщение об ошибке.
   * @param status HTTP-статус ответа.
   */
  constructor(message: string, status: number) {
    super(message);

    this.name = "ApiError";
    this.status = status;
  }
}

/**
 * Извлекает сообщение об ошибке из ответа сервера.
 *
 * @param data Данные, полученные от API.
 * @returns Сообщение об ошибке или пустую строку,
 * если корректное сообщение отсутствует.
 */
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

/**
 * Разбирает тело HTTP-ответа.
 *
 * JSON обрабатывается только для ответов
 * с соответствующим Content-Type.
 *
 * @param response HTTP-ответ сервера.
 * @returns Распарсенные данные или null,
 * если тело отсутствует либо не удалось его разобрать.
 */
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

/**
 * Выполняет HTTP-запрос к API и обрабатывает его ответ.
 *
 * При успешном ответе возвращает данные указанного типа.
 * При ошибке сервера выбрасывает ApiError с сообщением
 * и HTTP-статусом ответа.
 *
 * @param url URL API-запроса.
 * @param options Параметры HTTP-запроса.
 * @returns Данные ответа.
 * @throws ApiError Если сервер вернул неуспешный HTTP-статус.
 */
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
