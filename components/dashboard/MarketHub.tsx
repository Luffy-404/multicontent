import { CryptoBoard } from "@/components/dashboard/CryptoBoard";
import { DashboardSection } from "@/components/dashboard/DashboardSection";
import { QuickStats } from "@/components/dashboard/QuickStats";
import { WeatherCard } from "@/components/dashboard/WeatherCard";
import type { DashboardWidgetConfig, MarketItem } from "@/lib/dashboardTypes";
import { getCryptoData } from "@/services/dashboard/crypto";
import { getDashboardSettings } from "@/services/dashboard/dashboardConfig";
import { getMarketData } from "@/services/dashboard/market";
import { getQuickStats } from "@/services/dashboard/stats";
import { getWeatherData } from "@/services/dashboard/weather";

function getList(metadata: unknown, key: string) {
  if (!metadata || typeof metadata !== "object" || !(key in metadata)) {
    return undefined;
  }

  const value = (metadata as Record<string, unknown>)[key];
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : undefined;
}

function getString(metadata: unknown, key: string) {
  if (!metadata || typeof metadata !== "object" || !(key in metadata)) {
    return undefined;
  }

  const value = (metadata as Record<string, unknown>)[key];
  return typeof value === "string" ? value : undefined;
}

function widgetEnabled(widgets: DashboardWidgetConfig[], key: string) {
  return widgets.find((widget) => widget.key === key)?.enabled ?? true;
}

function MiniTrend({ trend, positive }: { trend: number[]; positive: boolean }) {
  const values = trend.length ? trend : [1, 1, 1, 1];
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const points = values
    .map((value, index) => {
      const x = (index / Math.max(values.length - 1, 1)) * 70;
      const y = 26 - ((value - min) / range) * 22;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg viewBox="0 0 70 28" className="h-7 w-20" aria-hidden="true">
      <polyline
        points={points}
        fill="none"
        stroke={positive ? "#6BE7FF" : "#9AA4B2"}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function MarketRow({ item }: { item: MarketItem }) {
  const positive = item.changePct >= 0;

  return (
    <div className="grid grid-cols-[1fr_auto_auto] items-center gap-3 border-b border-white/[0.06] py-3 last:border-b-0">
      <div className="min-w-0">
        <p className="font-tight text-sm font-semibold text-[#F8FAFC]">{item.symbol}</p>
        <p className="truncate text-xs text-[#9AA4B2]">{item.name}</p>
      </div>
      <div className="text-right">
        <p className="font-tight text-sm font-semibold tabular-nums text-[#F8FAFC]">
          {item.price.toLocaleString("en-US", { maximumFractionDigits: 2 })}
        </p>
        <p className={`text-xs tabular-nums ${positive ? "text-[#6BE7FF]" : "text-[#9AA4B2]"}`}>
          {positive ? "+" : ""}{item.changePct.toFixed(2)}%
        </p>
      </div>
      <MiniTrend trend={item.trend} positive={positive} />
    </div>
  );
}

export async function MarketHub() {
  const settings = await getDashboardSettings();
  const widgets = settings.widgets;
  const marketWidget = widgets.find((widget) => widget.key === "global-markets");
  const weatherWidget = widgets.find((widget) => widget.key === "weather");
  const cryptoWidget = widgets.find((widget) => widget.key === "crypto");
  const [markets, weather, crypto, quickStats] = await Promise.all([
    getMarketData(getList(marketWidget?.metadata, "symbols")),
    getWeatherData(getString(weatherWidget?.metadata, "city")),
    getCryptoData(getList(cryptoWidget?.metadata, "assets")),
    getQuickStats(),
  ]);

  if (settings.maintenanceMode) {
    return (
      <section className="relative left-1/2 mt-12 w-screen max-w-[1440px] -translate-x-1/2 px-4 md:px-6 xl:px-8">
        <DashboardSection title="Markets • Crypto • Weather" eyebrow="Maintenance">
          <p className="text-sm text-[#9AA4B2]">This dashboard module is temporarily paused by admin settings.</p>
        </DashboardSection>
      </section>
    );
  }

  return (
    <section className="relative left-1/2 mt-12 w-screen max-w-[1440px] -translate-x-1/2 px-4 md:px-6 xl:px-8">
      <div className="mb-5">
        <p className="font-tight text-xs font-bold uppercase tracking-[0.22em] text-[#9AA4B2]">
          Markets • Crypto • Weather
        </p>
        <h2 className="mt-2 font-display text-[32px] font-semibold leading-[38px] text-[#F8FAFC] md:text-[40px] md:leading-[46px]">
          Global signals
        </h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-[1.25fr_0.75fr] lg:gap-6">
        {widgetEnabled(widgets, "global-markets") ? (
          <DashboardSection title="Markets" eyebrow={`Refresh ${marketWidget?.refreshMinutes ?? settings.refreshMinutes}m`}>
            <div className="grid gap-x-5 md:grid-cols-2">
              {markets.map((item) => (
                <MarketRow key={item.symbol} item={item} />
              ))}
            </div>
          </DashboardSection>
        ) : null}

        {widgetEnabled(widgets, "weather") ? <WeatherCard weather={weather} /> : null}
        {widgetEnabled(widgets, "crypto") ? <CryptoBoard items={crypto} /> : null}
        {widgetEnabled(widgets, "quick-stats") ? <QuickStats items={quickStats} /> : null}
      </div>
    </section>
  );
}
