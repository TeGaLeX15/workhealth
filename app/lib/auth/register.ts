// app/lib/auth/register.ts
import { apiClient } from "@/app/lib/api/client";

type RegisterParams = {
  email: string;
  password: string;
  timezone: string;
};

export type RegisterResponse = {
  success?: boolean;
};

/**
 * Регистрирует нового пользователя.
 *
 * Отправляет email, пароль и часовой пояс
 * на сервер и возвращает результат регистрации.
 *
 * @param params Данные для регистрации.
 * @param signal Сигнал для отмены запроса.
 * @returns Результат регистрации.
 */
export async function register(
  params: RegisterParams,
  signal?: AbortSignal,
): Promise<RegisterResponse> {
  return apiClient<RegisterResponse>("/api/auth/register", {
    method: "POST",
    signal,
    body: JSON.stringify(params),
  });
}
