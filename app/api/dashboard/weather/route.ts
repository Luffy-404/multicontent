import { NextResponse } from "next/server";
import { getDashboardSettings } from "@/services/dashboard/dashboardConfig";
import { getWeatherData } from "@/services/dashboard/weather";

function getCity(metadata: unknown) {
  if (!metadata || typeof metadata !== "object" || !("city" in metadata)) {
    return undefined;
  }

  const city = (metadata as { city?: unknown }).city;
  return typeof city === "string" ? city : undefined;
}

export async function GET() {
  const settings = await getDashboardSettings();
  const widget = settings.widgets.find((item) => item.key === "weather");
  const weather = await getWeatherData(getCity(widget?.metadata));

  return NextResponse.json({ weather });
}
