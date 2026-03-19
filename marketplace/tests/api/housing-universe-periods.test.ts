import { beforeEach, describe, expect, it, vi } from "vitest";
import { GET } from "@/app/api/housing-universe/periods/route";

const { mockQueryRaw } = vi.hoisted(() => ({
  mockQueryRaw: vi.fn(),
}));

vi.mock("@/lib/prisma", () => ({
  prisma: {
    $queryRaw: mockQueryRaw,
  },
}));

describe("GET /api/housing-universe/periods", () => {
  beforeEach(() => {
    mockQueryRaw.mockReset();
  });

  it("separa año y trimestre desde `periodo` y normaliza Tn/nT", async () => {
    mockQueryRaw.mockResolvedValueOnce([
      { anio: "2025", trimestre: "3T" },
      { anio: "2025", trimestre: "T2" },
      { anio: "2024", trimestre: "1t" },
      { anio: "2024", trimestre: "4T" },
      { anio: "invalido", trimestre: "9T" },
      { anio: null, trimestre: null },
    ]);

    const response = await GET();
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.years).toEqual(["2025", "2024"]);
    expect(payload.quartersByYear).toEqual({
      "2025": ["2T", "3T"],
      "2024": ["1T", "4T"],
    });
    expect(payload.availableQuarters).toEqual(["1T", "2T", "3T", "4T"]);
    expect(mockQueryRaw).toHaveBeenCalledTimes(1);
  });
});
