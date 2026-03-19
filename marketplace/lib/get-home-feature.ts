import { prisma } from "@/lib/prisma";

/**
 * Helper para obtener o crear la característica principal con slug "home"
 * Esta se usa para asociar Footer y Seo
 */
export async function getOrCreateHomeFeature() {
  let feature = await prisma.caracteristicaPaginaPrincipal.findUnique({
    where: { slug: "home" },
  });

  if (!feature) {
    // Obtener el primer usuario para actualizadoPor (o usar un valor por defecto)
    const firstUser = await prisma.usuario.findFirst();
    
    feature = await prisma.caracteristicaPaginaPrincipal.create({
      data: {
        slug: "home",
        actualizadoPor: firstUser?.id || "system",
      },
    });
  }

  return feature;
}
