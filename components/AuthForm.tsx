"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { captureEvent, identifyUser } from "@/lib/analytics/client";

type AuthFormProps = {
  mode: "login" | "register";
  redirectTo?: string;
  variant?: "public" | "admin";
};

type AuthApiResponse = {
  token?: string;
  error?: string;
  user?: {
    id?: string;
    email?: string;
    role?: string;
  };
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

function getSafeRedirectPath(value: string | undefined) {
  if (!value?.startsWith("/") || value.startsWith("//")) {
    return "/dashboard";
  }

  return value;
}

export function AuthForm({ mode, redirectTo, variant = "public" }: AuthFormProps) {
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const isRegister = mode === "register";
  const isAdmin = variant === "admin";
  const inputClassName = isAdmin
    ? "mt-2 w-full rounded-lg border border-[color:var(--admin-line)] bg-[color:var(--admin-card)] px-4 py-3 text-[color:var(--admin-strong)] outline-none transition placeholder:text-[color:var(--admin-faint)] focus:border-[color:var(--admin-accent-soft)]"
    : "mt-2 w-full rounded-lg border border-white/10 bg-white/[0.05] px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300";
  const labelClassName = isAdmin
    ? "text-sm font-medium text-[color:var(--admin-muted)]"
    : "text-sm font-medium text-slate-300";
  const buttonClassName = isAdmin
    ? "w-full rounded-lg bg-[color:var(--admin-strong)] px-4 py-3 text-sm font-bold text-[color:var(--admin-bg)] transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
    : "w-full rounded-lg bg-cyan-300 px-4 py-3 text-sm font-bold text-ink-950 transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-70";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    setStatus("loading");
    setMessage("");

    const formData = new FormData(form);
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

      const token = data?.token;

      if (!token) {
        setStatus("error");
        setMessage(`${isRegister ? "Registration" : "Login"} succeeded, but no token was returned.`);
        return;
      }

      localStorage.setItem("token", token);
      if (data?.user?.id) {
        identifyUser(data.user.id, {
          email: data.user.email,
          role: data.user.role,
        });
      }
      captureEvent(isRegister ? "user_registration" : "user_login", {
        method: "password",
        role: data?.user?.role,
      });
      setStatus("success");
      setMessage(isRegister ? "Account created successfully." : "Signed in successfully.");
      form.reset();
      router.refresh();
      router.push(getSafeRedirectPath(redirectTo));
    } catch {
      setStatus("error");
      setMessage("Unable to connect. Please try again.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-5">
      {isRegister ? (
        <label className="block">
          <span className={labelClassName}>Name</span>
          <input
            name="name"
            type="text"
            autoComplete="name"
            required
            minLength={2}
            className={inputClassName}
            placeholder="Your name"
          />
        </label>
      ) : null}

      <label className="block">
        <span className={labelClassName}>Email</span>
        <input
          name="email"
          type="email"
          autoComplete="email"
          required
          className={inputClassName}
          placeholder="you@example.com"
        />
      </label>

      <label className="block">
        <span className={labelClassName}>Password</span>
        <input
          name="password"
          type="password"
          autoComplete={isRegister ? "new-password" : "current-password"}
          required
          minLength={isRegister ? 8 : 1}
          className={inputClassName}
          placeholder={isRegister ? "At least 8 characters" : isAdmin ? "Admin password" : "Your password"}
        />
      </label>

      <button
        type="submit"
        disabled={status === "loading"}
        className={buttonClassName}
      >
        {status === "loading" ? "Please wait..." : isRegister ? "Create account" : isAdmin ? "Enter Editorial OS" : "Sign in"}
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
