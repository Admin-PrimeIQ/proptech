import { prisma } from "@/lib/prisma";

export type CategoriaConConteo = {
  idPublic: string;
  nombre: string;
  slug: string;
  conteo: number;
};

/**
 * Obtiene las categorías activas con el conteo de propiedades por cada una
 */
export async function getCategoriasConConteo(): Promise<CategoriaConConteo[]> {
  const categorias = await prisma.categoriaPropiedad.findMany({
    where: { activa: true },
    orderBy: [{ orden: "asc" }, { nombre: "asc" }],
    include: {
      _count: {
        select: {
          propiedades: true,
        },
      },
    },
  });

  return categorias.map((c) => ({
    idPublic: c.idPublic,
    nombre: c.nombre,
    slug: c.slug,
    conteo: c._count.propiedades,
  }));
}
