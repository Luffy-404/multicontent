import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import { updateDashboardSettings } from "@/services/dashboard/dashboardConfig";

const settingsSchema = z.object({
  maintenanceMode: z.boolean().optional(),
  refreshMinutes: z.number().int().min(1).max(240).optional(),
  metadata: z.unknown().optional(),
});

export async function POST(request: NextRequest) {
  const user = await getCurrentUser(request);

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const parsed = settingsSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid dashboard settings payload" }, { status: 400 });
  }

  const settings = await updateDashboardSettings(parsed.data);
  return NextResponse.json({ settings });
}
