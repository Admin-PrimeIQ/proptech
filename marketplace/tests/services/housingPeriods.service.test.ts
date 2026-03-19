import { afterEach, describe, expect, it, vi } from "vitest";
import { fetchHousingPeriodsCatalog } from "@/app/enterprise/lifestyle-matcher/puntos/services/markers/housingPeriods.service";

describe("housingPeriods.service", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("acepta respuesta directa del backend sin wrapper data", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify({
            years: ["2025"],
            quartersByYear: { "2025": ["3T"] },
            availableQuarters: ["3T"],
          }),
          { status: 200, headers: { "Content-Type": "application/json" } }
        )
      )
    );

    const result = await fetchHousingPeriodsCatalog();
    expect(result).toEqual({
      years: ["2025"],
      quartersByYear: { "2025": ["3T"] },
      availableQuarters: ["3T"],
    });
  });

  it("acepta respuesta envuelta en data", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify({
            data: {
              years: ["2024"],
              quartersByYear: { "2024": ["1T", "2T"] },
              availableQuarters: ["1T", "2T"],
            },
          }),
          { status: 200, headers: { "Content-Type": "application/json" } }
        )
      )
    );

    const result = await fetchHousingPeriodsCatalog();
    expect(result).toEqual({
      years: ["2024"],
      quartersByYear: { "2024": ["1T", "2T"] },
      availableQuarters: ["1T", "2T"],
    });
  });
});
