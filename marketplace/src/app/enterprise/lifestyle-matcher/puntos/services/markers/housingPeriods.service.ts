import type { HousingPeriodsCatalog } from "../../components/lifestyleMatcherPoints.types";

const EMPTY_CATALOG: HousingPeriodsCatalog = {
  years: [],
  quartersByYear: {},
  availableQuarters: [],
};

export async function fetchHousingPeriodsCatalog(): Promise<HousingPeriodsCatalog> {
  const response = await fetch("/api/housing-universe/periods", {
    method: "GET",
    cache: "no-store",
  });

  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    throw new Error((payload as { error?: string })?.error || "No se pudo cargar catálogo de periodos.");
  }

  const payload = await response.json();
  const payloadLike = payload as Partial<HousingPeriodsCatalog> & { data?: Partial<HousingPeriodsCatalog> };
  const data = payloadLike?.data ?? payloadLike;
  if (!data) return EMPTY_CATALOG;

  return {
    years: Array.isArray(data.years) ? data.years.map((item) => String(item)) : [],
    quartersByYear:
      data.quartersByYear && typeof data.quartersByYear === "object"
        ? Object.fromEntries(
            Object.entries(data.quartersByYear).map(([year, quarters]) => [
              String(year),
              Array.isArray(quarters) ? quarters.map((item) => String(item) as HousingPeriodsCatalog["availableQuarters"][number]) : [],
            ])
          )
        : {},
    availableQuarters: Array.isArray(data.availableQuarters)
      ? data.availableQuarters.map((item) => String(item) as HousingPeriodsCatalog["availableQuarters"][number])
      : [],
  };
}
