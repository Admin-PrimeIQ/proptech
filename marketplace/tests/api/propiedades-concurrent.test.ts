/**
 * Escenario 2: Dos usuarios agregan una propiedad a la vez.
 * Verifica que dos POST en paralelo pueden completarse (200) sin romper por concurrencia.
 */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { POST } from "@/app/api/propiedades/route";

const bodyValido = {
  nombrePropiedad: "Propiedad Test A",
  categoria: "casa",
  operacionInmobiliaria: "VENTA",
};

const bodyValidoB = {
  nombrePropiedad: "Propiedad Test B",
  categoria: "casa",
  operacionInmobiliaria: "VENTA",
};

vi.mock("@/lib/auth-helpers", () => ({
  getSessionWithRoles: vi.fn().mockResolvedValue({
    session: { user: { id: "1", idPublic: "user-uuid-1" } },
    roles: ["VENDEDOR"],
    idUsuario: 1,
  }),
}));

vi.mock("@/lib/api-propiedades", () => ({
  getPrimerUsuarioIdPublic: vi.fn().mockResolvedValue("user-uuid-1"),
  resolveCategoria: vi.fn().mockResolvedValue(BigInt(1)),
  resolveTipoOperacion: vi.fn().mockResolvedValue(BigInt(1)),
  resolveZonaByIdPublic: vi.fn().mockResolvedValue(null),
  resolveUbicacion: vi.fn().mockResolvedValue(null),
  createVendedor: vi.fn().mockResolvedValue({ id: BigInt(10), idPublic: "vendedor-uuid", nombre: "Vendedor" }),
  getOrCreateVendedorForUserId: vi.fn().mockResolvedValue({ id: BigInt(10), idPublic: "vendedor-uuid", nombre: "Vendedor" }),
}));

const createPropiedadMock = (id: number, idPublic: string) => ({
  id: BigInt(id),
  idPublic,
  nombrePropiedad: "Propiedad Test",
  referenciaCorta: null,
  descripcionGeneral: null,
  estadoPublicacion: "BORRADOR",
  fechaCreacion: new Date(),
  fechaActualizacion: new Date(),
  categoria: { idPublic: "cat-1", nombre: "Casa", slug: "casa" },
  tipoOperacion: { idPublic: "tipo-1", nombre: "VENTA" },
  zona: null,
  vendedor: { id: BigInt(10), idPublic: "vendedor-uuid", nombre: "Vendedor" },
  precio: null,
  imagenes: [],
  propiedadesAmenidades: [],
  planesPiso: [],
  resenas: [],
});

vi.mock("@/lib/prisma", () => ({
  prisma: {
    usuario: {
      findUnique: vi.fn().mockResolvedValue({ id: BigInt(1), idPublic: "user-uuid-1" }),
      findFirst: vi.fn().mockResolvedValue({ id: BigInt(1), idPublic: "user-uuid-1" }),
    },
    vendedor: {
      findUnique: vi.fn().mockResolvedValue({ id: BigInt(10), idPublic: "vendedor-uuid", nombre: "Vendedor" }),
      findFirst: vi.fn().mockResolvedValue({ id: BigInt(10), idPublic: "vendedor-uuid", nombre: "Vendedor" }),
    },
    propiedad: {
      create: vi.fn(),
      findUnique: vi.fn(),
    },
    precioPropiedad: { create: vi.fn().mockResolvedValue(undefined) },
    recurso: { findUnique: vi.fn().mockResolvedValue(null) },
    amenidad: { findUnique: vi.fn().mockResolvedValue(null) },
    propiedadAmenidad: { create: vi.fn().mockResolvedValue(undefined) },
    planPiso: { create: vi.fn().mockResolvedValue(undefined) },
  },
}));

describe("Escenario 2: Dos usuarios agregan propiedad a la vez", () => {
  beforeEach(async () => {
    const { prisma } = await import("@/lib/prisma");
    const prop1 = createPropiedadMock(1, "prop-uuid-1");
    const prop2 = createPropiedadMock(2, "prop-uuid-2");
    vi.mocked(prisma.propiedad.create)
      .mockResolvedValueOnce(prop1 as any)
      .mockResolvedValueOnce(prop2 as any)
      .mockResolvedValue(prop1 as any);
    vi.mocked(prisma.propiedad.findUnique)
      .mockResolvedValueOnce(prop1 as any)
      .mockResolvedValueOnce(prop2 as any)
      .mockResolvedValue(prop1 as any);
  });

  it("dos POST /api/propiedades en paralelo devuelven 200 y crean recursos distintos", async () => {
    const req1 = new Request("https://example.com/api/propiedades", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bodyValido),
    });
    const req2 = new Request("https://example.com/api/propiedades", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bodyValidoB),
    });

    const [res1, res2] = await Promise.all([POST(req1), POST(req2)]);

    expect(res1.status).toBe(200);
    expect(res2.status).toBe(200);

    const data1 = await res1.json();
    const data2 = await res2.json();
    expect(data1).toHaveProperty("idPublic");
    expect(data2).toHaveProperty("idPublic");
    expect(data1.idPublic).not.toBe(data2.idPublic);
  });
});
