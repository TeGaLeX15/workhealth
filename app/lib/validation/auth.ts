// lib/validation/auth.ts
import { z } from "zod";

/**
 * Общая схема email.
 *
 * Обрезает пробелы, приводит значение к нижнему регистру
 * и проверяет корректность email-адреса.
 */
const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .min(1, "Введите email")
  .email("Введите корректный email");

/**
 * Базовая схема пароля.
 */
const passwordSchema = z.string().min(1, "Введите пароль");

/**
 * Схема часового пояса.
 */
const timezoneSchema = z.string().min(1, "Некорректный часовой пояс");

/**
 * Схема данных для входа.
 */
export const loginSchema = z.object({
  email: emailSchema,

  password: passwordSchema.min(8, "Пароль должен содержать минимум 8 символов"),
});

/**
 * Общие поля регистрации.
 *
 * Используются как основа для клиентской формы
 * и схемы API-запроса.
 */
const registerFieldsSchema = z.object({
  email: emailSchema,

  password: passwordSchema.min(8, "Пароль должен содержать минимум 8 символов"),

  passwordRepeat: z.string().min(1, "Повторите пароль"),
});

/**
 * Схема формы регистрации.
 *
 * Дополнительно проверяет совпадение пароля
 * и его подтверждения.
 */
export const registerSchema = registerFieldsSchema.refine(
  (data) => data.password === data.passwordRepeat,
  {
    message: "Пароли не совпадают",
    path: ["passwordRepeat"],
  },
);

/**
 * Схема API-запроса регистрации.
 *
 * В отличие от формы регистрации не содержит
 * повторно введённый пароль, но требует часовой пояс.
 */
export const registerRequestSchema = registerFieldsSchema
  .omit({
    passwordRepeat: true,
  })
  .extend({
    timezone: timezoneSchema,
  });

/**
 * Данные формы входа.
 */
export type LoginFormValues = z.infer<typeof loginSchema>;

/**
 * Данные формы регистрации.
 */
export type RegisterFormValues = z.infer<typeof registerSchema>;

/**
 * Данные запроса на регистрацию.
 */
export type RegisterRequest = z.infer<typeof registerRequestSchema>;
