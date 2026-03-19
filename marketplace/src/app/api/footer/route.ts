import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { handleApiError, successResponse } from "@/lib/api-helpers";
import { getOrCreateHomeFeature } from "@/lib/get-home-feature";

export async function GET() {
  try {
    const feature = await getOrCreateHomeFeature();

    let footer = null;

    if (feature.idFooter) {
      footer = await prisma.footer.findUnique({
        where: { id: feature.idFooter },
      });
    }

    if (!footer) {
      footer = await prisma.footer.create({
        data: {
          esloganEmpresa: "Tu eslogan aquí",
          informacionEmpresa: "Información sobre la empresa, servicios y más detalles relevantes para los visitantes del sitio web.",
          correo: "support@bhumi.com",
          whatsapp: "+1234567890",
          telefono: "+624 423 26 72",
          instagram: "https://www.instagram.com/",
          facebook: "https://www.facebook.com/",
        },
      });

      await prisma.caracteristicaPaginaPrincipal.update({
        where: { id: feature.id },
        data: { idFooter: footer.id },
      });
    }

    return successResponse({
      esloganEmpresa: footer.esloganEmpresa || "",
      informacionTexto: footer.informacionEmpresa || "",
      email: footer.correo || "",
      telefono: footer.telefono || "",
      redesSociales: {
        facebook: footer.facebook || "",
        instagram: footer.instagram || "",
        whatsapp: footer.whatsapp || "",
        twitter: "",
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { esloganEmpresa, informacionTexto, email, telefono, redesSociales } = body;

    const feature = await getOrCreateHomeFeature();

    let footer = null;

    if (feature.idFooter) {
      footer = await prisma.footer.findUnique({
        where: { id: feature.idFooter },
      });
    }

    const updateData: Record<string, unknown> = {};
    if (esloganEmpresa !== undefined) updateData.esloganEmpresa = esloganEmpresa;
    if (informacionTexto !== undefined) updateData.informacionEmpresa = informacionTexto;
    if (email !== undefined) updateData.correo = email;
    if (telefono !== undefined) updateData.telefono = telefono;
    if (redesSociales) {
      if (redesSociales.facebook !== undefined) updateData.facebook = redesSociales.facebook;
      if (redesSociales.instagram !== undefined) updateData.instagram = redesSociales.instagram;
      if (redesSociales.whatsapp !== undefined) updateData.whatsapp = redesSociales.whatsapp;
    }

    if (!footer) {
      footer = await prisma.footer.create({
        data: {
          esloganEmpresa: esloganEmpresa || "Tu eslogan aquí",
          informacionEmpresa: informacionTexto || "",
          correo: email || "support@bhumi.com",
          whatsapp: redesSociales?.whatsapp || "+1234567890",
          telefono: telefono || "+624 423 26 72",
          instagram: redesSociales?.instagram || "https://www.instagram.com/",
          facebook: redesSociales?.facebook || "https://www.facebook.com/",
        },
      });

      await prisma.caracteristicaPaginaPrincipal.update({
        where: { id: feature.id },
        data: { idFooter: footer.id },
      });
    } else {
      footer = await prisma.footer.update({
        where: { id: footer.id },
        data: updateData,
      });
    }

    return successResponse({
      esloganEmpresa: footer.esloganEmpresa || "",
      informacionTexto: footer.informacionEmpresa || "",
      email: footer.correo || "",
      telefono: footer.telefono || "",
      redesSociales: {
        facebook: footer.facebook || "",
        instagram: footer.instagram || "",
        whatsapp: footer.whatsapp || "",
        twitter: "",
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}
