import { prisma } from "@/lib/prisma";

export type HomeConfigResponse = {
  idPublic: string;
  tituloHero: string | null;
  subtituloHero: string | null;
  textoBotonHero: string | null;
  linkBotonHero: string | null;
  fechaActualizacion: string;
  imagenHero: { idPublic: string; url: string } | null;
};

/**
 * Obtiene la configuración de home (hero). Crea una por defecto si no existe.
 */
export async function getHomeConfig(): Promise<HomeConfigResponse> {
  let config = await prisma.homeConfiguracion.findFirst({
    include: { imagenHero: true },
  });

  if (!config) {
    config = await prisma.homeConfiguracion.create({
      data: {},
      include: { imagenHero: true },
    });
  }

  return {
    idPublic: config.idPublic,
    tituloHero: config.tituloHero ?? null,
    subtituloHero: config.subtituloHero ?? null,
    textoBotonHero: config.textoBotonHero ?? null,
    linkBotonHero: config.linkBotonHero ?? null,
    fechaActualizacion: config.fechaActualizacion.toISOString(),
    imagenHero: config.imagenHero
      ? { idPublic: config.imagenHero.idPublic, url: config.imagenHero.url }
      : null,
  };
}
