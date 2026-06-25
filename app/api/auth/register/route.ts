import { NextRequest, NextResponse } from "next/server";
import { Prisma, UserRole } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { AuthConfigurationError, generateToken, hashPassword } from "@/lib/auth";
import { z } from "zod";

const registerSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  password: z.string().min(8).max(100),
});

function getRegisterServerError(err: unknown) {
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
    if (err.code === "P2002") {
      return {
        message: "Email already in use",
        status: 409,
      };
    }

    if (err.code === "P2022") {
      return {
        message: "Database schema is out of sync. Run prisma db push or apply migrations.",
        status: 503,
      };
    }

    return {
      message: "Database error while creating your account.",
      status: 503,
    };
  }

  return {
    message: "Unable to create your account right now. Please try again.",
    status: 500,
  };
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { name, email, password } = parsed.data;
    const normalizedEmail = email.toLowerCase();

    const existing = await prisma.user.findUnique({ where: { email: normalizedEmail } });
    if (existing) {
      return NextResponse.json(
        { error: "Email already in use" },
        { status: 409 }
      );
    }

    const hashed = await hashPassword(password);
    const user = await prisma.user.create({
      data: {
        name,
        email: normalizedEmail,
        password: hashed,
        role: UserRole.EDITOR,
      },
      select: { id: true, name: true, email: true, role: true, createdAt: true },
    });

    const token = generateToken({ userId: user.id, email: user.email });

    return NextResponse.json({ user, token }, { status: 201 });
  } catch (err) {
    console.error("[POST /api/auth/register]", err);
    const serverError = getRegisterServerError(err);

    return NextResponse.json(
      { error: serverError.message },
      { status: serverError.status },
    );
  }
}
