import { prisma } from "@/lib/prisma";

const INFO_PAGE_TYPE = "informacion-pagina";
const INFO_PAGE_REF = "info-pagina-1";
const INFO_PAGE_SLUG = "informacion-pagina";

export async function getOrCreateInfoPageFeature() {
  let feature = await prisma.caracteristicaPaginaPrincipal.findFirst({
    where: { tipoCategoria: INFO_PAGE_TYPE },
  });

  if (feature) {
    return feature;
  }

  const firstUser = await prisma.usuario.findFirst();
  if (!firstUser) {
    throw new Error("No hay usuarios en el sistema. Se requiere al menos un usuario para crear la sección información página.");
  }

  try {
    feature = await prisma.caracteristicaPaginaPrincipal.create({
      data: {
        tipoCategoria: INFO_PAGE_TYPE,
        referenciaId: INFO_PAGE_REF,
        slug: INFO_PAGE_SLUG,
        tituloPagina: "",
        descripcionPagina: null,
        actualizadoPor: firstUser.id,
      },
    });
  } catch (error: unknown) {
    const isUniqueError =
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      String((error as { code?: unknown }).code) === "P2002";

    if (isUniqueError) {
      const existing = await prisma.caracteristicaPaginaPrincipal.findFirst({
        where: { tipoCategoria: INFO_PAGE_TYPE },
      });
      if (existing) {
        return existing;
      }
    }
    throw error;
  }

  return feature;
}

