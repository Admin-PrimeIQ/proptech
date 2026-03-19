import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { handleApiError, successResponse } from "@/lib/api-helpers";
import {
  getPrimerUsuarioId,
  getPrimerUsuarioIdPublic,
  resolveCategoria,
  resolveTipoOperacion,
  resolveUbicacion,
  resolveZonaByIdPublic,
  createVendedor,
  getOrCreateVendedorForUserId,
} from "@/lib/api-propiedades";
import { getSessionWithRoles } from "@/lib/auth-helpers";

type ImagenItem = { idRecurso: string; orden?: number; esPortada?: boolean };

type CreateBody = {
  creadoPor?: string;
  nombrePropiedad: string;
  referenciaCorta?: string | null;
  descripcionGeneral?: string | null;
  estadoPublicacion?: string;
  categoria: string;
  operacionInmobiliaria: string;
  pais?: string;
  departamento?: string;
  ciudad?: string;
  zona?: string;
  zonaIdPublic?: string;
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
    moneda: string;
    precio: number | string;
    precioPorM2Construccion?: number | string | null;
    mantenimiento?: number | string | null;
  };
  imagenes?: ImagenItem[];
  amenidades?: string[];
  planesPiso?: Array<{ nombreDelPlano: string; idRecurso: string; orden?: number }>;
};

function toNum(v: number | string | null | undefined): number | null {
  if (v === null || v === undefined || v === "") return null;
  const n = typeof v === "string" ? parseFloat(v) : v;
  return Number.isNaN(n) ? null : n;
}

function toDecimal(v: number | string | null | undefined) {
  const n = toNum(v);
  return n == null ? null : n;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || "20", 10)));
    const skip = (page - 1) * limit;
    const categoriaIdPublic = searchParams.get("categoriaIdPublic")?.trim() || null;
    const tipoOperacionIdPublic = searchParams.get("tipoOperacionIdPublic")?.trim() || null;
    const departamentoIdPublic = searchParams.get("departamentoIdPublic")?.trim() || null;
    const ciudadIdPublic = searchParams.get("ciudadIdPublic")?.trim() || null;
    const vendedorIdPublic = searchParams.get("vendedorIdPublic")?.trim() || null;
    const search = searchParams.get("search")?.trim() || null;
    const habitaciones = searchParams.get("habitaciones")?.trim() || null;
    const banos = searchParams.get("banos")?.trim() || null;
    const parqueos = searchParams.get("parqueos")?.trim() || null;
    const precioMin = searchParams.get("precioMin")?.trim() || null;
    const precioMax = searchParams.get("precioMax")?.trim() || null;
    const moneda = searchParams.get("moneda")?.trim().toUpperCase() || null;
    const scope = searchParams.get("scope")?.trim() || null;

    // Construir where clause
    const where: any = {};
    const andConditions: any[] = [];

    if (categoriaIdPublic) {
      where.categoria = { idPublic: categoriaIdPublic };
    }

    if (tipoOperacionIdPublic) {
      where.tipoOperacion = { idPublic: tipoOperacionIdPublic };
    }

    // Solo en contexto admin: si el usuario es VENDEDOR, filtrar por sus propiedades
    const { roles, idUsuario } = await getSessionWithRoles();
    const isVendedor = idUsuario != null && roles.includes("VENDEDOR");
    const isAdminScope = scope === "admin";
    if (isAdminScope && isVendedor && idUsuario != null) {
      where.vendedor = { idUsuario: BigInt(idUsuario) };
    } else if (vendedorIdPublic) {
      where.vendedor = { idPublic: vendedorIdPublic };
    }

    // Filtrar por ciudad (a través de zona -> ciudad)
    if (ciudadIdPublic) {
      const ciudad = await prisma.ciudad.findUnique({
        where: { idPublic: ciudadIdPublic },
        include: { zonas: true },
      });
      if (ciudad) {
        const zonaIds = ciudad.zonas.map((z) => z.id);
        if (zonaIds.length > 0) {
          where.idZona = { in: zonaIds };
        } else {
          // Si no hay zonas, no hay propiedades
          where.idZona = { in: [] };
        }
      }
    }
    // Filtrar por departamento (a través de zona -> ciudad -> departamento)
    else if (departamentoIdPublic) {
      const departamento = await prisma.departamento.findUnique({
        where: { idPublic: departamentoIdPublic },
        include: { ciudades: { include: { zonas: true } } },
      });
      if (departamento) {
        const zonaIds = departamento.ciudades.flatMap((c) => c.zonas.map((z) => z.id));
        if (zonaIds.length > 0) {
          where.idZona = { in: zonaIds };
        } else {
          // Si no hay zonas, no hay propiedades
          where.idZona = { in: [] };
        }
      }
    }

    // Filtros numéricos (mayor o igual, excluyendo null)
    // Sintaxis correcta de Prisma: combinar not: null y gte en el mismo objeto
    if (habitaciones) {
      const habNum = parseInt(habitaciones, 10);
      if (!isNaN(habNum) && habNum > 0) {
        andConditions.push({
          habitaciones: {
            not: null,
            gte: habNum,
          },
        });
      }
    }
    if (banos) {
      const banosNum = parseInt(banos, 10);
      if (!isNaN(banosNum) && banosNum > 0) {
        andConditions.push({
          banos: {
            not: null,
            gte: banosNum,
          },
        });
      }
    }
    if (parqueos) {
      const parqNum = parseInt(parqueos, 10);
      if (!isNaN(parqNum) && parqNum > 0) {
        andConditions.push({
          parqueos: {
            not: null,
            gte: parqNum,
          },
        });
      }
    }

    // Búsqueda por palabra clave en nombrePropiedad o vendedor
    if (search) {
      andConditions.push({
        OR: [
          { nombrePropiedad: { contains: search, mode: "insensitive" } },
          { vendedor: { nombre: { contains: search, mode: "insensitive" } } },
        ],
      });
    }

    // Filtro por precio y moneda
    if (precioMin || precioMax || moneda) {
      const precioCondition: any = {};
      
      if (moneda) {
        precioCondition.moneda = moneda;
      }
      
      const precioRange: any = {};
      if (precioMin) {
        const minVal = parseFloat(precioMin);
        if (!isNaN(minVal)) {
          precioRange.gte = minVal;
        }
      }
      
      if (precioMax) {
        const maxVal = parseFloat(precioMax);
        if (!isNaN(maxVal)) {
          precioRange.lte = maxVal;
        }
      }
      
      if (Object.keys(precioRange).length > 0) {
        precioCondition.precio = precioRange;
      }
      
      if (Object.keys(precioCondition).length > 0) {
        andConditions.push({
          precio: precioCondition,
        });
      }
    }

    // Agregar todas las condiciones AND al where
    if (andConditions.length > 0) {
      where.AND = andConditions;
    }

    const [items, total] = await Promise.all([
      prisma.propiedad.findMany({
        where,
        skip,
        take: limit,
        orderBy: { fechaCreacion: "desc" },
        include: {
          categoria: true,
          tipoOperacion: true,
          zona: true,
          vendedor: true,
          precio: true,
          imagenes: { include: { recurso: true } },
        },
      }),
      prisma.propiedad.count({ where }),
    ]);

    const data = items.map((p) => ({
      idPublic: p.idPublic,
      nombrePropiedad: p.nombrePropiedad,
      referenciaCorta: p.referenciaCorta,
      estadoPublicacion: p.estadoPublicacion,
      categoria: p.categoria ? { idPublic: p.categoria.idPublic, nombre: p.categoria.nombre, slug: p.categoria.slug } : null,
      tipoOperacion: p.tipoOperacion ? { idPublic: p.tipoOperacion.idPublic, nombre: p.tipoOperacion.nombre } : null,
      zona: p.zona ? { idPublic: p.zona.idPublic, nombre: p.zona.nombre } : null,
      direccionPublica: p.direccionPublica,
      habitaciones: p.habitaciones,
      banos: p.banos,
      parqueos: p.parqueos,
      metrosConstruccion: p.metrosConstruccion,
      metrosTerreno: p.metrosTerreno,
      anoConstruccion: p.anoConstruccion,
      precio: p.precio
        ? {
            idPublic: p.precio.idPublic,
            moneda: p.precio.moneda,
            precio: Number(p.precio.precio),
            precioPorM2Construccion: p.precio.precioPorM2Construccion != null ? Number(p.precio.precioPorM2Construccion) : null,
            mantenimiento: p.precio.mantenimiento != null ? Number(p.precio.mantenimiento) : null,
          }
        : null,
      imagenes: p.imagenes.map((i) => ({
        idPublic: i.idPublic,
        idRecurso: i.recurso.idPublic,
        url: i.recurso.url,
        orden: i.orden,
        esPortada: i.esPortada,
      })),
      vendedor: p.vendedor
        ? { idPublic: p.vendedor.idPublic, nombre: p.vendedor.nombre }
        : null,
      fechaCreacion: p.fechaCreacion.toISOString(),
    }));

    return successResponse({
      data,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as CreateBody;
    const {
      creadoPor,
      nombrePropiedad,
      referenciaCorta,
      descripcionGeneral,
      estadoPublicacion = "BORRADOR",
      categoria,
      operacionInmobiliaria,
      pais,
      departamento,
      ciudad,
      zona,
      zonaIdPublic,
      direccionPublica,
      latitud,
      longitud,
      habitaciones,
      banos,
      parqueos,
      metroConstruccion,
      metrosTerreno,
      anoConstruccion,
      vendedorIdPublic,
      vendedorNuevo,
      precio,
      imagenes = [],
      amenidades = [],
      planesPiso = [],
    } = body;

    if (!nombrePropiedad?.trim()) {
      return NextResponse.json(
        { error: "El nombre de la propiedad es requerido" },
        { status: 400 }
      );
    }

    const { session, roles, idUsuario: sessionIdUsuario } = await getSessionWithRoles();
    const isVendedor = sessionIdUsuario != null && roles.includes("VENDEDOR");

    let creadoPorIdPublic = creadoPor;
    let usuario: { id: bigint } | null;
    if (isVendedor && session?.user?.id) {
      usuario = await prisma.usuario.findUnique({
        where: { id: BigInt(sessionIdUsuario!) },
      });
      if (!usuario) {
        return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
      }
      creadoPorIdPublic = session.user.idPublic ?? String(usuario.id);
    } else {
      creadoPorIdPublic = creadoPorIdPublic || (await getPrimerUsuarioIdPublic());
      usuario = await prisma.usuario.findUnique({
        where: { idPublic: creadoPorIdPublic },
      });
    }
    if (!usuario) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
    }

    const idCategoria = await resolveCategoria(categoria);
    const idTipoOperacion = await resolveTipoOperacion(operacionInmobiliaria);

    let idZona: bigint | null = null;
    if (zonaIdPublic) {
      idZona = await resolveZonaByIdPublic(zonaIdPublic);
    } else if (pais && departamento && ciudad) {
      idZona = await resolveUbicacion({
        pais: String(pais),
        departamento: String(departamento ?? ""),
        ciudad: String(ciudad ?? ""),
        zona: zona ? String(zona) : undefined,
      });
    }

    let idVendedor: bigint | null = null;
    if (isVendedor) {
      const vendedor = await getOrCreateVendedorForUserId(usuario.id);
      idVendedor = vendedor.id;
    } else if (vendedorIdPublic) {
      const v = await prisma.vendedor.findUnique({
        where: { idPublic: vendedorIdPublic },
      });
      if (v) idVendedor = v.id;
    } else if (vendedorNuevo?.nombre?.trim()) {
      const { id } = await createVendedor({
        nombre: vendedorNuevo.nombre.trim(),
        idUsuario: usuario.id,
        idFotoRecursoPublic: vendedorNuevo.idFotoRecurso ?? null,
      });
      idVendedor = id;
    }

    const propiedad = await prisma.propiedad.create({
      data: {
        nombrePropiedad: nombrePropiedad.trim(),
        referenciaCorta: referenciaCorta?.trim() || null,
        descripcionGeneral: descripcionGeneral?.trim() || null,
        estadoPublicacion: String(estadoPublicacion || "BORRADOR"),
        idCategoria,
        idTipoOperacionInmobiliaria: idTipoOperacion,
        idZona,
        direccionPublica: direccionPublica?.trim() || null,
        latitud: toDecimal(latitud),
        longitud: toDecimal(longitud),
        habitaciones: toNum(habitaciones) ?? undefined,
        banos: toNum(banos) ?? undefined,
        parqueos: toNum(parqueos) ?? undefined,
        metrosConstruccion: toNum(metroConstruccion) ?? undefined,
        metrosTerreno: toNum(metrosTerreno) ?? undefined,
        anoConstruccion: toNum(anoConstruccion) ?? undefined,
        idVendedor: idVendedor ?? undefined,
        creadoPor: usuario.id,
      },
    });

    if (precio && (precio.precio != null && precio.precio !== "")) {
      const moneda = String(precio.moneda || "GTQ").toUpperCase();
      const precioVal = Number(precio.precio);
      if (!Number.isNaN(precioVal)) {
        await prisma.precioPropiedad.create({
          data: {
            idPropiedad: propiedad.id,
            moneda,
            precio: precioVal,
            precioPorM2Construccion: toDecimal(precio.precioPorM2Construccion) ?? undefined,
            mantenimiento: toDecimal(precio.mantenimiento) ?? undefined,
          },
        });
      }
    }

    for (let i = 0; i < imagenes.length; i++) {
      const item = imagenes[i];
      const recurso = await prisma.recurso.findUnique({
        where: { idPublic: item.idRecurso },
      });
      if (recurso) {
        await prisma.imagenPropiedad.create({
          data: {
            idPropiedad: propiedad.id,
            idRecurso: recurso.id,
            orden: item.orden ?? i,
            esPortada: item.esPortada ?? i === 0,
          },
        });
      }
    }

    for (const amenidadIdPublic of amenidades) {
      const a = await prisma.amenidad.findUnique({ where: { idPublic: amenidadIdPublic } });
      if (a) {
        await prisma.propiedadAmenidad.create({
          data: { idPropiedad: propiedad.id, idAmenidad: a.id },
        });
      }
    }

    for (let i = 0; i < planesPiso.length; i++) {
      const item = planesPiso[i];
      const recurso = await prisma.recurso.findUnique({
        where: { idPublic: item.idRecurso },
      });
      if (recurso) {
        await prisma.planPiso.create({
          data: {
            idPropiedad: propiedad.id,
            idRecurso: recurso.id,
            nombreDelPlano: String(item.nombreDelPlano || "Plano").trim(),
            orden: typeof item.orden === "number" ? item.orden : i,
            activo: true,
          },
        });
      }
    }

    const created = await prisma.propiedad.findUnique({
      where: { id: propiedad.id },
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

    const out = {
      idPublic: created!.idPublic,
      nombrePropiedad: created!.nombrePropiedad,
      referenciaCorta: created!.referenciaCorta,
      descripcionGeneral: created!.descripcionGeneral,
      estadoPublicacion: created!.estadoPublicacion,
      categoria: created!.categoria
        ? { idPublic: created!.categoria.idPublic, nombre: created!.categoria.nombre, slug: created!.categoria.slug }
        : null,
      tipoOperacion: created!.tipoOperacion
        ? { idPublic: created!.tipoOperacion.idPublic, nombre: created!.tipoOperacion.nombre }
        : null,
      zona: created!.zona
        ? { idPublic: created!.zona.idPublic, nombre: created!.zona.nombre }
        : null,
      direccionPublica: created!.direccionPublica,
      latitud: created!.latitud != null ? Number(created!.latitud) : null,
      longitud: created!.longitud != null ? Number(created!.longitud) : null,
      habitaciones: created!.habitaciones,
      banos: created!.banos,
      parqueos: created!.parqueos,
      metrosConstruccion: created!.metrosConstruccion,
      metrosTerreno: created!.metrosTerreno,
      anoConstruccion: created!.anoConstruccion,
      vendedor: created!.vendedor
        ? { idPublic: created!.vendedor.idPublic, nombre: created!.vendedor.nombre }
        : null,
      precio: created!.precio
        ? {
            idPublic: created!.precio.idPublic,
            moneda: created!.precio.moneda,
            precio: Number(created!.precio.precio),
            precioPorM2Construccion:
              created!.precio.precioPorM2Construccion != null
                ? Number(created!.precio.precioPorM2Construccion)
                : null,
            mantenimiento:
              created!.precio.mantenimiento != null ? Number(created!.precio.mantenimiento) : null,
          }
        : null,
      imagenes: created!.imagenes.map((im) => ({
        idPublic: im.idPublic,
        idRecurso: im.recurso.idPublic,
        url: im.recurso.url,
        orden: im.orden,
        esPortada: im.esPortada,
      })),
      amenidades: (created!.propiedadesAmenidades ?? []).map((pa) => ({
        idPublic: pa.amenidad.idPublic,
        nombreAmenidad: pa.amenidad.nombreAmenidad,
      })),
      planesPiso: (created!.planesPiso ?? []).map((pp) => ({
        idPublic: pp.idPublic,
        nombreDelPlano: pp.nombreDelPlano,
        idRecurso: pp.recurso.idPublic,
        url: pp.recurso.url,
        orden: pp.orden,
      })),
      fechaCreacion: created!.fechaCreacion.toISOString(),
    };

    return successResponse(out);
  } catch (error) {
    return handleApiError(error);
  }
}
