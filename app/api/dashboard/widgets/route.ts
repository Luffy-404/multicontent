import { NextResponse } from "next/server";
import { getDashboardSettings } from "@/services/dashboard/dashboardConfig";

export async function GET() {
  const settings = await getDashboardSettings();
  return NextResponse.json(settings);
}
