// app/components/TimezoneSync.tsx
"use client";

import { useEffect } from "react";

export default function TimezoneSync() {
  useEffect(() => {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    if (!timezone) {
      return;
    }

    fetch("/api/user/timezone", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        timezone,
      }),
    }).catch((error) => {
      console.error("Timezone sync error:", error);
    });
  }, []);

  return null;
}
