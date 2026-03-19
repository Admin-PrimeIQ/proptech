/**
 * Helpers para APIs de propiedades, ubicación, catálogos y vendedores.
 * Resolución find-or-create por nombres; uso de id_public en frontera.
 */

import { prisma } from "@/lib/prisma";

export async function getPrimerUsuarioId(): Promise<bigint> {
  const u = await prisma.usuario.findFirst();
  if (!u) throw new Error("No hay usuarios en el sistema. Ejecute el seed.");
  return u.id;
}

export async function getPrimerUsuarioIdPublic(): Promise<string> {
  const u = await prisma.usuario.findFirst();
  if (!u) throw new Error("No hay usuarios en el sistema. Ejecute el seed.");
  return u.idPublic;
}

/** Resuelve categoría por id_public o por slug. Retorna id interno. */
export async function resolveCategoria(
  idPublicOrSlug: string
): Promise<bigint> {
  const byUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (byUuid.test(idPublicOrSlug)) {
    const c = await prisma.categoriaPropiedad.findUnique({
      where: { idPublic: idPublicOrSlug },
    });
    if (!c) throw new Error(`Categoría no encontrada: ${idPublicOrSlug}`);
    return c.id;
  }
  const slug = idPublicOrSlug.toLowerCase().replace(/\s+/g, "-");
  const c = await prisma.categoriaPropiedad.findFirst({
    where: { slug },
  });
  if (!c) throw new Error(`Categoría no encontrada por slug: ${slug}`);
  return c.id;
}

/** Resuelve tipo operación por id_public o por nombre (venta/renta). */
export async function resolveTipoOperacion(
  idPublicOrNombre: string
): Promise<bigint> {
  const byUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (byUuid.test(idPublicOrNombre)) {
    const t = await prisma.tipoOperacionInmobiliaria.findUnique({
      where: { idPublic: idPublicOrNombre },
    });
    if (!t) throw new Error(`Tipo operación no encontrado: ${idPublicOrNombre}`);
    return t.id;
  }
  const nombre = idPublicOrNombre.toUpperCase() === "VENTA" ? "VENTA" : "RENTA";
  const t = await prisma.tipoOperacionInmobiliaria.findFirst({
    where: { nombre },
  });
  if (!t) throw new Error(`Tipo operación no encontrado: ${nombre}`);
  return t.id;
}

/** Find-or-create ubicación: pais → departamento → ciudad → zona. Retorna zona.id o null si no se dio zona. */
export async function resolveUbicacion(params: {
  pais: string;
  departamento: string;
  ciudad: string;
  zona?: string;
}): Promise<bigint | null> {
  const { pais, departamento, ciudad, zona } = params;
  if (!pais?.trim()) return null;

  let p = await prisma.pais.findFirst({
    where: { nombre: { equals: pais.trim(), mode: "insensitive" } },
  });
  if (!p) {
    p = await prisma.pais.create({
      data: { nombre: pais.trim() },
    });
  }

  let d = await prisma.departamento.findFirst({
    where: {
      idPais: p.id,
      nombre: { equals: departamento.trim(), mode: "insensitive" },
    },
  });
  if (!d) {
    d = await prisma.departamento.create({
      data: { idPais: p.id, nombre: departamento.trim() },
    });
  }

  let c = await prisma.ciudad.findFirst({
    where: {
      idDepartamento: d.id,
      nombre: { equals: ciudad.trim(), mode: "insensitive" },
    },
  });
  if (!c) {
    c = await prisma.ciudad.create({
      data: { idDepartamento: d.id, nombre: ciudad.trim() },
    });
  }

  if (!zona?.trim()) return null;

  let z = await prisma.zona.findFirst({
    where: {
      idCiudad: c.id,
      nombre: { equals: zona.trim(), mode: "insensitive" },
    },
  });
  if (!z) {
    z = await prisma.zona.create({
      data: { idCiudad: c.id, nombre: zona.trim() },
    });
  }
  return z.id;
}

/** Resuelve zona por id_public. */
export async function resolveZonaByIdPublic(idPublic: string): Promise<bigint> {
  const z = await prisma.zona.findUnique({ where: { idPublic } });
  if (!z) throw new Error(`Zona no encontrada: ${idPublic}`);
  return z.id;
}

/** Crea vendedor nuevo (usuario = primer usuario). idFotoRecurso = id_public del recurso. */
export async function createVendedor(params: {
  nombre: string;
  idUsuario: bigint;
  idFotoRecursoPublic?: string | null;
}): Promise<{ id: bigint; idPublic: string }> {
  let idFoto: bigint | null = null;
  if (params.idFotoRecursoPublic) {
    const r = await prisma.recurso.findUnique({
      where: { idPublic: params.idFotoRecursoPublic },
    });
    if (r) idFoto = r.id;
  }
  const v = await prisma.vendedor.create({
    data: {
      nombre: params.nombre,
      idUsuario: params.idUsuario,
      idFotoRecurso: idFoto,
    },
  });
  return { id: v.id, idPublic: v.idPublic };
}

/**
 * Obtiene el vendedor asociado al usuario; si no existe, lo crea con el nombre del usuario.
 * Útil para rol VENDEDOR al crear propiedades.
 */
export async function getOrCreateVendedorForUserId(idUsuario: bigint): Promise<{
  id: bigint;
  idPublic: string;
  nombre: string;
}> {
  let v = await prisma.vendedor.findUnique({
    where: { idUsuario },
  });
  if (v) return { id: v.id, idPublic: v.idPublic, nombre: v.nombre };
  const usuario = await prisma.usuario.findUnique({
    where: { id: idUsuario },
    select: { nombreCompleto: true, correo: true },
  });
  if (!usuario) throw new Error("Usuario no encontrado");
  const nombre = (usuario.nombreCompleto ?? usuario.correo ?? "Vendedor").trim();
  const created = await createVendedor({ nombre, idUsuario });
  const createdV = await prisma.vendedor.findUnique({ where: { id: created.id } });
  if (!createdV) throw new Error("Error al crear vendedor");
  return { id: createdV.id, idPublic: createdV.idPublic, nombre: createdV.nombre };
}
