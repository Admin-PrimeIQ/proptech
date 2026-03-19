import { prisma } from "@/lib/prisma";

const TIPOS_IMAGEN = {
  IMAGEN_PRINCIPAL: "IMAGEN_PRINCIPAL",
  IMAGEN_PRINCIPAL_RAZONES: "IMAGEN_PRINCIPAL_RAZONES",
  IMAGEN_SECUNDARIA_RAZONES: "IMAGEN_SECUNDARIA_RAZONES",
  ENCUENTRA_TU_FUTURO: "ENCUENTRA_TU_FUTURO",
  COMPRA_ALQUILA: "COMPRA_ALQUILA",
  LISTA_TU_PROPIEDAD: "LISTA_TU_PROPIEDAD",
} as const;

export type AcercaDeNosotrosImagenItem = { idRecurso: string; url: string } | null;

export type AcercaDeNosotrosConfigResponse = {
  idPublic: string;
  titulo: string;
  tituloSeccionRazones: string;
  textoSeccionRazones: string;
  informacionExcelencia: string;
  informacionLogros: string;
  informacionCalidad: string;
  informacionTransparencia: string;
  imagenPrincipal: AcercaDeNosotrosImagenItem;
  imagenPrincipalRazones: AcercaDeNosotrosImagenItem;
  imagenSecundariaRazones: AcercaDeNosotrosImagenItem;
  imagenEncuentraTuFuturo: AcercaDeNosotrosImagenItem;
  imagenCompraAlquila: AcercaDeNosotrosImagenItem;
  imagenListaTuPropiedad: AcercaDeNosotrosImagenItem;
};

function mapImagenByTipo(imagenes: { tipo: string | null; recurso: { idPublic: string; url: string } }[]) {
  const byTipo: Record<string, { idRecurso: string; url: string } | null> = {};
  for (const key of Object.keys(TIPOS_IMAGEN)) {
    const img = imagenes.find((i) => i.tipo === key);
    byTipo[key] = img?.recurso ? { idRecurso: img.recurso.idPublic, url: img.recurso.url } : null;
  }
  return byTipo;
}

/**
 * Obtiene la configuración de la página Acerca de nosotros para uso en la página pública.
 * Crea un registro por defecto si no existe.
 */
export async function getAcercaDeNosotrosConfig(): Promise<AcercaDeNosotrosConfigResponse> {
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

  const imagenesByTipo = mapImagenByTipo(row.imagenes);

  return {
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
  };
}
