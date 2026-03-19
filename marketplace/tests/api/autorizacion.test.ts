/**
 * Prioridad alta: API autorización.
 * Verifica que DELETE/PUT propiedad sin permiso devuelve 403.
 */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { DELETE, PUT } from "@/app/api/propiedades/[idPublic]/route";

const ID_PROPIEDAD = "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa";
const VENDEDOR_PROPIETARIO = BigInt(20);
const VENDEDOR_OTRO = BigInt(10);

vi.mock("@/lib/auth-helpers", () => ({
  getSessionWithRoles: vi.fn(),
}));

vi.mock("@/lib/api-propiedades", () => ({
  getOrCreateVendedorForUserId: vi.fn(),
}));

vi.mock("@/lib/s3-upload", () => ({
  deleteFileFromS3: vi.fn().mockResolvedValue(undefined),
}));

vi.mock("@/lib/prisma", () => ({
  prisma: {
    propiedad: {
      findUnique: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    imagenPropiedad: { deleteMany: vi.fn().mockResolvedValue(undefined), create: vi.fn() },
    recurso: { deleteMany: vi.fn().mockResolvedValue(undefined), findUnique: vi.fn() },
    usuario: { findUnique: vi.fn(), findFirst: vi.fn() },
    vendedor: { findUnique: vi.fn() },
    precioPropiedad: { upsert: vi.fn().mockResolvedValue(undefined) },
    categoriaPropiedad: { findUnique: vi.fn(), findFirst: vi.fn() },
    tipoOperacionInmobiliaria: { findUnique: vi.fn(), findFirst: vi.fn() },
    zona: { findUnique: vi.fn() },
    propiedadAmenidad: { deleteMany: vi.fn(), create: vi.fn() },
    planPiso: { deleteMany: vi.fn(), create: vi.fn() },
  },
}));

describe("API Autorización — DELETE/PUT propiedad sin permiso", () => {
  beforeEach(async () => {
    const { getSessionWithRoles } = await import("@/lib/auth-helpers");
    const { getOrCreateVendedorForUserId } = await import("@/lib/api-propiedades");
    const { prisma } = await import("@/lib/prisma");

    vi.mocked(getSessionWithRoles).mockResolvedValue({
      session: { user: { id: "1", idPublic: "user-1" } },
      roles: ["VENDEDOR"],
      idUsuario: 1,
    });

    vi.mocked(getOrCreateVendedorForUserId).mockResolvedValue({
      id: VENDEDOR_OTRO,
      idPublic: "vendedor-otro",
      nombre: "Vendedor Otro",
    });

    vi.mocked(prisma.propiedad.findUnique).mockResolvedValue({
      id: BigInt(1),
      idPublic: ID_PROPIEDAD,
      idVendedor: VENDEDOR_PROPIETARIO,
      imagenes: [],
      precio: null,
      vendedor: { id: VENDEDOR_PROPIETARIO, idUsuario: BigInt(2) },
    } as any);
  });

  it("DELETE /api/propiedades/[idPublic] sin ser dueño devuelve 403", async () => {
    const request = new NextRequest(`https://example.com/api/propiedades/${ID_PROPIEDAD}`, {
      method: "DELETE",
    });
    const params = Promise.resolve({ idPublic: ID_PROPIEDAD });

    const response = await DELETE(request, { params });
    const data = await response.json();

    expect(response.status).toBe(403);
    expect(data).toHaveProperty("error");
    expect(String(data.error)).toMatch(/No puede eliminar/i);
  });

  it("PUT /api/propiedades/[idPublic] sin ser dueño devuelve 403", async () => {
    const request = new NextRequest(`https://example.com/api/propiedades/${ID_PROPIEDAD}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombrePropiedad: "Nuevo nombre" }),
    });
    const params = Promise.resolve({ idPublic: ID_PROPIEDAD });

    const response = await PUT(request, { params });
    const data = await response.json();

    expect(response.status).toBe(403);
    expect(data).toHaveProperty("error");
    expect(String(data.error)).toMatch(/No puede editar/i);
  });
});
