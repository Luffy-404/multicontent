import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import { updateDashboardWidget } from "@/services/dashboard/dashboardConfig";

const widgetSchema = z.object({
  key: z.string().min(1),
  enabled: z.boolean().optional(),
  position: z.number().int().min(0).optional(),
  refreshMinutes: z.number().int().min(1).max(240).optional(),
  metadata: z.unknown().optional(),
});

export async function PATCH(request: NextRequest) {
  const user = await getCurrentUser(request);

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const parsed = widgetSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid dashboard widget payload" }, { status: 400 });
  }

  const { key, ...data } = parsed.data;
  const widget = await updateDashboardWidget(key, data);
  return NextResponse.json({ widget });
}
