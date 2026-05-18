const TECHNOLOGY_CATEGORY = "Technology";

const CATEGORY_ALIASES: Record<string, string> = {
  ai: TECHNOLOGY_CATEGORY,
  artificialintelligence: TECHNOLOGY_CATEGORY,
  scitech: TECHNOLOGY_CATEGORY,
  scienceandtechnology: TECHNOLOGY_CATEGORY,
  sciandtech: TECHNOLOGY_CATEGORY,
  technology: TECHNOLOGY_CATEGORY,
  tech: TECHNOLOGY_CATEGORY,
};

function toCategoryKey(value?: string | null) {
  return (
    value
      ?.toLowerCase()
      .replace(/&/g, "and")
      .replace(/[^a-z0-9]+/g, "")
      .trim() ?? ""
  );
}

export function normalizeCategoryName(category?: string | null) {
  const key = toCategoryKey(category);

  return CATEGORY_ALIASES[key] ?? category?.trim() ?? "General";
}

export function categoryMatchesQuery(category: string, query: string) {
  return toCategoryKey(normalizeCategoryName(category)) === toCategoryKey(normalizeCategoryName(query));
}
