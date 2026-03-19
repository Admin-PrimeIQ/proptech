/**
 * Escenario 1: Ruta/recurso inexistente.
 * Verifica que la API devuelve 404 cuando se solicita un recurso que no existe.
 */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { GET } from "@/app/api/propiedades/[idPublic]/route";

const ID_PUBLICO_INEXISTENTE = "00000000-0000-0000-0000-000000000000";

vi.mock("@/lib/auth-helpers", () => ({
  getSessionWithRoles: vi.fn().mockResolvedValue({ session: null, roles: [], idUsuario: null }),
}));

vi.mock("@/lib/prisma", () => ({
  prisma: {
    propiedad: {
      findUnique: vi.fn(),
    },
  },
}));

describe("Escenario 1: Recurso inexistente (404)", () => {
  beforeEach(() => {
    vi.mocked(prisma.propiedad.findUnique).mockResolvedValue(null);
  });

  it("GET /api/propiedades/[idPublic] con id inexistente devuelve 404", async () => {
    const url = `https://example.com/api/propiedades/${ID_PUBLICO_INEXISTENTE}`;
    const request = new NextRequest(url, { method: "GET" });
    const params = Promise.resolve({ idPublic: ID_PUBLICO_INEXISTENTE });

    const response = await GET(request, { params });
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data).toHaveProperty("error");
    expect(String(data.error).toLowerCase()).toMatch(/no encontrada|not found/i);
  });
});
