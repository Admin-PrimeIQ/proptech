import { prisma } from "@/lib/prisma";

export type PaginaInfoConfigResponse = {
  idPublic: string;
  tituloPagina: string | null;
  descripcionPagina: string | null;
  imagen: { idPublic: string; url: string } | null;
  fechaActualizacion: string;
};

/**
 * Obtiene la configuración de información de página.
 * Busca una característica con tipoCategoria "informacion-pagina" o crea una nueva.
 */
export async function getPaginaInfoConfig(): Promise<PaginaInfoConfigResponse> {
  // Buscar característica con tipoCategoria específico para información de página
  let caracteristica = await prisma.caracteristicaPaginaPrincipal.findFirst({
    where: {
      tipoCategoria: "informacion-pagina",
    },
    include: {
      banner: true,
    },
  });

  if (!caracteristica) {
    // Si no existe, crear una nueva
    // Necesitamos un usuario para actualizadoPor
    const primerUsuario = await prisma.usuario.findFirst();
    if (!primerUsuario) {
      throw new Error("No hay usuarios en el sistema");
    }

    try {
      caracteristica = await prisma.caracteristicaPaginaPrincipal.create({
        data: {
          tipoCategoria: "informacion-pagina",
          referenciaId: "info-pagina-1",
          slug: "informacion-pagina",
          tituloPagina: "",
          descripcionPagina: null,
          actualizadoPor: primerUsuario.id,
        },
        include: {
          banner: true,
        },
      });
    } catch (error: any) {
      // Si falla por restricción única (slug ya existe), intentar encontrarla nuevamente
      if (error?.code === 'P2002' || error?.message?.includes('Unique constraint')) {
        caracteristica = await prisma.caracteristicaPaginaPrincipal.findFirst({
          where: {
            tipoCategoria: "informacion-pagina",
          },
          include: {
            banner: true,
          },
        });
        if (caracteristica) {
          // Ya existe, continuar con el flujo normal
        } else {
          throw error;
        }
      } else {
        throw error;
      }
    }
  }

  // Obtener la imagen (solo una, desde idBanner)
  const imagen = caracteristica.banner
    ? {
        idPublic: caracteristica.banner.idPublic,
        url: caracteristica.banner.url,
      }
    : null;

  return {
    idPublic: caracteristica.idPublic,
    tituloPagina: caracteristica.tituloPagina ?? null,
    descripcionPagina: caracteristica.descripcionPagina ?? null,
    imagen,
    fechaActualizacion: caracteristica.fechaActualizacion.toISOString(),
  };
}
