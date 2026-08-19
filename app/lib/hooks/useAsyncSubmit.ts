// app/lib/hooks/useAsyncSubmit.ts
"use client";

import { useCallback, useRef, useState } from "react";

const DEFAULT_TIMEOUT = 15_000;

type AsyncSubmitOptions = {
  /** Максимальное время выполнения операции в миллисекундах. */
  timeout?: number;
};

/**
 * Извлекает понятное сообщение об ошибке из неизвестного значения.
 *
 * Если ошибка не содержит подходящего сообщения,
 * возвращается стандартный текст.
 */
function getErrorMessage(error: unknown): string {
  if (typeof error === "string" && error.trim()) {
    return error;
  }

  if (
    error &&
    typeof error === "object" &&
    "message" in error &&
    typeof error.message === "string" &&
    error.message.trim()
  ) {
    return error.message;
  }

  return "Не удалось выполнить операцию. Попробуй ещё раз.";
}

/**
 * Проверяет, была ли ошибка вызвана отменой AbortController.
 */
function isAbortError(error: unknown): boolean {
  return error instanceof DOMException && error.name === "AbortError";
}

/**
 * Управляет асинхронной отправкой с защитой от повторного запуска,
 * таймаутом, обработкой ошибок и состоянием завершения.
 *
 * Используется для операций, которые пользователь может запустить
 * повторным нажатием, чтобы не допустить несколько одновременных запросов.
 */
export function useAsyncSubmit(options: AsyncSubmitOptions = {}) {
  const timeout = options.timeout ?? DEFAULT_TIMEOUT;

  const [isLoading, setIsLoading] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [error, setError] = useState("");

  const submittingRef = useRef(false);

  /**
   * Запускает асинхронную операцию.
   *
   * Если операция уже выполняется, повторный запуск игнорируется.
   * Операции передаётся AbortSignal, который автоматически отменяется
   * после истечения заданного таймаута.
   *
   * @returns Результат операции или null при ошибке,
   * таймауте либо повторном вызове.
   */
  const execute = useCallback(
    async <T>(
      operation: (signal: AbortSignal) => Promise<T>,
    ): Promise<T | null> => {
      if (submittingRef.current) {
        return null;
      }

      submittingRef.current = true;

      setIsLoading(true);
      setIsCompleted(false);
      setError("");

      const controller = new AbortController();

      const timeoutId = window.setTimeout(() => {
        controller.abort();
      }, timeout);

      try {
        const result = await operation(controller.signal);

        setIsCompleted(true);

        return result;
      } catch (error) {
        if (isAbortError(error)) {
          setError(
            "Сервер отвечает слишком долго. Проверь соединение и попробуй ещё раз.",
          );

          return null;
        }

        console.error("Async operation error:", error);

        setError(getErrorMessage(error));

        return null;
      } finally {
        window.clearTimeout(timeoutId);

        submittingRef.current = false;
        setIsLoading(false);
      }
    },
    [timeout],
  );

  /**
   * Очищает текущее сообщение об ошибке.
   */
  const clearError = useCallback(() => {
    setError("");
  }, []);

  /**
   * Полностью сбрасывает состояние асинхронной операции.
   */
  const reset = useCallback(() => {
    submittingRef.current = false;

    setIsLoading(false);
    setIsCompleted(false);
    setError("");
  }, []);

  return {
    isLoading,
    isCompleted,
    error,
    execute,
    clearError,
    reset,
  };
}
