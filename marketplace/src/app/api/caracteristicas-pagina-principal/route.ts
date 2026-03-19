import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { handleApiError, successResponse } from "@/lib/api-helpers";
import { deleteFileFromS3 } from "@/lib/s3-upload";

type CaracteristicaPaginaPrincipalResponse = {
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
async function getCaracteristicaPaginaPrincipal(): Promise<CaracteristicaPaginaPrincipalResponse | null> {
  // Buscar característica con tipoCategoria específico para información de página
  let caracteristica = await prisma.caracteristicaPaginaPrincipal.findFirst({
    where: {
      tipoCategoria: "informacion-pagina",
    },
    include: {
      banner: true,
      actualizador: true,
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
          actualizador: true,
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
            actualizador: true,
          },
        });
        if (!caracteristica) {
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

export async function GET() {
  try {
    const config = await getCaracteristicaPaginaPrincipal();
    if (!config) {
      return NextResponse.json({ error: "No se pudo obtener la configuración" }, { status: 500 });
    }
    return successResponse(config);
  } catch (error) {
    return handleApiError(error);
  }
}

type PutBody = {
  tituloPagina?: string | null;
  descripcionPagina?: string | null;
  imagenIdRecurso?: string | null; // ID público del recurso (solo uno)
};

export async function PUT(request: NextRequest) {
  try {
    const body = (await request.json()) as PutBody;

    // Obtener o crear la característica
    let caracteristica = await prisma.caracteristicaPaginaPrincipal.findFirst({
      where: {
        tipoCategoria: "informacion-pagina",
      },
    });

    const primerUsuario = await prisma.usuario.findFirst();
    if (!primerUsuario) {
      return NextResponse.json({ error: "No hay usuarios en el sistema" }, { status: 500 });
    }

    // Convertir ID público del recurso a ID interno
    let idBannerInternal: bigint | null = null;
    let recursoAnteriorIdPublic: string | null = null;

    // Obtener el recurso anterior si existe para eliminarlo después
    if (caracteristica && caracteristica.idBanner) {
      const recursoAnterior = await prisma.recurso.findUnique({
        where: { id: caracteristica.idBanner },
      });
      if (recursoAnterior) {
        recursoAnteriorIdPublic = recursoAnterior.idPublic;
      }
    }

    if (body.imagenIdRecurso) {
      const nuevoRecurso = await prisma.recurso.findUnique({
        where: { idPublic: body.imagenIdRecurso },
      });
      if (nuevoRecurso) {
        idBannerInternal = nuevoRecurso.id;
      }
    }

    if (!caracteristica) {
      // Crear nueva característica
      try {
        caracteristica = await prisma.caracteristicaPaginaPrincipal.create({
          data: {
            tipoCategoria: "informacion-pagina",
            referenciaId: "info-pagina-1",
            slug: "informacion-pagina",
            tituloPagina: body.tituloPagina ?? "",
            descripcionPagina: body.descripcionPagina ?? null,
            idBanner: idBannerInternal,
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
          if (!caracteristica) {
            throw error;
          }
        } else {
          throw error;
        }
      }
    } else {
      // Eliminar recurso anterior si existe y:
      // 1. Se está cambiando la imagen (nuevo ID diferente)
      // 2. Se está eliminando la imagen (imagenIdRecurso es null)
      if (
        recursoAnteriorIdPublic &&
        body.imagenIdRecurso !== undefined &&
        (body.imagenIdRecurso === null || body.imagenIdRecurso !== recursoAnteriorIdPublic)
      ) {
        const recursoAnterior = await prisma.recurso.findUnique({
          where: { idPublic: recursoAnteriorIdPublic },
        });
        if (recursoAnterior) {
          // Eliminar del bucket S3
          const urlAnterior = recursoAnterior.url || "";
          if (urlAnterior && urlAnterior.includes("s3") && urlAnterior.includes("amazonaws.com")) {
            try {
              await deleteFileFromS3(urlAnterior);
            } catch (error) {
              console.error("Error al eliminar archivo de S3:", error);
            }
          }
          // Eliminar de la BD
          try {
            await prisma.recurso.delete({
              where: { idPublic: recursoAnteriorIdPublic },
            });
          } catch (error) {
            console.error("Error al eliminar recurso de BD:", error);
          }
        }
      }

      // Actualizar característica existente
      const updateData: {
        tituloPagina?: string;
        descripcionPagina?: string | null;
        idBanner?: bigint | null;
        actualizadoPor: bigint;
      } = {
        actualizadoPor: primerUsuario.id,
      };

      if (body.tituloPagina !== undefined) {
        updateData.tituloPagina = body.tituloPagina ?? "";
      }
      if (body.descripcionPagina !== undefined) {
        updateData.descripcionPagina = body.descripcionPagina ?? null;
      }
      if (body.imagenIdRecurso !== undefined) {
        updateData.idBanner = idBannerInternal;
      }

      caracteristica = await prisma.caracteristicaPaginaPrincipal.update({
        where: { id: caracteristica.id },
        data: updateData,
        include: {
          banner: true,
        },
      });
    }

    const out = await getCaracteristicaPaginaPrincipal();
    return successResponse(out);
  } catch (error) {
    return handleApiError(error);
  }
}
