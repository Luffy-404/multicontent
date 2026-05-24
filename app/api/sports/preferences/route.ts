import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { saveSportsPreferences } from "@/services/sports/aggregator";

const sportsPreferencesSchema = z.object({
  sport: z.array(z.string()).max(8).optional(),
  leagues: z.array(z.string()).max(16).optional(),
  teams: z.array(z.string()).max(24).optional(),
});

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  const parsed = sportsPreferencesSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid sports preferences payload" }, { status: 400 });
  }

  const result = await saveSportsPreferences(parsed.data, request);

  if (!result.saved) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json(result);
}
