import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { handleApiError, successResponse } from "@/lib/api-helpers";

const TIPOS_IMAGEN = {
  IMAGEN_PRINCIPAL: "IMAGEN_PRINCIPAL",
  IMAGEN_PRINCIPAL_RAZONES: "IMAGEN_PRINCIPAL_RAZONES",
  IMAGEN_SECUNDARIA_RAZONES: "IMAGEN_SECUNDARIA_RAZONES",
  ENCUENTRA_TU_FUTURO: "ENCUENTRA_TU_FUTURO",
  COMPRA_ALQUILA: "COMPRA_ALQUILA",
  LISTA_TU_PROPIEDAD: "LISTA_TU_PROPIEDAD",
} as const;

const ORDEN_IMAGEN: Record<string, number> = {
  IMAGEN_PRINCIPAL: 0,
  IMAGEN_PRINCIPAL_RAZONES: 0,
  IMAGEN_SECUNDARIA_RAZONES: 1,
  ENCUENTRA_TU_FUTURO: 0,
  COMPRA_ALQUILA: 1,
  LISTA_TU_PROPIEDAD: 2,
};

/** Obtiene o crea el registro único de Acerca de nosotros. */
async function getOrCreateAcercaDeNosotros() {
  let row = await prisma.acercaDeNosotros.findFirst({
    include: {
      imagenes: {
        include: { recurso: true },
        orderBy: { orden: "asc" },
      },
    },
  });
  if (!row) {
    row = await prisma.acercaDeNosotros.create({
      data: { titulo: "Acerca de nosotros" },
      include: {
        imagenes: {
          include: { recurso: true },
          orderBy: { orden: "asc" },
        },
      },
    });
  }
  return row;
}

/** Mapea imagenes por tipo para la respuesta. */
function mapImagenByTipo(imagenes: { tipo: string | null; recurso: { idPublic: string; url: string } }[]) {
  const byTipo: Record<string, { idRecurso: string; url: string } | null> = {};
  for (const key of Object.keys(TIPOS_IMAGEN)) {
    const img = imagenes.find((i) => i.tipo === key);
    byTipo[key] = img?.recurso ? { idRecurso: img.recurso.idPublic, url: img.recurso.url } : null;
  }
  return byTipo;
}

export async function GET() {
  try {
    const row = await getOrCreateAcercaDeNosotros();
    const imagenesByTipo = mapImagenByTipo(row.imagenes);

    return successResponse({
      idPublic: row.idPublic,
      titulo: row.titulo ?? "",
      tituloSeccionRazones: row.tituloSeccionRazones ?? "",
      textoSeccionRazones: row.textoSeccionRazones ?? "",
      informacionExcelencia: row.informacionExcelencia ?? "",
      informacionLogros: row.informacionLogros ?? "",
      informacionCalidad: row.informacionCalidad ?? "",
      informacionTransparencia: row.informacionTransparencia ?? "",
      imagenPrincipal: imagenesByTipo.IMAGEN_PRINCIPAL ?? null,
      imagenPrincipalRazones: imagenesByTipo.IMAGEN_PRINCIPAL_RAZONES ?? null,
      imagenSecundariaRazones: imagenesByTipo.IMAGEN_SECUNDARIA_RAZONES ?? null,
      imagenEncuentraTuFuturo: imagenesByTipo.ENCUENTRA_TU_FUTURO ?? null,
      imagenCompraAlquila: imagenesByTipo.COMPRA_ALQUILA ?? null,
      imagenListaTuPropiedad: imagenesByTipo.LISTA_TU_PROPIEDAD ?? null,
    });
  } catch (error) {
    return handleApiError(error);
  }
}

type PutBody = {
  titulo?: string;
  tituloSeccionRazones?: string;
  textoSeccionRazones?: string;
  informacionExcelencia?: string;
  informacionLogros?: string;
  informacionCalidad?: string;
  informacionTransparencia?: string;
  imagenPrincipalIdRecurso?: string | null;
  imagenPrincipalRazonesIdRecurso?: string | null;
  imagenSecundariaRazonesIdRecurso?: string | null;
  imagenEncuentraTuFuturoIdRecurso?: string | null;
  imagenCompraAlquilaIdRecurso?: string | null;
  imagenListaTuPropiedadIdRecurso?: string | null;
};

/** Resuelve idPublic de recurso a id (BigInt). */
async function resolveRecursoId(idPublic: string | null | undefined): Promise<bigint | null> {
  if (idPublic == null || idPublic === "") return null;
  const r = await prisma.recurso.findUnique({ where: { idPublic } });
  return r ? r.id : null;
}

/** Sincroniza una imagen por tipo: elimina la actual y crea nueva si idRecurso viene. */
async function syncImagen(
  acercaDeNosotrosId: number,
  tipo: keyof typeof TIPOS_IMAGEN,
  idRecursoPublic: string | null | undefined
) {
  await prisma.acercaDeNosotrosImagen.deleteMany({
    where: { acercaDeNosotrosId, tipo },
  });
  if (idRecursoPublic == null || idRecursoPublic === "") return;
  const idRecurso = await resolveRecursoId(idRecursoPublic);
  if (idRecurso == null) return;
  await prisma.acercaDeNosotrosImagen.create({
    data: {
      acercaDeNosotrosId,
      idRecurso,
      tipo,
      orden: ORDEN_IMAGEN[tipo] ?? 0,
      activo: true,
    },
  });
}

export async function PUT(request: NextRequest) {
  try {
    const body = (await request.json()) as PutBody;
    const row = await getOrCreateAcercaDeNosotros();

    const updateData: {
      titulo?: string;
      tituloSeccionRazones?: string;
      textoSeccionRazones?: string;
      informacionExcelencia?: string;
      informacionLogros?: string;
      informacionCalidad?: string;
      informacionTransparencia?: string;
    } = {};
    if (body.titulo !== undefined) updateData.titulo = body.titulo;
    if (body.tituloSeccionRazones !== undefined) updateData.tituloSeccionRazones = body.tituloSeccionRazones ?? null;
    if (body.textoSeccionRazones !== undefined) updateData.textoSeccionRazones = body.textoSeccionRazones ?? null;
    if (body.informacionExcelencia !== undefined) updateData.informacionExcelencia = body.informacionExcelencia ?? null;
    if (body.informacionLogros !== undefined) updateData.informacionLogros = body.informacionLogros ?? null;
    if (body.informacionCalidad !== undefined) updateData.informacionCalidad = body.informacionCalidad ?? null;
    if (body.informacionTransparencia !== undefined)
      updateData.informacionTransparencia = body.informacionTransparencia ?? null;

    if (Object.keys(updateData).length > 0) {
      await prisma.acercaDeNosotros.update({
        where: { id: row.id },
        data: updateData,
      });
    }

    if ("imagenPrincipalIdRecurso" in body)
      await syncImagen(row.id, "IMAGEN_PRINCIPAL", body.imagenPrincipalIdRecurso);
    if ("imagenPrincipalRazonesIdRecurso" in body)
      await syncImagen(row.id, "IMAGEN_PRINCIPAL_RAZONES", body.imagenPrincipalRazonesIdRecurso);
    if ("imagenSecundariaRazonesIdRecurso" in body)
      await syncImagen(row.id, "IMAGEN_SECUNDARIA_RAZONES", body.imagenSecundariaRazonesIdRecurso);
    if ("imagenEncuentraTuFuturoIdRecurso" in body)
      await syncImagen(row.id, "ENCUENTRA_TU_FUTURO", body.imagenEncuentraTuFuturoIdRecurso);
    if ("imagenCompraAlquilaIdRecurso" in body)
      await syncImagen(row.id, "COMPRA_ALQUILA", body.imagenCompraAlquilaIdRecurso);
    if ("imagenListaTuPropiedadIdRecurso" in body)
      await syncImagen(row.id, "LISTA_TU_PROPIEDAD", body.imagenListaTuPropiedadIdRecurso);

    const updated = await getOrCreateAcercaDeNosotros();
    const imagenesByTipo = mapImagenByTipo(updated.imagenes);

    return successResponse({
      idPublic: updated.idPublic,
      titulo: updated.titulo ?? "",
      tituloSeccionRazones: updated.tituloSeccionRazones ?? "",
      textoSeccionRazones: updated.textoSeccionRazones ?? "",
      informacionExcelencia: updated.informacionExcelencia ?? "",
      informacionLogros: updated.informacionLogros ?? "",
      informacionCalidad: updated.informacionCalidad ?? "",
      informacionTransparencia: updated.informacionTransparencia ?? "",
      imagenPrincipal: imagenesByTipo.IMAGEN_PRINCIPAL ?? null,
      imagenPrincipalRazones: imagenesByTipo.IMAGEN_PRINCIPAL_RAZONES ?? null,
      imagenSecundariaRazones: imagenesByTipo.IMAGEN_SECUNDARIA_RAZONES ?? null,
      imagenEncuentraTuFuturo: imagenesByTipo.ENCUENTRA_TU_FUTURO ?? null,
      imagenCompraAlquila: imagenesByTipo.COMPRA_ALQUILA ?? null,
      imagenListaTuPropiedad: imagenesByTipo.LISTA_TU_PROPIEDAD ?? null,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
