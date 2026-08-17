// app/components/TimezoneSync.tsx
// app/components/TimezoneSync.tsx
"use client";

import { useEffect } from "react";

import {
  getClientTimezone,
  getStoredTimezone,
  setStoredTimezone,
} from "@/app/lib/timezone/client";

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
