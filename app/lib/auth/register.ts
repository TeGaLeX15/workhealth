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
