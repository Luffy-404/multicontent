import { NextRequest, NextResponse } from "next/server";
import { getLiveSports } from "@/services/sports/aggregator";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const league = searchParams.get("league") ?? undefined;
  const data = await getLiveSports(league);

  return NextResponse.json(data);
}
