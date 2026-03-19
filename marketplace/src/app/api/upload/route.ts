import { NextRequest, NextResponse } from "next/server";
import { uploadFileToS3 } from "@/lib/s3-upload";
import { prisma } from "@/lib/prisma";
import { handleApiError, successResponse } from "@/lib/api-helpers";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const tipoRecurso = (formData.get("tipoRecurso") as string) || "IMAGEN";
    const textoAlternativo = (formData.get("textoAlternativo") as string) || null;
    const folder = (formData.get("folder") as string) || "uploads";
    const creadoPorIdPublic = formData.get("creadoPor") as string;

    if (!file) {
      return NextResponse.json(
        { error: "No se proporcionó ningún archivo" },
        { status: 400 }
      );
    }

    if (!creadoPorIdPublic) {
      return NextResponse.json(
        { error: "Se requiere el ID del usuario que crea el recurso" },
        { status: 400 }
      );
    }

    const usuario = await prisma.usuario.findUnique({
      where: { idPublic: creadoPorIdPublic },
    });

    if (!usuario) {
      return NextResponse.json(
        { error: "Usuario no encontrado" },
        { status: 404 }
      );
    }

    const url = await uploadFileToS3(file, folder);

    async function createRecurso() {
      return prisma.recurso.create({
        data: {
          tipoRecurso,
          url,
          textoAlternativo,
          creadoPor: usuario.id,
        },
      });
    }

    let recurso;
    try {
      recurso = await createRecurso();
    } catch (seqError: unknown) {
      const prismaErr = seqError as { code?: string };
      if (prismaErr?.code === "P2002") {
        await prisma.$executeRawUnsafe(
          `SELECT setval(pg_get_serial_sequence('recursos', 'id'), COALESCE((SELECT MAX(id) FROM recursos), 1))`
        );
        recurso = await createRecurso();
      } else {
        throw seqError;
      }
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
