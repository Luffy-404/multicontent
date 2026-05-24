export type DashboardWidgetType = "markets" | "weather" | "crypto" | "quick-stats";

export type MarketItem = {
  symbol: string;
  name: string;
  price: number;
  changePct: number;
  trend: number[];
  market: string;
};

export type WeatherDay = {
  day: string;
  high: number;
  low: number;
  condition: string;
};

export type WeatherData = {
  city: string;
  temperature: number;
  condition: string;
  humidity: number;
  windKph: number;
  forecast: WeatherDay[];
};

export type CryptoItem = {
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  volume: number;
};

export type QuickStat = {
  key: string;
  label: string;
  value: string;
  change?: string;
};

export type DashboardSectionConfig = {
  id: string;
  slug: string;
  name: string;
  enabled: boolean;
  position: number;
};

export type DashboardWidgetConfig = {
  id: string;
  key: string;
  title: string;
  type: DashboardWidgetType | string;
  enabled: boolean;
  position: number;
  refreshMinutes: number;
  metadata?: unknown;
  section?: DashboardSectionConfig;
};

export type DashboardSettingsConfig = {
  id: string;
  slug: string;
  maintenanceMode: boolean;
  refreshMinutes: number;
  metadata?: unknown;
  widgets: DashboardWidgetConfig[];
};

export type MarketHubData = {
  settings: DashboardSettingsConfig;
  markets: MarketItem[];
  weather: WeatherData;
  crypto: CryptoItem[];
  quickStats: QuickStat[];
};
