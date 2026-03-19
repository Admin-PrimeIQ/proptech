import { describe, expect, it, vi, beforeEach } from "vitest";
import { GET } from "@/app/api/housing-universe/geojson/route";

const { mockQueryRaw } = vi.hoisted(() => ({
  mockQueryRaw: vi.fn(),
}));

type MockHousingGeoJsonRow = {
  id: number;
  cod_proyecto: string | null;
  periodo: string | null;
  proyecto: string | null;
  fase: string | null;
  departamento: string | null;
  municipio: string | null;
  categoria: string | null;
  zona: string | null;
  subzona: string | null;
  estado: string | null;
  uso: string | null;
  mercado: string | null;
  desarrollador: string | null;
  precio_promedio: number | null;
  total_unidades: number | null;
  unidades_disponibles: number | null;
  latitud: number;
  longitud: number;
  url_imagen: string | null;
  created_at: Date;
};

const EXPECTED_TOTAL = 96;

vi.mock("@/lib/prisma", () => ({
  prisma: {
    $queryRaw: mockQueryRaw,
  },
}));

function buildMockRows(total: number): MockHousingGeoJsonRow[] {
  return Array.from({ length: total }, (_, index) => ({
    id: index + 1,
    cod_proyecto: `COD-${index + 1}`,
    periodo: "2025 - 3T",
    proyecto: `Proyecto ${index + 1}`,
    fase: "Fase 1",
    departamento: "Guatemala",
    municipio: "Guatemala",
    categoria: index % 3 === 0 ? "vivienda vertical" : index % 3 === 1 ? "vivienda horizontal" : "terreno",
    zona: "Zona 10",
    subzona: `Subzona ${index + 1}`,
    estado: "ACTIVO",
    uso: "Residencial",
    mercado: "Primario",
    desarrollador: "Desarrollador Demo",
    precio_promedio: 7500,
    total_unidades: 120,
    unidades_disponibles: 45,
    latitud: 14.61 + index * 0.0001,
    longitud: -90.52 + index * 0.0001,
    url_imagen: null,
    created_at: new Date("2026-03-18T00:00:00.000Z"),
  }));
}

describe("GET /api/housing-universe/geojson filtro por periodo", () => {
  beforeEach(() => {
    mockQueryRaw.mockReset();
  });

  it("para 2025 - 3T devuelve 96 resultados", async () => {
    const rows = buildMockRows(EXPECTED_TOTAL);
    mockQueryRaw.mockResolvedValueOnce(rows);

    const request = new Request("https://example.com/api/housing-universe/geojson?anio=2025&trimestre=3T&limit=5000", {
      method: "GET",
    });
    const response = await GET(request as any);
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(Array.isArray(payload.features)).toBe(true);
    expect(payload.features).toHaveLength(EXPECTED_TOTAL);
    expect(payload?.meta?.total).toBe(EXPECTED_TOTAL);
    expect(mockQueryRaw).toHaveBeenCalledTimes(1);
  });

  it("permite filtrar solo por año", async () => {
    const rows = buildMockRows(40);
    mockQueryRaw.mockResolvedValueOnce(rows);

    const request = new Request("https://example.com/api/housing-universe/geojson?anio=2025&limit=5000", {
      method: "GET",
    });
    const response = await GET(request as any);
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.features).toHaveLength(40);
    expect(payload?.meta?.total).toBe(40);
    expect(mockQueryRaw).toHaveBeenCalledTimes(1);
  });

  it("permite filtrar solo por trimestre", async () => {
    const rows = buildMockRows(20);
    mockQueryRaw.mockResolvedValueOnce(rows);

    const request = new Request("https://example.com/api/housing-universe/geojson?trimestre=3T&limit=5000", {
      method: "GET",
    });
    const response = await GET(request as any);
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.features).toHaveLength(20);
    expect(payload?.meta?.total).toBe(20);
    expect(mockQueryRaw).toHaveBeenCalledTimes(1);
  });
});
