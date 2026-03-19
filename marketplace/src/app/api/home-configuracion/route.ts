import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getHomeConfig } from "@/lib/home-config";
import { handleApiError, successResponse } from "@/lib/api-helpers";

export async function GET() {
  try {
    const config = await getHomeConfig();
    return successResponse(config);
  } catch (error) {
    return handleApiError(error);
  }
}

type PutBody = {
  tituloHero?: string | null;
  subtituloHero?: string | null;
  textoBotonHero?: string | null;
  linkBotonHero?: string | null;
  idImagenHero?: string | null;
};

export async function PUT(request: NextRequest) {
  try {
    const body = (await request.json()) as PutBody;

    let idImagenHeroInternal: bigint | null | undefined = undefined;
    if (body.idImagenHero !== undefined) {
      if (body.idImagenHero === null || body.idImagenHero === "") {
        idImagenHeroInternal = null;
      } else {
        const recurso = await prisma.recurso.findUnique({
          where: { idPublic: String(body.idImagenHero) },
        });
        idImagenHeroInternal = recurso ? recurso.id : null;
      }
    }

    let config = await prisma.homeConfiguracion.findFirst({
      include: { imagenHero: true },
    });

    if (!config) {
      config = await prisma.homeConfiguracion.create({
        data: {
          tituloHero: body.tituloHero ?? null,
          subtituloHero: body.subtituloHero ?? null,
          textoBotonHero: body.textoBotonHero ?? null,
          linkBotonHero: body.linkBotonHero ?? null,
          ...(idImagenHeroInternal !== undefined && { idImagenHero: idImagenHeroInternal }),
        },
        include: { imagenHero: true },
      });
    } else {
      const updateData: {
        tituloHero?: string | null;
        subtituloHero?: string | null;
        textoBotonHero?: string | null;
        linkBotonHero?: string | null;
        idImagenHero?: bigint | null;
      } = {};
      if (body.tituloHero !== undefined) updateData.tituloHero = body.tituloHero ?? null;
      if (body.subtituloHero !== undefined) updateData.subtituloHero = body.subtituloHero ?? null;
      if (body.textoBotonHero !== undefined) updateData.textoBotonHero = body.textoBotonHero ?? null;
      if (body.linkBotonHero !== undefined) updateData.linkBotonHero = body.linkBotonHero ?? null;
      if (idImagenHeroInternal !== undefined) updateData.idImagenHero = idImagenHeroInternal;

      config = await prisma.homeConfiguracion.update({
        where: { id: config.id },
        data: updateData,
        include: { imagenHero: true },
      });
    }

    const out = await getHomeConfig();
    return successResponse(out);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE() {
  try {
    const config = await prisma.homeConfiguracion.findFirst();
    if (!config) {
      return NextResponse.json({ error: "No hay configuración de home" }, { status: 404 });
    }
    await prisma.homeConfiguracion.delete({ where: { id: config.id } });
    return successResponse({ deleted: true });
  } catch (error) {
    return handleApiError(error);
  }
}
