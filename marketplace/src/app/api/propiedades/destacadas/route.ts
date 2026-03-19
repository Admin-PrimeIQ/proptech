import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { handleApiError, successResponse } from "@/lib/api-helpers";

function shuffleInPlace<T>(arr: T[]): T[] {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = Math.min(20, Math.max(1, parseInt(searchParams.get("limit") || "20", 10)));

    // 1) Top propiedades por cantidad de favoritos
    const grouped = await prisma.favorito.groupBy({
      by: ["idPropiedad"],
      _count: { idPropiedad: true },
      orderBy: { _count: { idPropiedad: "desc" } },
      take: limit,
    });

    const topIds: bigint[] = grouped.map((g) => g.idPropiedad);
    const topSet = new Set(topIds.map((v) => v.toString()));

    // Helper para mapear Propiedad al shape ApiPropiedadItem (compatible con mapApiPropiedadToCardItem)
    const mapPropiedad = (p: any) => ({
      idPublic: p.idPublic,
      nombrePropiedad: p.nombrePropiedad,
      referenciaCorta: p.referenciaCorta ?? null,
      direccionPublica: p.direccionPublica ?? null,
      habitaciones: p.habitaciones ?? null,
      banos: p.banos ?? null,
      parqueos: p.parqueos ?? null,
      metrosConstruccion: p.metrosConstruccion ?? null,
      metrosTerreno: p.metrosTerreno ?? null,
      tipoOperacion: p.tipoOperacion ? { nombre: p.tipoOperacion.nombre } : null,
      zona: p.zona ? { nombre: p.zona.nombre } : null,
      vendedor: p.vendedor ? { nombre: p.vendedor.nombre } : null,
      precio: p.precio ? { precio: Number(p.precio.precio), moneda: p.precio.moneda } : null,
      imagenes: Array.isArray(p.imagenes)
        ? p.imagenes.map((im: any) => ({ url: im.recurso?.url, esPortada: im.esPortada }))
        : [],
    });

    let topProps: any[] = [];
    if (topIds.length > 0) {
      topProps = await prisma.propiedad.findMany({
        where: { id: { in: topIds } },
        include: {
          tipoOperacion: { select: { nombre: true } },
          zona: { select: { nombre: true } },
          vendedor: { select: { nombre: true } },
          precio: { select: { precio: true, moneda: true } },
          imagenes: {
            orderBy: [{ esPortada: "desc" }, { orden: "asc" }],
            take: 5,
            include: { recurso: { select: { url: true } } },
          },
        },
      });
      // Respetar el orden por conteo (groupBy) y no por orden de findMany
      const byId = new Map(topProps.map((p) => [p.id.toString(), p]));
      topProps = topIds.map((id) => byId.get(id.toString())).filter(Boolean);
    }

    const faltantes = Math.max(0, limit - topProps.length);
    let extras: any[] = [];

    if (faltantes > 0) {
      // 2) Relleno: tomar candidatos y mezclar en memoria (evita queryRaw y mantiene arquitectura)
      // Traemos un pool mayor para poder mezclar y evitar sesgo
      const poolSize = Math.min(200, faltantes * 10);
      const candidates = await prisma.propiedad.findMany({
        where: topIds.length > 0 ? { id: { notIn: topIds } } : undefined,
        take: poolSize,
        orderBy: { fechaCreacion: "desc" },
        include: {
          tipoOperacion: { select: { nombre: true } },
          zona: { select: { nombre: true } },
          vendedor: { select: { nombre: true } },
          precio: { select: { precio: true, moneda: true } },
          imagenes: {
            orderBy: [{ esPortada: "desc" }, { orden: "asc" }],
            take: 5,
            include: { recurso: { select: { url: true } } },
          },
        },
      });

      const unique = candidates.filter((p) => !topSet.has(p.id.toString()));
      shuffleInPlace(unique);
      extras = unique.slice(0, faltantes);
    }

    const finalList = [...topProps, ...extras].map(mapPropiedad);
    return successResponse(finalList);
  } catch (error) {
    return handleApiError(error);
  }
}

