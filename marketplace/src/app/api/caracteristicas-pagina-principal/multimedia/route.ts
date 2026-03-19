import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { handleApiError, successResponse } from "@/lib/api-helpers";
import { deleteFileFromS3 } from "@/lib/s3-upload";

type MultimediaConfigResponse = {
  idPublic: string;
  imagen: { idPublic: string; url: string } | null;
  fechaActualizacion: string;
};

const TIPO_CATEGORIA = "multimedia-home";
const REFERENCIA_ID = "multimedia-home-1";
const SLUG = "multimedia-home";

async function getMultimediaConfig(): Promise<MultimediaConfigResponse> {
  let caracteristica = await prisma.caracteristicaPaginaPrincipal.findFirst({
    where: { tipoCategoria: TIPO_CATEGORIA },
    include: { banner: true },
  });

  if (!caracteristica) {
    const primerUsuario = await prisma.usuario.findFirst();
    if (!primerUsuario) throw new Error("No hay usuarios en el sistema");

    try {
      caracteristica = await prisma.caracteristicaPaginaPrincipal.create({
        data: {
          tipoCategoria: TIPO_CATEGORIA,
          referenciaId: REFERENCIA_ID,
          slug: SLUG,
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
          where: { tipoCategoria: TIPO_CATEGORIA },
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

  return {
    idPublic: caracteristica.idPublic,
    imagen: caracteristica.banner
      ? { idPublic: caracteristica.banner.idPublic, url: caracteristica.banner.url }
      : null,
    fechaActualizacion: caracteristica.fechaActualizacion.toISOString(),
  };
}

export async function GET() {
  try {
    const data = await getMultimediaConfig();
    return successResponse(data);
  } catch (error) {
    return handleApiError(error);
  }
}

type PutBody = {
  imagenIdRecurso?: string | null; // ID público del recurso (solo uno)
};

export async function PUT(request: NextRequest) {
  try {
    const body = (await request.json()) as PutBody;

    let caracteristica = await prisma.caracteristicaPaginaPrincipal.findFirst({
      where: { tipoCategoria: TIPO_CATEGORIA },
    });

    const primerUsuario = await prisma.usuario.findFirst();
    if (!primerUsuario) {
      return NextResponse.json({ error: "No hay usuarios en el sistema" }, { status: 500 });
    }

    let idBannerInternal: bigint | null = null;
    let recursoAnteriorIdPublic: string | null = null;

    if (caracteristica?.idBanner) {
      const recursoAnterior = await prisma.recurso.findUnique({ where: { id: caracteristica.idBanner } });
      recursoAnteriorIdPublic = recursoAnterior?.idPublic ?? null;
    }

    if (body.imagenIdRecurso) {
      const nuevoRecurso = await prisma.recurso.findUnique({ where: { idPublic: body.imagenIdRecurso } });
      if (nuevoRecurso) idBannerInternal = nuevoRecurso.id;
    }

    if (!caracteristica) {
      try {
        caracteristica = await prisma.caracteristicaPaginaPrincipal.create({
          data: {
            tipoCategoria: TIPO_CATEGORIA,
            referenciaId: REFERENCIA_ID,
            slug: SLUG,
            tituloPagina: "",
            descripcionPagina: null,
            idBanner: idBannerInternal,
            actualizadoPor: primerUsuario.id,
          },
          include: { banner: true },
        });
      } catch (error: any) {
        // Si falla por restricción única (slug ya existe), intentar encontrarla nuevamente
        if (error?.code === 'P2002' || error?.message?.includes('Unique constraint')) {
          caracteristica = await prisma.caracteristicaPaginaPrincipal.findFirst({
            where: { tipoCategoria: TIPO_CATEGORIA },
            include: { banner: true },
          });
          if (!caracteristica) {
            throw error;
          }
        } else {
          throw error;
        }
      }
    } else {
      // Eliminar recurso anterior si se cambia o se elimina
      if (
        recursoAnteriorIdPublic &&
        body.imagenIdRecurso !== undefined &&
        (body.imagenIdRecurso === null || body.imagenIdRecurso !== recursoAnteriorIdPublic)
      ) {
        const recursoAnterior = await prisma.recurso.findUnique({ where: { idPublic: recursoAnteriorIdPublic } });
        if (recursoAnterior) {
          const urlAnterior = recursoAnterior.url || "";
          if (urlAnterior && urlAnterior.includes("s3") && urlAnterior.includes("amazonaws.com")) {
            try {
              await deleteFileFromS3(urlAnterior);
            } catch (error) {
              console.error("Error al eliminar archivo de S3:", error);
            }
          }
          try {
            await prisma.recurso.delete({ where: { idPublic: recursoAnteriorIdPublic } });
          } catch (error) {
            console.error("Error al eliminar recurso de BD:", error);
          }
        }
      }

      caracteristica = await prisma.caracteristicaPaginaPrincipal.update({
        where: { id: caracteristica.id },
        data: {
          actualizadoPor: primerUsuario.id,
          ...(body.imagenIdRecurso !== undefined ? { idBanner: idBannerInternal } : {}),
        },
        include: { banner: true },
      });
    }

    const out = await getMultimediaConfig();
    return successResponse(out);
  } catch (error) {
    return handleApiError(error);
  }
}

