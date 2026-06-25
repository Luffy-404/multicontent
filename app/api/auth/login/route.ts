import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { AuthConfigurationError, comparePassword, generateToken } from "@/lib/auth";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

function getLoginServerError(err: unknown) {
  if (err instanceof AuthConfigurationError) {
    return {
      message: "Authentication is not configured. Set JWT_SECRET and restart the server.",
      status: 500,
    };
  }

  if (err instanceof Prisma.PrismaClientInitializationError) {
    return {
      message: "Database connection is unavailable. Check DATABASE_URL and PostgreSQL.",
      status: 503,
    };
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2022") {
      return {
        message: "Database schema is out of sync. Run prisma db push or apply migrations.",
        status: 503,
      };
    }

    return {
      message: "Database error while signing in.",
      status: 503,
    };
  }

  return {
    message: "Unable to sign in right now. Please try again.",
    status: 500,
  };
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { email, password } = parsed.data;

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      select: { id: true, name: true, email: true, password: true },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    const valid = await comparePassword(password, user.password);
    if (!valid) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    const token = generateToken({ userId: user.id, email: user.email });

    const response = NextResponse.json({
      user: { id: user.id, name: user.name, email: user.email },
      token,
    });

    response.cookies.set("token", token, {
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
      sameSite: "lax",
    });

    return response;
  } catch (err) {
    console.error("[POST /api/auth/login]", err);
    const serverError = getLoginServerError(err);

    return NextResponse.json(
      { error: serverError.message },
      { status: serverError.status },
    );
  }
}
