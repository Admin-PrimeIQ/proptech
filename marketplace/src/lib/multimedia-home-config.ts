import { prisma } from "@/lib/prisma";

export type MultimediaHomeConfigResponse = {
  idPublic: string;
  imagen: { idPublic: string; url: string } | null;
  fechaActualizacion: string;
};

/**
 * Obtiene la configuración de Multimedia (imagen) para Home.
 * Usa tipoCategoria "multimedia-home" y la relación banner (idBanner → recurso).
 */
export async function getMultimediaHomeConfig(): Promise<MultimediaHomeConfigResponse> {
  let caracteristica = await prisma.caracteristicaPaginaPrincipal.findFirst({
    where: { tipoCategoria: "multimedia-home" },
    include: { banner: true },
  });

  if (!caracteristica) {
    const primerUsuario = await prisma.usuario.findFirst();
    if (!primerUsuario) throw new Error("No hay usuarios en el sistema");

    try {
      caracteristica = await prisma.caracteristicaPaginaPrincipal.create({
        data: {
          tipoCategoria: "multimedia-home",
          referenciaId: "multimedia-home-1",
          slug: "multimedia-home",
          tituloPagina: "",
          descripcionPagina: null,
          actualizadoPor: primerUsuario.id,
        },
        include: { banner: true },
      });
    } catch (error: any) {
      // Si falla por restricción única (slug ya existe), intentar encontrarla nuevamente
      if (error?.code === 'P2002' || error?.message?.includes('Unique constraint')) {
        caracteristica = await prisma.caracteristicaPaginaPrincipal.findFirst({
          where: { tipoCategoria: "multimedia-home" },
          include: { banner: true },
        });
        if (!caracteristica) {
          throw error;
        }
      } else {
        throw error;
      }
    }
  }

  const imagen = caracteristica.banner
    ? { idPublic: caracteristica.banner.idPublic, url: caracteristica.banner.url }
    : null;

  return {
    idPublic: caracteristica.idPublic,
    imagen,
    fechaActualizacion: caracteristica.fechaActualizacion.toISOString(),
  };
}

