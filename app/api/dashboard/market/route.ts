import { NextResponse } from "next/server";
import { getDashboardSettings } from "@/services/dashboard/dashboardConfig";
import { getMarketData } from "@/services/dashboard/market";

function getSymbols(metadata: unknown) {
  if (!metadata || typeof metadata !== "object" || !("symbols" in metadata)) {
    return undefined;
  }

  const symbols = (metadata as { symbols?: unknown }).symbols;
  return Array.isArray(symbols) ? symbols.filter((item): item is string => typeof item === "string") : undefined;
}

export async function GET() {
  const settings = await getDashboardSettings();
  const widget = settings.widgets.find((item) => item.key === "global-markets");
  const markets = await getMarketData(getSymbols(widget?.metadata));

  return NextResponse.json({ markets });
}
