import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { handleApiError, successResponse } from "@/lib/api-helpers";

const patchBodySchema = z.object({
  deseaPublicar: z.boolean().optional(),
  visiblePublico: z.boolean().optional(),
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ idPublic: string }> }
) {
  try {
    const { idPublic } = await params;
    const body = await request.json();
    const parsed = patchBodySchema.safeParse(body);
    if (!parsed.success) {
      const msg = parsed.error.errors.map((e) => e.message).join("; ");
      return NextResponse.json({ error: msg }, { status: 400 });
    }
    const { deseaPublicar, visiblePublico } = parsed.data;

    const review = await prisma.customerReview.findUnique({
      where: { idPublic },
    });
    if (!review) {
      return NextResponse.json({ error: "Reseña no encontrada" }, { status: 404 });
    }

    const updated = await prisma.customerReview.update({
      where: { idPublic },
      data: {
        ...(deseaPublicar !== undefined && { deseaPublicar }),
        ...(visiblePublico !== undefined && { visiblePublico }),
      },
    });

    return successResponse({
      idPublic: updated.idPublic,
      deseaPublicar: updated.deseaPublicar,
      visiblePublico: updated.visiblePublico,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
