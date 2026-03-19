import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { handleApiError, successResponse } from "@/lib/api-helpers";
import { getOrCreateHomeFeature } from "@/lib/get-home-feature";

export async function GET() {
  try {
    const feature = await getOrCreateHomeFeature();

    let seo = null;

    if (feature.idSeo) {
      seo = await prisma.seo.findUnique({
        where: { id: feature.idSeo },
      });
    }

    if (!seo) {
      seo = await prisma.seo.create({
        data: {
          tituloSeo: "",
          descripcionSeo: "",
        },
      });

      await prisma.caracteristicaPaginaPrincipal.update({
        where: { id: feature.id },
        data: { idSeo: seo.id },
      });
    }

    return successResponse({
      tituloSeo: seo.tituloSeo || "",
      descripcionSeo: seo.descripcionSeo || "",
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { tituloSeo, descripcionSeo } = body;

    const feature = await getOrCreateHomeFeature();

    let seo = null;

    if (feature.idSeo) {
      seo = await prisma.seo.findUnique({
        where: { id: feature.idSeo },
      });
    }

    const updateData: { tituloSeo?: string; descripcionSeo?: string | null } = {};
    if (tituloSeo !== undefined) updateData.tituloSeo = tituloSeo;
    if (descripcionSeo !== undefined) updateData.descripcionSeo = descripcionSeo;

    if (!seo) {
      seo = await prisma.seo.create({
        data: {
          tituloSeo: tituloSeo || "",
          descripcionSeo: descripcionSeo || "",
        },
      });

      await prisma.caracteristicaPaginaPrincipal.update({
        where: { id: feature.id },
        data: { idSeo: seo.id },
      });
    } else {
      seo = await prisma.seo.update({
        where: { id: seo.id },
        data: updateData,
      });
    }

    return successResponse({
      tituloSeo: seo.tituloSeo || "",
      descripcionSeo: seo.descripcionSeo || "",
    });
  } catch (error) {
    return handleApiError(error);
  }
}
