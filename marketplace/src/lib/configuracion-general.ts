import { prisma } from "@/lib/prisma";

export type ConfiguracionGeneralResponse = {
  nombreEmpresa: string;
};

/**
 * Obtiene la configuración general del sitio (nombre de la compañía, etc.).
 * Crea una por defecto si no existe.
 */
export async function getConfiguracionGeneral(): Promise<ConfiguracionGeneralResponse> {
  let config = await prisma.configuracionSitio.findFirst();

  if (!config) {
    config = await prisma.configuracionSitio.create({
      data: { nombreEmpresa: "Nombre de la Compañía" },
    });
  }

  return {
    nombreEmpresa: config.nombreEmpresa ?? "Nombre de la Compañía",
  };
}
