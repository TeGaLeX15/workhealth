// app/lib/hooks/useAsyncSubmit.ts
"use client";

import { useCallback, useRef, useState } from "react";

const DEFAULT_TIMEOUT = 15_000;

type AsyncSubmitOptions = {
  timeout?: number;
};

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

function isAbortError(error: unknown): boolean {
  return error instanceof DOMException && error.name === "AbortError";
}

export function useAsyncSubmit(options: AsyncSubmitOptions = {}) {
  const timeout = options.timeout ?? DEFAULT_TIMEOUT;

  const [isLoading, setIsLoading] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [error, setError] = useState("");

  const submittingRef = useRef(false);

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

  const clearError = useCallback(() => {
    setError("");
  }, []);

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
