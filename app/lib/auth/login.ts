// app/lib/auth/login.ts
import { apiClient } from "@/app/lib/api/client";

type LoginParams = {
  email: string;
  password: string;
  timezone: string;
};

export type LoginResponse = {
  success?: boolean;
};

/**
 * Выполняет вход пользователя в аккаунт.
 *
 * Отправляет email, пароль и часовой пояс
 * на сервер и возвращает результат авторизации.
 *
 * @param params Данные для входа.
 * @param signal Сигнал для отмены запроса.
 * @returns Результат авторизации.
 */
export async function login(
  params: LoginParams,
  signal?: AbortSignal,
): Promise<LoginResponse> {
  return apiClient<LoginResponse>("/api/auth/login", {
    method: "POST",
    signal,
    body: JSON.stringify(params),
  });
}
