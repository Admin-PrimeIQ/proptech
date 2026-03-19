import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { handleApiError, successResponse } from "@/lib/api-helpers";
import { deleteFileFromS3 } from "@/lib/s3-upload";
import {
  resolveCategoria,
  resolveTipoOperacion,
  resolveUbicacion,
  resolveZonaByIdPublic,
  createVendedor,
  getOrCreateVendedorForUserId,
} from "@/lib/api-propiedades";
import { getSessionWithRoles } from "@/lib/auth-helpers";

function toNum(v: number | string | null | undefined): number | null {
  if (v === null || v === undefined || v === "") return null;
  const n = typeof v === "string" ? parseFloat(v) : v;
  return Number.isNaN(n) ? null : n;
}

function toDecimal(v: number | string | null | undefined) {
  const n = toNum(v);
  return n == null ? null : n;
}

function mapPropiedadToResponse(p: {
  id: bigint;
  idPublic: string;
  nombrePropiedad: string;
  referenciaCorta: string | null;
  descripcionGeneral: string | null;
  estadoPublicacion: string;
  direccionPublica: string | null;
  latitud: unknown;
  longitud: unknown;
  habitaciones: number | null;
  banos: number | null;
  parqueos: number | null;
  metrosConstruccion: number | null;
  metrosTerreno: number | null;
  anoConstruccion: number | null;
  fechaCreacion: Date;
  fechaActualizacion: Date;
  categoria?: { idPublic: string; nombre: string; slug: string } | null;
  tipoOperacion?: { idPublic: string; nombre: string } | null;
  zona?: {
    idPublic: string;
    nombre: string;
    ciudad?: { nombre: string; departamento?: { nombre: string; pais?: { nombre: string } } };
  } | null;
  vendedor?: {
    idPublic: string;
    nombre: string;
    usuario?: { correo: string; telefono: string | null } | null;
    foto?: { url: string } | null;
    _count?: { propiedades: number };
  } | null;
  precio?: {
    idPublic: string;
    moneda: string;
    precio: unknown;
    precioPorM2Construccion: unknown;
    mantenimiento: unknown;
  } | null;
  imagenes?: Array<{ idPublic: string; orden: number; esPortada: boolean; recurso: { idPublic: string; url: string } }>;
  propiedadesAmenidades?: Array<{ amenidad: { idPublic: string; nombreAmenidad: string } }>;
  planesPiso?: Array<{ idPublic: string; nombreDelPlano: string; orden: number; recurso: { idPublic: string; url: string } }>;
  resenas?: Array<{ nombreCompleto: string; mensaje: string; fechaCreacion: Date }>;
}) {
  return {
    idPublic: p.idPublic,
    nombrePropiedad: p.nombrePropiedad,
    referenciaCorta: p.referenciaCorta,
    descripcionGeneral: p.descripcionGeneral,
    estadoPublicacion: p.estadoPublicacion,
    categoria: p.categoria
      ? { idPublic: p.categoria.idPublic, nombre: p.categoria.nombre, slug: p.categoria.slug }
      : null,
    tipoOperacion: p.tipoOperacion
      ? { idPublic: p.tipoOperacion.idPublic, nombre: p.tipoOperacion.nombre }
      : null,
    zona: p.zona ? { idPublic: p.zona.idPublic, nombre: p.zona.nombre } : null,
    ciudad: p.zona?.ciudad?.nombre ?? null,
    departamento: p.zona?.ciudad?.departamento?.nombre ?? null,
    pais: p.zona?.ciudad?.departamento?.pais?.nombre ?? null,
    direccionPublica: p.direccionPublica,
    latitud: p.latitud != null ? Number(p.latitud) : null,
    longitud: p.longitud != null ? Number(p.longitud) : null,
    habitaciones: p.habitaciones,
    banos: p.banos,
    parqueos: p.parqueos,
    metrosConstruccion: p.metrosConstruccion,
    metrosTerreno: p.metrosTerreno,
    anoConstruccion: p.anoConstruccion,
    vendedor: p.vendedor
      ? {
          idPublic: p.vendedor.idPublic,
          nombre: p.vendedor.nombre,
          fotoUrl: p.vendedor.foto?.url ?? null,
          correo: p.vendedor.usuario?.correo ?? null,
          telefono: p.vendedor.usuario?.telefono ?? null,
          propiedadesCount: p.vendedor._count?.propiedades ?? 0,
        }
      : null,
    precio: p.precio
      ? {
          idPublic: p.precio.idPublic,
          moneda: p.precio.moneda,
          precio: Number(p.precio.precio),
          precioPorM2Construccion:
            p.precio.precioPorM2Construccion != null
              ? Number(p.precio.precioPorM2Construccion)
              : null,
          mantenimiento:
            p.precio.mantenimiento != null ? Number(p.precio.mantenimiento) : null,
        }
      : null,
    imagenes: (p.imagenes ?? []).map((im) => ({
      idPublic: im.idPublic,
      idRecurso: im.recurso.idPublic,
      url: im.recurso.url,
      orden: im.orden,
      esPortada: im.esPortada,
    })),
    amenidades: (p.propiedadesAmenidades ?? []).map((pa) => ({
      idPublic: pa.amenidad.idPublic,
      nombreAmenidad: pa.amenidad.nombreAmenidad,
    })),
    planesPiso: (p.planesPiso ?? []).map((pp) => ({
      idPublic: pp.idPublic,
      nombreDelPlano: pp.nombreDelPlano,
      idRecurso: pp.recurso.idPublic,
      url: pp.recurso.url,
      orden: pp.orden,
    })),
    reseñasClientes: (p.resenas ?? []).map((r) => ({
      nombreCompleto: r.nombreCompleto,
      mensaje: r.mensaje,
      fechaCreacion: r.fechaCreacion.toISOString(),
    })),
    fechaCreacion: p.fechaCreacion.toISOString(),
    fechaActualizacion: p.fechaActualizacion.toISOString(),
  };
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ idPublic: string }> }
) {
  try {
    const { idPublic } = await params;
    const scope = request.nextUrl.searchParams.get("scope")?.trim() || null;
    const p = await prisma.propiedad.findUnique({
      where: { idPublic },
      include: {
        categoria: true,
        tipoOperacion: true,
        zona: { include: { ciudad: { include: { departamento: { include: { pais: true } } } } } },
        vendedor: {
          select: {
            id: true,
            idPublic: true,
            nombre: true,
            idUsuario: true,
            usuario: { select: { correo: true, telefono: true } },
            foto: true,
            _count: { select: { propiedades: true } },
          },
        },
        precio: true,
        imagenes: { include: { recurso: true } },
        propiedadesAmenidades: { include: { amenidad: true } },
        planesPiso: { include: { recurso: true } },
        resenas: {
          where: { visiblePublico: true },
          orderBy: { fechaCreacion: "desc" },
          select: { nombreCompleto: true, mensaje: true, fechaCreacion: true },
        },
      },
    });
    if (!p) {
      return NextResponse.json({ error: "Propiedad no encontrada" }, { status: 404 });
    }
    const isAdminScope = scope === "admin";
    if (isAdminScope) {
      const { roles, idUsuario } = await getSessionWithRoles();
      const isVendedor = idUsuario != null && roles.includes("VENDEDOR");
      if (isVendedor && (!p.vendedor || p.vendedor.idUsuario !== BigInt(idUsuario))) {
        return NextResponse.json({ error: "No tiene acceso a esta propiedad" }, { status: 403 });
      }
    }
    return successResponse(mapPropiedadToResponse(p));
  } catch (error) {
    return handleApiError(error);
  }
}

type UpdateBody = {
  nombrePropiedad?: string;
  referenciaCorta?: string | null;
  descripcionGeneral?: string | null;
  estadoPublicacion?: string;
  categoria?: string;
  operacionInmobiliaria?: string;
  pais?: string;
  departamento?: string;
  ciudad?: string;
  zona?: string;
  zonaIdPublic?: string | null;
  direccionPublica?: string | null;
  latitud?: string | number | null;
  longitud?: string | number | null;
  habitaciones?: number | string | null;
  banos?: number | string | null;
  parqueos?: number | string | null;
  metroConstruccion?: number | string | null;
  metrosTerreno?: number | string | null;
  anoConstruccion?: number | string | null;
  vendedorIdPublic?: string | null;
  vendedorNuevo?: { nombre: string; idFotoRecurso?: string | null } | null;
  precio?: {
    moneda?: string;
    precio?: number | string;
    precioPorM2Construccion?: number | string | null;
    mantenimiento?: number | string | null;
  };
  imagenes?: Array<{ idRecurso: string; orden?: number; esPortada?: boolean }>;
  amenidades?: string[];
  planesPiso?: Array<{ idPublic?: string; nombreDelPlano: string; idRecurso: string; orden?: number }>;
};

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ idPublic: string }> }
) {
  try {
    const { idPublic } = await params;
    const prop = await prisma.propiedad.findUnique({
      where: { idPublic },
      include: { precio: true, imagenes: true, vendedor: { select: { id: true, idUsuario: true } } },
    });
    if (!prop) {
      return NextResponse.json({ error: "Propiedad no encontrada" }, { status: 404 });
    }

    const { roles, idUsuario: sessionIdUsuario } = await getSessionWithRoles();
    const isVendedor = sessionIdUsuario != null && roles.includes("VENDEDOR");
    if (isVendedor) {
      const vendedor = await getOrCreateVendedorForUserId(BigInt(sessionIdUsuario!));
      if (prop.idVendedor !== vendedor.id) {
        return NextResponse.json({ error: "No puede editar esta propiedad" }, { status: 403 });
      }
    }

    const body = (await request.json()) as UpdateBody;
    const usuario = isVendedor
      ? await prisma.usuario.findUnique({ where: { id: BigInt(sessionIdUsuario!) } })
      : await prisma.usuario.findFirst();
    if (!usuario) {
      return NextResponse.json({ error: "No hay usuario en el sistema" }, { status: 500 });
    }

    let idCategoria = prop.idCategoria;
    if (body.categoria) {
      idCategoria = await resolveCategoria(body.categoria);
    }

    let idTipoOperacion = prop.idTipoOperacionInmobiliaria;
    if (body.operacionInmobiliaria) {
      idTipoOperacion = await resolveTipoOperacion(body.operacionInmobiliaria);
    }

    let idZona: bigint | null = prop.idZona;
    if (body.zonaIdPublic !== undefined) {
      if (body.zonaIdPublic) {
        idZona = await resolveZonaByIdPublic(body.zonaIdPublic);
      } else {
        idZona = null;
      }
    } else if (
      body.pais != null &&
      body.departamento != null &&
      body.ciudad != null
    ) {
      idZona = await resolveUbicacion({
        pais: String(body.pais),
        departamento: String(body.departamento ?? ""),
        ciudad: String(body.ciudad ?? ""),
        zona: body.zona ? String(body.zona) : undefined,
      });
    }

    let idVendedor: bigint | null = prop.idVendedor;
    if (!isVendedor) {
      if (body.vendedorIdPublic !== undefined) {
        if (body.vendedorIdPublic) {
          const v = await prisma.vendedor.findUnique({
            where: { idPublic: body.vendedorIdPublic },
          });
          idVendedor = v?.id ?? null;
        } else {
          idVendedor = null;
        }
      } else if (body.vendedorNuevo?.nombre?.trim()) {
        const { id } = await createVendedor({
          nombre: body.vendedorNuevo.nombre.trim(),
          idUsuario: usuario.id,
          idFotoRecursoPublic: body.vendedorNuevo.idFotoRecurso ?? null,
        });
        idVendedor = id;
      }
    }

    await prisma.propiedad.update({
      where: { id: prop.id },
      data: {
        ...(body.nombrePropiedad !== undefined && {
          nombrePropiedad: body.nombrePropiedad.trim(),
        }),
        ...(body.referenciaCorta !== undefined && {
          referenciaCorta: body.referenciaCorta?.trim() || null,
        }),
        ...(body.descripcionGeneral !== undefined && {
          descripcionGeneral: body.descripcionGeneral?.trim() || null,
        }),
        ...(body.estadoPublicacion !== undefined && {
          estadoPublicacion: String(body.estadoPublicacion),
        }),
        idCategoria,
        idTipoOperacionInmobiliaria: idTipoOperacion,
        idZona,
        ...(body.direccionPublica !== undefined && {
          direccionPublica: body.direccionPublica?.trim() || null,
        }),
        ...(body.latitud !== undefined && { latitud: toDecimal(body.latitud) }),
        ...(body.longitud !== undefined && {
          longitud: toDecimal(body.longitud),
        }),
        ...(body.habitaciones !== undefined && {
          habitaciones: toNum(body.habitaciones) ?? undefined,
        }),
        ...(body.banos !== undefined && { banos: toNum(body.banos) ?? undefined }),
        ...(body.parqueos !== undefined && {
          parqueos: toNum(body.parqueos) ?? undefined,
        }),
        ...(body.metroConstruccion !== undefined && {
          metrosConstruccion: toNum(body.metroConstruccion) ?? undefined,
        }),
        ...(body.metrosTerreno !== undefined && {
          metrosTerreno: toNum(body.metrosTerreno) ?? undefined,
        }),
        ...(body.anoConstruccion !== undefined && {
          anoConstruccion: toNum(body.anoConstruccion) ?? undefined,
        }),
        ...(idVendedor !== undefined && { idVendedor }),
      },
    });

    if (body.precio) {
      const moneda = (body.precio.moneda ?? "GTQ").toString().toUpperCase();
      const precioVal =
        body.precio.precio != null && body.precio.precio !== ""
          ? Number(body.precio.precio)
          : null;
      if (prop.precio) {
        if (precioVal != null && !Number.isNaN(precioVal)) {
          await prisma.precioPropiedad.update({
            where: { id: prop.precio.id },
            data: {
              moneda,
              precio: precioVal,
              precioPorM2Construccion:
                toDecimal(body.precio.precioPorM2Construccion) ?? undefined,
              mantenimiento: toDecimal(body.precio.mantenimiento) ?? undefined,
            },
          });
        }
      } else if (precioVal != null && !Number.isNaN(precioVal)) {
        await prisma.precioPropiedad.create({
          data: {
            idPropiedad: prop.id,
            moneda,
            precio: precioVal,
            precioPorM2Construccion:
              toDecimal(body.precio.precioPorM2Construccion) ?? undefined,
            mantenimiento: toDecimal(body.precio.mantenimiento) ?? undefined,
          },
        });
      }
    }

    if (body.imagenes) {
      await prisma.imagenPropiedad.deleteMany({
        where: { idPropiedad: prop.id },
      });
      for (let i = 0; i < body.imagenes.length; i++) {
        const item = body.imagenes[i];
        const recurso = await prisma.recurso.findUnique({
          where: { idPublic: item.idRecurso },
        });
        if (recurso) {
          await prisma.imagenPropiedad.create({
            data: {
              idPropiedad: prop.id,
              idRecurso: recurso.id,
              orden: item.orden ?? i,
              esPortada: item.esPortada ?? i === 0,
            },
          });
        }
      }
    }

    if (body.amenidades !== undefined) {
      await prisma.propiedadAmenidad.deleteMany({
        where: { idPropiedad: prop.id },
      });
      for (const idPublic of body.amenidades) {
        const a = await prisma.amenidad.findUnique({ where: { idPublic } });
        if (a) {
          await prisma.propiedadAmenidad.create({
            data: { idPropiedad: prop.id, idAmenidad: a.id },
          });
        }
      }
    }

    if (body.planesPiso !== undefined) {
      await prisma.planPiso.deleteMany({
        where: { idPropiedad: prop.id },
      });
      for (let i = 0; i < body.planesPiso.length; i++) {
        const item = body.planesPiso[i];
        const recurso = await prisma.recurso.findUnique({
          where: { idPublic: item.idRecurso },
        });
        if (recurso) {
          await prisma.planPiso.create({
            data: {
              idPropiedad: prop.id,
              idRecurso: recurso.id,
              nombreDelPlano: String(item.nombreDelPlano || "Plano").trim(),
              orden: typeof item.orden === "number" ? item.orden : i,
              activo: true,
            },
          });
        }
      }
    }

    const updated = await prisma.propiedad.findUnique({
      where: { id: prop.id },
      include: {
        categoria: true,
        tipoOperacion: true,
        zona: true,
        vendedor: true,
        precio: true,
        imagenes: { include: { recurso: true } },
        propiedadesAmenidades: { include: { amenidad: true } },
        planesPiso: { include: { recurso: true } },
      },
    });
    return successResponse(mapPropiedadToResponse(updated!));
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ idPublic: string }> }
) {
  try {
    const { idPublic } = await params;
    const p = await prisma.propiedad.findUnique({
      where: { idPublic },
      include: { imagenes: { include: { recurso: true } } },
    });
    if (!p) {
      return NextResponse.json({ error: "Propiedad no encontrada" }, { status: 404 });
    }

    const { roles, idUsuario } = await getSessionWithRoles();
    const isVendedor = idUsuario != null && roles.includes("VENDEDOR");
    if (isVendedor) {
      const vendedor = await getOrCreateVendedorForUserId(BigInt(idUsuario));
      if (p.idVendedor !== vendedor.id) {
        return NextResponse.json({ error: "No puede eliminar esta propiedad" }, { status: 403 });
      }
    }

    const recursoIds: bigint[] = [];
    for (const im of p.imagenes) {
      if (im.recurso?.url && /^https?:\/\//i.test(im.recurso.url)) {
        await deleteFileFromS3(im.recurso.url);
      }
      if (im.recurso) recursoIds.push(im.recurso.id);
    }

    await prisma.imagenPropiedad.deleteMany({ where: { idPropiedad: p.id } });
    if (recursoIds.length > 0) {
      await prisma.recurso.deleteMany({ where: { id: { in: recursoIds } } });
    }

    await prisma.propiedad.delete({ where: { id: p.id } });
    return successResponse({ deleted: true });
  } catch (error) {
    return handleApiError(error);
  }
}
