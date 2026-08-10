// lib/validation/auth.ts
import { z } from "zod";

// ─── Shared fields ───────────────────────────────────────────────────────────

const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .min(1, "Введите email")
  .email("Введите корректный email");

const passwordSchema = z
  .string()
  .min(1, "Введите пароль");

const timezoneSchema = z
  .string()
  .min(1, "Некорректный часовой пояс");

// ─── Login ───────────────────────────────────────────────────────────────────

export const loginSchema = z.object({
  email: emailSchema,

  password: passwordSchema.min(
    8,
    "Пароль должен содержать минимум 8 символов",
  ),
});

// ─── Register fields ─────────────────────────────────────────────────────────

const registerFieldsSchema = z.object({
  email: emailSchema,

  password: passwordSchema.min(
    8,
    "Пароль должен содержать минимум 8 символов",
  ),

  passwordRepeat: z
    .string()
    .min(1, "Повторите пароль"),
});

// ─── Register ────────────────────────────────────────────────────────────────

export const registerSchema = registerFieldsSchema.refine(
  (data) => data.password === data.passwordRepeat,
  {
    message: "Пароли не совпадают",
    path: ["passwordRepeat"],
  },
);

// ─── API request schemas ─────────────────────────────────────────────────────
//
// passwordRepeat нужен только клиенту для подтверждения пароля.
// timezone передаётся браузером при регистрации.

export const registerRequestSchema = registerFieldsSchema
  .omit({
    passwordRepeat: true,
  })
  .extend({
    timezone: timezoneSchema,
  });

// ─── Types ───────────────────────────────────────────────────────────────────

export type LoginFormValues = z.infer<
  typeof loginSchema
>;

export type RegisterFormValues = z.infer<
  typeof registerSchema
>;

export type RegisterRequest = z.infer<
  typeof registerRequestSchema
>;
