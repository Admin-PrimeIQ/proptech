import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { handleApiError, successResponse, errorResponse } from "@/lib/api-helpers";
import { uploadFileToS3, deleteFileFromS3 } from "@/lib/s3-upload";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const recurso = await prisma.recurso.findUnique({
      where: { idPublic: id },
    });

    if (!recurso) {
      return errorResponse("Recurso no encontrado", 404);
    }

    return successResponse({
      idRecurso: recurso.idPublic,
      url: recurso.url,
      tipoRecurso: recurso.tipoRecurso,
      textoAlternativo: recurso.textoAlternativo,
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const tipoRecurso = (formData.get("tipoRecurso") as string) || "IMAGEN";
    const textoAlternativo = (formData.get("textoAlternativo") as string) || null;
    const folder = (formData.get("folder") as string) || "uploads";
    const creadoPorIdPublic = formData.get("creadoPor") as string;

    if (!creadoPorIdPublic) {
      return errorResponse("Se requiere el ID del usuario", 400);
    }

    const usuario = await prisma.usuario.findUnique({
      where: { idPublic: creadoPorIdPublic },
    });

    if (!usuario) {
      return errorResponse("Usuario no encontrado", 404);
    }

    let recurso = await prisma.recurso.findUnique({
      where: { idPublic: id },
    });

    const oldUrl = recurso?.url || "";
    let url = oldUrl;

    if (file) {
      if (oldUrl && oldUrl.includes("s3") && oldUrl.includes("amazonaws.com")) {
        await deleteFileFromS3(oldUrl);
      }
      url = await uploadFileToS3(file, folder);
    }

    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    const isValidUUID = uuidRegex.test(id);

    if (!recurso) {
      if (isValidUUID) {
        try {
          recurso = await prisma.recurso.create({
            data: {
              idPublic: id,
              tipoRecurso,
              url,
              textoAlternativo,
              creadoPor: usuario.id,
            },
          });
        } catch {
          recurso = await prisma.recurso.create({
            data: {
              tipoRecurso,
              url,
              textoAlternativo,
              creadoPor: usuario.id,
            },
          });
        }
      } else {
        recurso = await prisma.recurso.create({
          data: {
            tipoRecurso,
            url,
            textoAlternativo,
            creadoPor: usuario.id,
          },
        });
      }
    } else {
      recurso = await prisma.recurso.update({
        where: { idPublic: id },
        data: {
          ...(url && { url }),
          ...(tipoRecurso && { tipoRecurso }),
          ...(textoAlternativo !== null && { textoAlternativo }),
        },
      });
    }

    return successResponse({
      idRecurso: recurso.idPublic,
      url: recurso.url,
      tipoRecurso: recurso.tipoRecurso,
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const recurso = await prisma.recurso.findUnique({
      where: { idPublic: id },
    });

    if (!recurso) {
      return errorResponse("Recurso no encontrado", 404);
    }

    const url = recurso.url || "";
    if (url && url.includes("s3") && url.includes("amazonaws.com")) {
      await deleteFileFromS3(url);
    }

    await prisma.recurso.delete({
      where: { idPublic: id },
    });

    return successResponse({ deleted: true });
  } catch (error: unknown) {
    const prismaError = error as { code?: string };
    if (prismaError?.code === "P2003") {
      return errorResponse("El recurso está en uso y no puede eliminarse", 409);
    }
    return handleApiError(error);
  }
}
