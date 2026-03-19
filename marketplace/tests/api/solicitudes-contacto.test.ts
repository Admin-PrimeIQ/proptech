/**
 * Prioridad alta: Solicitudes de contacto.
 * Verifica POST, GET y PATCH en diferentes escenarios.
 */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { GET, POST } from "@/app/api/solicitudes-contacto/route";
import { PATCH } from "@/app/api/solicitudes-contacto/[idPublic]/route";

const ID_PROPIEDAD_VALIDA = "11111111-1111-1111-1111-111111111111";
const ID_PROPIEDAD_INEXISTENTE = "00000000-0000-0000-0000-000000000000";
const ID_SOLICITUD_INEXISTENTE = "00000000-0000-0000-0000-000000000000";
const ID_SOLICITUD_VALIDA = "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa";

vi.mock("@/lib/auth-helpers", () => ({
  getSessionWithRoles: vi.fn().mockResolvedValue({ session: null, roles: [], idUsuario: null }),
}));

vi.mock("@/lib/api-propiedades", () => ({
  getOrCreateVendedorForUserId: vi.fn(),
}));

vi.mock("@/lib/prisma", () => ({
  prisma: {
    solicitudContacto: {
      findMany: vi.fn().mockResolvedValue([]),
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
    },
    propiedad: {
      findUnique: vi.fn(),
    },
  },
}));

describe("Solicitudes de contacto", () => {
  beforeEach(async () => {
    const { prisma } = await import("@/lib/prisma");
    vi.mocked(prisma.solicitudContacto.findMany).mockResolvedValue([]);
    vi.mocked(prisma.solicitudContacto.findUnique).mockResolvedValue(null);
    vi.mocked(prisma.solicitudContacto.create).mockResolvedValue({
      id: BigInt(1),
      idPublic: ID_SOLICITUD_VALIDA,
      nombre: "Juan",
      correo: "juan@test.com",
      telefono: null,
      mensaje: null,
      estado: "PENDIENTE",
      contactado: false,
      fechaCreacion: new Date(),
      idPropiedad: BigInt(1),
      idUsuario: null,
    } as any);
    vi.mocked(prisma.propiedad.findUnique).mockResolvedValue(null);
  });

  it("POST con propiedad inexistente devuelve 404", async () => {
    const { prisma } = await import("@/lib/prisma");
    vi.mocked(prisma.propiedad.findUnique).mockResolvedValue(null);

    const body = {
      idPropiedad: ID_PROPIEDAD_INEXISTENTE,
      nombre: "Juan",
      correo: "juan@test.com",
    };
    const request = new Request("https://example.com/api/solicitudes-contacto", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data).toHaveProperty("error");
    expect(String(data.error)).toMatch(/Propiedad no encontrada/i);
  });

  it("POST con datos válidos y propiedad existente devuelve 200", async () => {
    const { prisma } = await import("@/lib/prisma");
    vi.mocked(prisma.propiedad.findUnique).mockResolvedValue({
      id: BigInt(1),
      idPublic: ID_PROPIEDAD_VALIDA,
    } as any);

    const body = {
      idPropiedad: ID_PROPIEDAD_VALIDA,
      nombre: "Juan Pérez",
      correo: "juan@example.com",
      telefono: "12345678",
      mensaje: "Me interesa la propiedad",
    };
    const request = new Request("https://example.com/api/solicitudes-contacto", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toHaveProperty("idPublic");
    expect(data).toHaveProperty("mensaje");
    expect(String(data.mensaje)).toMatch(/enviada|correctamente/i);
  });

  it("GET devuelve 200 con lista", async () => {
    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(Array.isArray(data)).toBe(true);
  });

  it("PATCH con id inexistente devuelve 404", async () => {
    const { prisma } = await import("@/lib/prisma");
    vi.mocked(prisma.solicitudContacto.findUnique).mockResolvedValue(null);

    const request = new NextRequest(
      `https://example.com/api/solicitudes-contacto/${ID_SOLICITUD_INEXISTENTE}`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ estado: "CONTACTADO" }),
      }
    );
    const params = Promise.resolve({ idPublic: ID_SOLICITUD_INEXISTENTE });

    const response = await PATCH(request, { params });
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data).toHaveProperty("error");
    expect(String(data.error)).toMatch(/Solicitud no encontrada/i);
  });

  it("PATCH con estado inválido devuelve 400", async () => {
    const request = new NextRequest(
      `https://example.com/api/solicitudes-contacto/${ID_SOLICITUD_VALIDA}`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ estado: "ESTADO_INVALIDO" }),
      }
    );
    const params = Promise.resolve({ idPublic: ID_SOLICITUD_VALIDA });

    const response = await PATCH(request, { params });
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data).toHaveProperty("error");
  });

  it("PATCH con estado válido devuelve 200", async () => {
    const { prisma } = await import("@/lib/prisma");
    vi.mocked(prisma.solicitudContacto.findUnique).mockResolvedValue({
      id: BigInt(1),
      idPublic: ID_SOLICITUD_VALIDA,
      estado: "PENDIENTE",
      contactado: false,
    } as any);
    vi.mocked(prisma.solicitudContacto.update).mockResolvedValue({
      idPublic: ID_SOLICITUD_VALIDA,
      estado: "CONTACTADO",
      contactado: true,
    } as any);

    const request = new NextRequest(
      `https://example.com/api/solicitudes-contacto/${ID_SOLICITUD_VALIDA}`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ estado: "CONTACTADO" }),
      }
    );
    const params = Promise.resolve({ idPublic: ID_SOLICITUD_VALIDA });

    const response = await PATCH(request, { params });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toHaveProperty("estado", "CONTACTADO");
    expect(data).toHaveProperty("contactado", true);
  });
});
