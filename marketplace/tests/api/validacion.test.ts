/**
 * Prioridad alta: API validación.
 * Verifica que POST con datos inválidos devuelve 400.
 */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { POST as PropiedadesPOST } from "@/app/api/propiedades/route";
import { POST as FavoritosPOST } from "@/app/api/favoritos/route";
import { POST as SolicitudesPOST } from "@/app/api/solicitudes-contacto/route";

vi.mock("@/auth", () => ({
  auth: vi.fn().mockResolvedValue(null),
}));

vi.mock("@/lib/auth-helpers", () => ({
  getSessionWithRoles: vi.fn().mockResolvedValue({ session: null, roles: [], idUsuario: null }),
}));

vi.mock("@/lib/prisma", () => ({
  prisma: {
    usuario: { findUnique: vi.fn().mockResolvedValue(null), findFirst: vi.fn().mockResolvedValue(null) },
    propiedad: { findUnique: vi.fn(), create: vi.fn(), findMany: vi.fn(), count: vi.fn() },
    favorito: { findUnique: vi.fn(), create: vi.fn() },
  },
}));

vi.mock("@/lib/api-propiedades", () => ({
  getPrimerUsuarioIdPublic: vi.fn().mockResolvedValue("user-uuid"),
  resolveCategoria: vi.fn().mockResolvedValue(BigInt(1)),
  resolveTipoOperacion: vi.fn().mockResolvedValue(BigInt(1)),
  resolveZonaByIdPublic: vi.fn().mockResolvedValue(null),
  resolveUbicacion: vi.fn().mockResolvedValue(null),
  getOrCreateVendedorForUserId: vi.fn(),
  createVendedor: vi.fn(),
}));

describe("API Validación — POST con datos inválidos", () => {
  it("POST /api/propiedades sin nombrePropiedad devuelve 400", async () => {
    const body = {
      nombrePropiedad: "",
      categoria: "casa",
      operacionInmobiliaria: "VENTA",
    };
    const request = new Request("https://example.com/api/propiedades", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const response = await PropiedadesPOST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data).toHaveProperty("error");
    expect(String(data.error)).toMatch(/nombre.*requerido/i);
  });

  it("POST /api/favoritos sin idPropiedadPublic devuelve 400", async () => {
    const { auth } = await import("@/auth");
    const { prisma } = await import("@/lib/prisma");
    vi.mocked(auth).mockResolvedValue({ user: { id: "1", idPublic: "u1" } } as any);
    vi.mocked(prisma.usuario.findUnique).mockResolvedValue({ id: BigInt(1), activo: true } as any);

    const request = new Request("https://example.com/api/favoritos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });

    const response = await FavoritosPOST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data).toHaveProperty("error");
    expect(String(data.error)).toMatch(/idPropiedadPublic|requerido/i);
  });

  it("POST /api/solicitudes-contacto con correo inválido devuelve 400", async () => {
    const body = {
      idPropiedad: "11111111-1111-1111-1111-111111111111",
      nombre: "Juan",
      correo: "correo-invalido",
    };
    const request = new Request("https://example.com/api/solicitudes-contacto", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const response = await SolicitudesPOST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data).toHaveProperty("error");
  });

  it("POST /api/solicitudes-contacto sin nombre devuelve 400", async () => {
    const body = {
      idPropiedad: "11111111-1111-1111-1111-111111111111",
      nombre: "",
      correo: "test@example.com",
    };
    const request = new Request("https://example.com/api/solicitudes-contacto", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const response = await SolicitudesPOST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data).toHaveProperty("error");
  });
});
