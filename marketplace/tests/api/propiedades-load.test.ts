/**
 * Escenario 3: Muchos usuarios ven el listado de propiedades a la vez.
 * Verifica que N peticiones GET en paralelo responden correctamente (200).
 */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { GET } from "@/app/api/propiedades/route";

const CONCURRENT_REQUESTS = 50;

vi.mock("@/lib/auth-helpers", () => ({
  getSessionWithRoles: vi.fn().mockResolvedValue({
    session: null,
    roles: [] as string[],
    idUsuario: null,
  }),
}));

vi.mock("@/lib/prisma", () => ({
  prisma: {
    propiedad: {
      findMany: vi.fn().mockResolvedValue([]),
      count: vi.fn().mockResolvedValue(0),
    },
    ciudad: { findUnique: vi.fn() },
    departamento: { findUnique: vi.fn() },
  },
}));

describe("Escenario 3: Carga — muchos usuarios viendo propiedades", () => {
  beforeEach(async () => {
    const { prisma } = await import("@/lib/prisma");
    vi.mocked(prisma.propiedad.findMany).mockResolvedValue([]);
    vi.mocked(prisma.propiedad.count).mockResolvedValue(0);
  });

  it(`${CONCURRENT_REQUESTS} GET /api/propiedades en paralelo devuelven 200`, async () => {
    const url = "https://example.com/api/propiedades?page=1&limit=20";
    const requests = Array.from({ length: CONCURRENT_REQUESTS }, () =>
      GET(new Request(url, { method: "GET" }))
    );

    const responses = await Promise.all(requests);

    expect(responses).toHaveLength(CONCURRENT_REQUESTS);
    responses.forEach((res, i) => {
      expect(res.status, `Request ${i + 1} debe ser 200`).toBe(200);
    });

    const data = await responses[0].json();
    expect(data).toHaveProperty("data");
    expect(data).toHaveProperty("pagination");
    expect(Array.isArray(data.data)).toBe(true);
  });
});
