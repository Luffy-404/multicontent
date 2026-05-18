"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function LogoutButton() {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  async function handleLogout() {
    if (isLoggingOut) {
      return;
    }

    setIsLoggingOut(true);

    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "same-origin",
      });
    } finally {
      localStorage.removeItem("token");
      document.cookie = "token=; path=/; max-age=0; samesite=lax";
      router.replace("/");
      router.refresh();
    }
  }

  return (
    <button
      type="button"
      onClick={() => void handleLogout()}
      disabled={isLoggingOut}
      className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-ink-950 transition hover:bg-cyan-200 disabled:cursor-wait disabled:opacity-70"
    >
      {isLoggingOut ? "Logging out..." : "Logout"}
    </button>
  );
}
