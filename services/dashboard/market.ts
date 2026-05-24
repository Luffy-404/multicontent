import { prisma } from "@/lib/prisma";
import type { MarketItem } from "@/lib/dashboardTypes";

const mockMarkets: MarketItem[] = [
  { symbol: "NIFTY", name: "NIFTY 50", price: 22968.4, changePct: 0.42, market: "India", trend: [22, 24, 23, 26, 27, 29] },
  { symbol: "SENSEX", name: "SENSEX", price: 75410.2, changePct: 0.36, market: "India", trend: [72, 73, 72, 74, 75, 75.4] },
  { symbol: "NASDAQ", name: "NASDAQ", price: 18477.9, changePct: -0.18, market: "US", trend: [18.8, 18.7, 18.9, 18.6, 18.5, 18.47] },
  { symbol: "SP500", name: "S&P 500", price: 5312.6, changePct: 0.21, market: "US", trend: [5.22, 5.27, 5.29, 5.28, 5.3, 5.31] },
];

export async function getMarketData(symbols?: string[]): Promise<MarketItem[]> {
  const activeSymbols = symbols?.length ? symbols : mockMarkets.map((item) => item.symbol);
  const data = mockMarkets.filter((item) => activeSymbols.includes(item.symbol));

  try {
    await Promise.all(
      data.map((item) =>
        prisma.marketSnapshot.create({
          data: item,
        }),
      ),
    );
  } catch {
    // Snapshot writes are opportunistic until external providers are connected.
  }

  return data;
}
