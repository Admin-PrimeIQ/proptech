import { prisma } from "@/lib/prisma";

/**
 * Helper para obtener o crear la característica principal con slug "home"
 * Esta se usa para asociar Footer y Seo
 */
export async function getOrCreateHomeFeature() {
  // Primero intentar encontrar la característica existente
  let feature = await prisma.caracteristicaPaginaPrincipal.findUnique({
    where: { slug: "home" },
  });

  if (feature) {
    return feature;
  }

  // Si no existe, intentar crear. Usar findFirst para evitar condición de carrera
  const firstUser = await prisma.usuario.findFirst();

  if (!firstUser) {
    throw new Error("No hay usuarios en el sistema. Se requiere al menos un usuario para crear la característica principal.");
  }

  try {
    feature = await prisma.caracteristicaPaginaPrincipal.create({
      data: {
        slug: "home",
        tipoCategoria: "OPERACION_INMOBILIARIA",
        referenciaId: "home",
        tituloPagina: "Página Principal",
        actualizadoPor: firstUser.id,
      },
    });
  } catch (error: any) {
    // Si falla por restricción única (slug ya existe), intentar encontrarla nuevamente
    if (error?.code === 'P2002' || error?.message?.includes('Unique constraint')) {
      feature = await prisma.caracteristicaPaginaPrincipal.findUnique({
        where: { slug: "home" },
      });
      if (feature) {
        return feature;
      }
    }
    throw error;
  }

  return feature;
}
