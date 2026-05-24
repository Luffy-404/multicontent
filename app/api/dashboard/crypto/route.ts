import { NextResponse } from "next/server";
import { getCryptoData } from "@/services/dashboard/crypto";
import { getDashboardSettings } from "@/services/dashboard/dashboardConfig";

function getAssets(metadata: unknown) {
  if (!metadata || typeof metadata !== "object" || !("assets" in metadata)) {
    return undefined;
  }

  const assets = (metadata as { assets?: unknown }).assets;
  return Array.isArray(assets) ? assets.filter((item): item is string => typeof item === "string") : undefined;
}

export async function GET() {
  const settings = await getDashboardSettings();
  const widget = settings.widgets.find((item) => item.key === "crypto");
  const crypto = await getCryptoData(getAssets(widget?.metadata));

  return NextResponse.json({ crypto });
}
