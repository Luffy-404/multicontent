"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

type AuthFormProps = {
  mode: "login" | "register";
};

type AuthApiResponse = {
  token?: string;
  error?: string;
  details?: {
    fieldErrors?: Record<string, string[] | undefined>;
    formErrors?: string[];
  };
};

function getErrorMessage(data: AuthApiResponse | null) {
  if (!data) {
    return undefined;
  }

  const fieldErrors = data.details?.fieldErrors
    ? Object.values(data.details.fieldErrors).flat().filter(Boolean)
    : [];
  const validationErrors = [...(data.details?.formErrors ?? []), ...fieldErrors];

  if (validationErrors.length > 0) {
    return validationErrors.join(" ");
  }

  return data.error;
}

async function parseAuthResponse(response: Response) {
  return response.json().catch(() => null) as Promise<AuthApiResponse | null>;
}

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const isRegister = mode === "register";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setMessage("");

    const formData = new FormData(event.currentTarget);
    const payload = {
      ...(isRegister ? { name: String(formData.get("name") ?? "") } : {}),
      email: String(formData.get("email") ?? ""),
      password: String(formData.get("password") ?? ""),
    };
    const endpoint = isRegister ? "/api/auth/register" : "/api/auth/login";

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await parseAuthResponse(response);

      if (!response.ok) {
        setStatus("error");
        setMessage(getErrorMessage(data) ?? "Something went wrong. Please try again.");
        return;
      }

      if (!isRegister) {
        const token = data?.token;

        if (!token) {
          setStatus("error");
          setMessage("Login succeeded, but no token was returned.");
          return;
        }

        localStorage.setItem("token", token);
        document.cookie = `token=${token}; path=/; max-age=${60 * 60 * 24 * 7}; samesite=lax`;
        setStatus("success");
        setMessage("Signed in successfully.");
        router.refresh();
        router.push("/dashboard");
        return;
      }

      setStatus("success");
      setMessage("Account created successfully.");
      event.currentTarget.reset();
      router.push("/login");
    } catch {
      setStatus("error");
      setMessage("Unable to connect. Please try again.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-5">
      {isRegister ? (
        <label className="block">
          <span className="text-sm font-medium text-slate-300">Name</span>
          <input
            name="name"
            type="text"
            autoComplete="name"
            required
            minLength={2}
            className="mt-2 w-full rounded-lg border border-white/10 bg-white/[0.05] px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300"
            placeholder="Your name"
          />
        </label>
      ) : null}

      <label className="block">
        <span className="text-sm font-medium text-slate-300">Email</span>
        <input
          name="email"
          type="email"
          autoComplete="email"
          required
          className="mt-2 w-full rounded-lg border border-white/10 bg-white/[0.05] px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300"
          placeholder="you@example.com"
        />
      </label>

      <label className="block">
        <span className="text-sm font-medium text-slate-300">Password</span>
        <input
          name="password"
          type="password"
          autoComplete={isRegister ? "new-password" : "current-password"}
          required
          minLength={isRegister ? 8 : 1}
          className="mt-2 w-full rounded-lg border border-white/10 bg-white/[0.05] px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300"
          placeholder={isRegister ? "At least 8 characters" : "Your password"}
        />
      </label>

      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full rounded-lg bg-cyan-300 px-4 py-3 text-sm font-bold text-ink-950 transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-70"
      >
        {status === "loading" ? "Please wait..." : isRegister ? "Create account" : "Sign in"}
      </button>

      {message ? (
        <p
          className={`rounded-lg border px-4 py-3 text-sm ${
            status === "error"
              ? "border-red-400/30 bg-red-500/10 text-red-200"
              : "border-emerald-400/30 bg-emerald-500/10 text-emerald-200"
          }`}
        >
          {message}
        </p>
      ) : null}
    </form>
  );
}
