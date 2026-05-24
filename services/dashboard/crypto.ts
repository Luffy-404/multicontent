import { prisma } from "@/lib/prisma";
import type { CryptoItem } from "@/lib/dashboardTypes";

const mockCrypto: CryptoItem[] = [
  { symbol: "BTC", name: "Bitcoin", price: 68240.12, change24h: 1.8, volume: 32200000000 },
  { symbol: "ETH", name: "Ethereum", price: 3812.44, change24h: -0.7, volume: 14200000000 },
  { symbol: "SOL", name: "Solana", price: 171.32, change24h: 3.4, volume: 3100000000 },
];

export async function getCryptoData(assets?: string[]): Promise<CryptoItem[]> {
  const activeAssets = assets?.length ? assets : mockCrypto.map((item) => item.symbol);
  const data = mockCrypto.filter((item) => activeAssets.includes(item.symbol));

  try {
    await Promise.all(
      data.map((item) =>
        prisma.cryptoSnapshot.create({
          data: item,
        }),
      ),
    );
  } catch {
    // Snapshot writes are opportunistic until external providers are connected.
  }

  return data;
}
