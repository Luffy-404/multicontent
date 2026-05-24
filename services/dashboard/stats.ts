import type { QuickStat } from "@/lib/dashboardTypes";

export async function getQuickStats(): Promise<QuickStat[]> {
  return [
    { key: "USDINR", label: "USD/INR", value: "83.18", change: "+0.04%" },
    { key: "GOLD", label: "Gold", value: "$2,338", change: "-0.12%" },
    { key: "OIL", label: "Oil", value: "$79.42", change: "+0.31%" },
    { key: "FEAR", label: "Fear Index", value: "42", change: "Neutral" },
  ];
}
