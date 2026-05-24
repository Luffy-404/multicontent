import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";
import type {
  DashboardSectionConfig,
  DashboardSettingsConfig,
  DashboardWidgetConfig,
} from "@/lib/dashboardTypes";

const defaultSections = [
  { slug: "markets", name: "Global Markets", enabled: true, position: 0 },
  { slug: "weather", name: "Weather", enabled: true, position: 1 },
  { slug: "crypto", name: "Crypto", enabled: true, position: 2 },
  { slug: "quick-stats", name: "Quick Stats", enabled: true, position: 3 },
];

const defaultWidgets = [
  {
    key: "global-markets",
    title: "Markets",
    type: "markets",
    sectionSlug: "markets",
    enabled: true,
    position: 0,
    refreshMinutes: 10,
    metadata: { symbols: ["NIFTY", "SENSEX", "NASDAQ", "SP500"] },
  },
  {
    key: "weather",
    title: "Weather",
    type: "weather",
    sectionSlug: "weather",
    enabled: true,
    position: 1,
    refreshMinutes: 30,
    metadata: { city: "New Delhi" },
  },
  {
    key: "crypto",
    title: "Crypto",
    type: "crypto",
    sectionSlug: "crypto",
    enabled: true,
    position: 2,
    refreshMinutes: 5,
    metadata: { assets: ["BTC", "ETH", "SOL"] },
  },
  {
    key: "quick-stats",
    title: "Quick Stats",
    type: "quick-stats",
    sectionSlug: "quick-stats",
    enabled: true,
    position: 3,
    refreshMinutes: 15,
    metadata: { stats: ["USDINR", "GOLD", "OIL", "FEAR"] },
  },
];

function fallbackSettings(): DashboardSettingsConfig {
  const sections: DashboardSectionConfig[] = defaultSections.map((section, index) => ({
    id: `fallback-section-${section.slug}`,
    ...section,
    position: index,
  }));

  return {
    id: "fallback-dashboard-settings",
    slug: "default",
    maintenanceMode: false,
    refreshMinutes: 15,
    metadata: {},
    widgets: defaultWidgets.map((widget, index) => ({
      id: `fallback-widget-${widget.key}`,
      key: widget.key,
      title: widget.title,
      type: widget.type,
      enabled: widget.enabled,
      position: index,
      refreshMinutes: widget.refreshMinutes,
      metadata: widget.metadata,
      section: sections.find((section) => section.slug === widget.sectionSlug),
    })),
  };
}

function toSettingsConfig(settings: {
  id: string;
  slug: string;
  maintenanceMode: boolean;
  refreshMinutes: number;
  metadata: unknown;
  widgets: Array<{
    id: string;
    key: string;
    title: string;
    type: string;
    enabled: boolean;
    position: number;
    refreshMinutes: number;
    metadata: unknown;
    section?: {
      id: string;
      slug: string;
      name: string;
      enabled: boolean;
      position: number;
    };
  }>;
}): DashboardSettingsConfig {
  return {
    id: settings.id,
    slug: settings.slug,
    maintenanceMode: settings.maintenanceMode,
    refreshMinutes: settings.refreshMinutes,
    metadata: settings.metadata,
    widgets: settings.widgets
      .map((widget): DashboardWidgetConfig => ({
        id: widget.id,
        key: widget.key,
        title: widget.title,
        type: widget.type,
        enabled: widget.enabled,
        position: widget.position,
        refreshMinutes: widget.refreshMinutes,
        metadata: widget.metadata,
        section: widget.section,
      }))
      .sort((a, b) => a.position - b.position),
  };
}

function toJsonInput(value: unknown): Prisma.InputJsonValue | undefined {
  if (value === undefined) {
    return undefined;
  }

  return value as Prisma.InputJsonValue;
}

export async function seedDashboardConfig() {
  const settings = await prisma.dashboardSettings.upsert({
    where: { slug: "default" },
    update: {},
    create: {
      slug: "default",
      maintenanceMode: false,
      refreshMinutes: 15,
      metadata: {},
    },
  });

  const sectionBySlug = new Map<string, { id: string }>();

  for (const section of defaultSections) {
    const savedSection = await prisma.dashboardSection.upsert({
      where: { slug: section.slug },
      update: {
        name: section.name,
        enabled: section.enabled,
        position: section.position,
      },
      create: section,
      select: { id: true, slug: true },
    });

    sectionBySlug.set(savedSection.slug, savedSection);
  }

  for (const widget of defaultWidgets) {
    const section = sectionBySlug.get(widget.sectionSlug);

    if (!section) {
      continue;
    }

    await prisma.dashboardWidget.upsert({
      where: { key: widget.key },
      update: {
        title: widget.title,
        type: widget.type,
        sectionId: section.id,
      },
      create: {
        key: widget.key,
        title: widget.title,
        type: widget.type,
        enabled: widget.enabled,
        position: widget.position,
        refreshMinutes: widget.refreshMinutes,
        metadata: widget.metadata,
        sectionId: section.id,
        settingsId: settings.id,
      },
    });
  }
}

export async function getDashboardSettings(): Promise<DashboardSettingsConfig> {
  try {
    await seedDashboardConfig();

    const settings = await prisma.dashboardSettings.findUnique({
      where: { slug: "default" },
      include: {
        widgets: {
          include: { section: true },
          orderBy: { position: "asc" },
        },
      },
    });

    if (!settings) {
      return fallbackSettings();
    }

    return toSettingsConfig(settings);
  } catch (error) {
    console.error("[dashboardConfig] using fallback settings", error);
    return fallbackSettings();
  }
}

export async function updateDashboardSettings(input: {
  maintenanceMode?: boolean;
  refreshMinutes?: number;
  metadata?: unknown;
}) {
  await seedDashboardConfig();
  const data: Prisma.DashboardSettingsUpdateInput = {
    maintenanceMode: input.maintenanceMode,
    refreshMinutes: input.refreshMinutes,
    metadata: toJsonInput(input.metadata),
  };

  return prisma.dashboardSettings.update({
    where: { slug: "default" },
    data,
  });
}

export async function updateDashboardWidget(
  key: string,
  input: {
    enabled?: boolean;
    position?: number;
    refreshMinutes?: number;
    metadata?: unknown;
  },
) {
  await seedDashboardConfig();
  const data: Prisma.DashboardWidgetUpdateInput = {
    enabled: input.enabled,
    position: input.position,
    refreshMinutes: input.refreshMinutes,
    metadata: toJsonInput(input.metadata),
  };

  return prisma.dashboardWidget.update({
    where: { key },
    data,
  });
}
