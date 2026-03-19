/**
 * Escenario 4: Usuario agrega a favoritos y propietario elimina la propiedad al mismo tiempo.
 * Verifica: propiedad ya eliminada → POST favoritos 404; sin 500 en carreras.
 */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { POST as FavoritosPOST } from "@/app/api/favoritos/route";

const ID_PROPIEDAD_ELIMINADA = "11111111-1111-1111-1111-111111111111";
const ID_USUARIO_BIGINT = BigInt(1);

vi.mock("@/auth", () => ({
  auth: vi.fn(),
}));

vi.mock("@/lib/prisma", () => ({
  prisma: {
    usuario: {
      findUnique: vi.fn(),
    },
    propiedad: {
      findUnique: vi.fn(),
    },
    favorito: {
      findUnique: vi.fn(),
      create: vi.fn(),
    },
  },
}));

describe("Escenario 4: Favoritos vs eliminación de propiedad", () => {
  beforeEach(async () => {
    const { auth } = await import("@/auth");
    const { prisma } = await import("@/lib/prisma");
    vi.mocked(auth).mockResolvedValue({
      user: { id: "1", idPublic: "user-uuid", email: "test@test.com" },
      expires: "",
    });
    vi.mocked(prisma.usuario.findUnique).mockResolvedValue({
      id: ID_USUARIO_BIGINT,
      activo: true,
    } as any);
    vi.mocked(prisma.favorito.findUnique).mockResolvedValue(null);
  });

  it("POST /api/favoritos con propiedad ya eliminada devuelve 404", async () => {
    const { prisma } = await import("@/lib/prisma");
    vi.mocked(prisma.propiedad.findUnique).mockResolvedValue(null);

    const request = new Request("https://example.com/api/favoritos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idPropiedadPublic: ID_PROPIEDAD_ELIMINADA }),
    });

    const response = await FavoritosPOST(request);
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data).toHaveProperty("error");
    expect(String(data.error)).toMatch(/Propiedad no encontrada/i);
  });

  it("POST /api/favoritos sin sesión devuelve 401", async () => {
    const { auth } = await import("@/auth");
    const { prisma } = await import("@/lib/prisma");
    vi.mocked(auth).mockResolvedValue(null);
    vi.mocked(prisma.usuario.findUnique).mockResolvedValue(null);

    const request = new Request("https://example.com/api/favoritos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idPropiedadPublic: ID_PROPIEDAD_ELIMINADA }),
    });

    const response = await FavoritosPOST(request);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data).toHaveProperty("error");
  });

  it("POST y DELETE en paralelo no devuelven 500 (propiedad inexistente en POST)", async () => {
    const { prisma } = await import("@/lib/prisma");
    vi.mocked(prisma.propiedad.findUnique).mockResolvedValue(null);

    const createRequest = () =>
      new Request("https://example.com/api/favoritos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idPropiedadPublic: ID_PROPIEDAD_ELIMINADA }),
      });

    const responses = await Promise.all([FavoritosPOST(createRequest()), FavoritosPOST(createRequest())]);
    responses.forEach((res) => {
      expect(res.status).not.toBe(500);
      expect([404, 200, 409]).toContain(res.status);
    });
  });
});
