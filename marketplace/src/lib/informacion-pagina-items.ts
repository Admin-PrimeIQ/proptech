import { prisma } from "@/lib/prisma";

export type InformacionPaginaItemResponse = {
  idPublic: string;
  titulo: string;
  descripcion: string | null;
  orden: number;
  activo: boolean;
  imagen: { idPublic: string; url: string } | null;
};

export async function getInformacionPaginaItems(includeInactive = false): Promise<InformacionPaginaItemResponse[]> {
  const feature = await prisma.caracteristicaPaginaPrincipal.findFirst({
    where: { tipoCategoria: "informacion-pagina" },
  });

  if (!feature) {
    return [];
  }

  const items = await prisma.informacionPaginaItem.findMany({
    where: {
      idCaracteristica: feature.id,
      ...(includeInactive ? {} : { activo: true }),
    },
    include: { recurso: true },
    orderBy: [{ orden: "asc" }, { fechaCreacion: "desc" }],
  });

  return items.map((item) => ({
    idPublic: item.idPublic,
    titulo: item.titulo,
    descripcion: item.descripcion,
    orden: item.orden,
    activo: item.activo,
    imagen: item.recurso ? { idPublic: item.recurso.idPublic, url: item.recurso.url } : null,
  }));
}

