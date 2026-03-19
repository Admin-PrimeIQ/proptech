import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { handleApiError, successResponse } from "@/lib/api-helpers";

export async function GET() {
  try {
    let config = await prisma.configuracionSitio.findFirst({
      include: { logo: true },
    });

    if (!config) {
      config = await prisma.configuracionSitio.create({
        data: {
          nombreEmpresa: "Nombre de la Compañía",
        },
        include: { logo: true },
      });
    }

    return successResponse({
      nombreEmpresa: config.nombreEmpresa,
      idLogoRecurso: config.logo?.idPublic ?? null,
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { nombreEmpresa, idLogoRecurso } = body;

    let idLogoRecursoInternal: bigint | null | undefined = undefined;
    if (idLogoRecurso !== undefined) {
      if (idLogoRecurso === null || idLogoRecurso === "") {
        idLogoRecursoInternal = null;
      } else {
        const logo = await prisma.recurso.findUnique({
          where: { idPublic: String(idLogoRecurso) },
        });
        idLogoRecursoInternal = logo?.id ?? null;
      }
    }

    let config = await prisma.configuracionSitio.findFirst();

    if (!config) {
      config = await prisma.configuracionSitio.create({
        data: {
          nombreEmpresa: nombreEmpresa || "Nombre de la Compañía",
          ...(idLogoRecursoInternal !== undefined && { idLogoRecurso: idLogoRecursoInternal }),
        },
      });
    } else {
      const updateData: { nombreEmpresa?: string; idLogoRecurso?: bigint | null } = {};
      if (nombreEmpresa !== undefined) updateData.nombreEmpresa = nombreEmpresa;
      if (idLogoRecursoInternal !== undefined) updateData.idLogoRecurso = idLogoRecursoInternal;
      config = await prisma.configuracionSitio.update({
        where: { id: config.id },
        data: updateData,
      });
    }

    const configWithLogo = await prisma.configuracionSitio.findUnique({
      where: { id: config.id },
      include: { logo: true },
    });

    return successResponse({
      nombreEmpresa: configWithLogo!.nombreEmpresa,
      idLogoRecurso: configWithLogo!.logo?.idPublic ?? null,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
