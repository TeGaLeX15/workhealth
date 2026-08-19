// app/components/TimezoneSync.tsx
"use client";

import { useEffect } from "react";

import {
  getClientTimezone,
  getStoredTimezone,
  setStoredTimezone,
} from "@/app/lib/timezone/client";

/**
 * Синхронизирует часовой пояс пользователя
 * между браузером и сервером.
 *
 * При монтировании определяет часовой пояс браузера
 * и сравнивает его с последним сохранённым значением.
 *
 * Если часовой пояс изменился, отправляет его на сервер
 * и сохраняет новое значение в localStorage после успешного ответа.
 *
 * Компонент не рендерит никакого UI.
 */
export default function TimezoneSync() {
  useEffect(() => {
    const timezone = getClientTimezone();

    if (!timezone) {
      return;
    }

    const storedTimezone = getStoredTimezone();

    if (storedTimezone === timezone) {
      return;
    }

    let cancelled = false;

    /**
     * Отправляет текущий часовой пояс пользователя на сервер.
     *
     * Если компонент был размонтирован до завершения запроса,
     * локальное состояние не изменяется.
     */
    async function syncTimezone() {
      try {
        const response = await fetch("/api/user/timezone", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            timezone,
          }),
        });

        if (!response.ok) {
          return;
        }

        if (!cancelled) {
          setStoredTimezone(timezone);
        }
      } catch (error) {
        if (!cancelled) {
          console.error("Timezone sync error:", error);
        }
      }
    }

    void syncTimezone();

    return () => {
      cancelled = true;
    };
  }, []);

  return null;
}
