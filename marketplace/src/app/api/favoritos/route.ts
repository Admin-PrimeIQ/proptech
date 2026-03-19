import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { handleApiError, successResponse } from "@/lib/api-helpers";

/**
 * Obtiene el id del usuario de la sesión. Retorna null si no hay sesión.
 */
async function getIdUsuarioDesdeSesion(): Promise<bigint | null> {
  const session = await auth();
  if (!session?.user?.id) return null;
  const id = BigInt(session.user.id);
  const usuario = await prisma.usuario.findUnique({
    where: { id, activo: true },
    select: { id: true },
  });
  return usuario ? usuario.id : null;
}

/**
 * GET /api/favoritos
 * Obtiene todos los favoritos del usuario logueado (sesión actual).
 */
export async function GET(request: NextRequest) {
  try {
    const idUsuario = await getIdUsuarioDesdeSesion();
    if (idUsuario === null) {
      return NextResponse.json(
        { error: "Debes iniciar sesión para ver tus favoritos" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const idPropiedadPublic = searchParams.get("idPropiedadPublic");

    // Si se proporciona idPropiedadPublic, verificar si está en favoritos
    if (idPropiedadPublic) {
      const propiedad = await prisma.propiedad.findUnique({
        where: { idPublic: idPropiedadPublic },
      });

      if (!propiedad) {
        return successResponse({ esFavorito: false });
      }

      const favorito = await prisma.favorito.findUnique({
        where: {
          idUsuario_idPropiedad: {
            idUsuario,
            idPropiedad: propiedad.id,
          },
        },
      });

      return successResponse({ esFavorito: !!favorito });
    }

    // Obtener todos los favoritos del usuario con información de propiedades
    const favoritos = await prisma.favorito.findMany({
      where: {
        idUsuario,
      },
      include: {
        propiedad: {
          include: {
            categoria: true,
            tipoOperacion: true,
            imagenes: {
              where: { esPortada: true },
              take: 1,
              include: { recurso: true },
            },
            precio: true, // Relación uno-a-uno, no array
          },
        },
      },
      orderBy: {
        fechaCreacion: "desc",
      },
    });

    // Mapear a formato para frontend (filtrar favoritos con propiedades válidas)
    const favoritosFormateados = favoritos
      .filter((favorito) => favorito.propiedad && favorito.propiedad.idPublic) // Solo incluir si tiene propiedad válida
      .map((favorito) => {
        const propiedad = favorito.propiedad;
        const imagenPortada = propiedad.imagenes?.[0]?.recurso?.url || null;
        const precioActual = propiedad.precio; // Relación uno-a-uno, no array

        return {
          idPublic: favorito.idPublic,
          idPropiedadPublic: propiedad.idPublic,
          fechaCreacion: favorito.fechaCreacion.toISOString(),
          propiedad: {
            idPublic: propiedad.idPublic,
            nombre: propiedad.nombrePropiedad || "Sin nombre",
            referenciaCorta: propiedad.referenciaCorta || null,
            descripcionGeneral: propiedad.descripcionGeneral || null,
            imagen: imagenPortada,
            categoria: propiedad.categoria?.nombre || null,
            tipoOperacion: propiedad.tipoOperacion?.nombre || null,
            precio: precioActual ? Number(precioActual.precio) : null,
            moneda: precioActual?.moneda || null,
          },
        };
      });

    return successResponse(favoritosFormateados);
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * POST /api/favoritos
 * Agrega una propiedad a favoritos
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { idPropiedadPublic } = body;

    console.log("POST /api/favoritos - idPropiedadPublic recibido:", idPropiedadPublic);

    if (!idPropiedadPublic) {
      console.error("POST /api/favoritos - Error: idPropiedadPublic requerido");
      return NextResponse.json(
        { error: "Se requiere idPropiedadPublic" },
        { status: 400 }
      );
    }

    const idUsuario = await getIdUsuarioDesdeSesion();
    if (idUsuario === null) {
      return NextResponse.json(
        { error: "Debes iniciar sesión para agregar favoritos" },
        { status: 401 }
      );
    }

    // Buscar propiedad por idPublic
    const propiedad = await prisma.propiedad.findUnique({
      where: { idPublic: idPropiedadPublic },
    });

    if (!propiedad) {
      console.error("POST /api/favoritos - Propiedad no encontrada:", idPropiedadPublic);
      return NextResponse.json(
        { error: "Propiedad no encontrada" },
        { status: 404 }
      );
    }

    console.log("POST /api/favoritos - Propiedad encontrada:", propiedad.idPublic);

    // Verificar si ya existe el favorito
    const favoritoExistente = await prisma.favorito.findUnique({
      where: {
        idUsuario_idPropiedad: {
          idUsuario,
          idPropiedad: propiedad.id,
        },
      },
    });

    if (favoritoExistente) {
      console.log("POST /api/favoritos - Favorito ya existe");
      return successResponse({
        idPublic: favoritoExistente.idPublic,
        idPropiedadPublic: propiedad.idPublic,
        mensaje: "La propiedad ya está en favoritos",
      });
    }

    // Crear nuevo favorito
    console.log("POST /api/favoritos - Creando nuevo favorito...");
    const nuevoFavorito = await prisma.favorito.create({
      data: {
        idUsuario,
        idPropiedad: propiedad.id,
      },
      include: {
        propiedad: {
          include: {
            categoria: true,
            tipoOperacion: true,
            imagenes: {
              where: { esPortada: true },
              take: 1,
              include: { recurso: true },
            },
            precio: true, // Relación uno-a-uno, no array
          },
        },
      },
    });

    const imagenPortada = nuevoFavorito.propiedad.imagenes[0]?.recurso?.url || null;
    const precioActual = nuevoFavorito.propiedad.precio; // Relación uno-a-uno, no array

    console.log("POST /api/favoritos - Favorito creado exitosamente:", nuevoFavorito.idPublic);

    return successResponse({
      idPublic: nuevoFavorito.idPublic,
      idPropiedadPublic: nuevoFavorito.propiedad.idPublic,
      fechaCreacion: nuevoFavorito.fechaCreacion.toISOString(),
      propiedad: {
        idPublic: nuevoFavorito.propiedad.idPublic,
        nombre: nuevoFavorito.propiedad.nombrePropiedad,
        referenciaCorta: nuevoFavorito.propiedad.referenciaCorta,
        descripcionGeneral: nuevoFavorito.propiedad.descripcionGeneral,
        imagen: imagenPortada,
        categoria: nuevoFavorito.propiedad.categoria?.nombre || null,
        tipoOperacion: nuevoFavorito.propiedad.tipoOperacion?.nombre || null,
        precio: precioActual ? Number(precioActual.precio) : null,
        moneda: precioActual?.moneda || null,
      },
    });
  } catch (error: any) {
    console.error("POST /api/favoritos - Error completo:", error);
    // Manejar error de constraint único (ya existe)
    if (error.code === "P2002") {
      console.error("POST /api/favoritos - Error P2002: Favorito duplicado");
      return NextResponse.json(
        { error: "La propiedad ya está en favoritos" },
        { status: 409 }
      );
    }
    return handleApiError(error);
  }
}

/**
 * DELETE /api/favoritos?idPropiedadPublic=...
 * Elimina una propiedad de favoritos
 */
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const idPropiedadPublic = searchParams.get("idPropiedadPublic");

    if (!idPropiedadPublic) {
      return NextResponse.json(
        { error: "Se requiere idPropiedadPublic como query parameter" },
        { status: 400 }
      );
    }

    const idUsuario = await getIdUsuarioDesdeSesion();
    if (idUsuario === null) {
      return NextResponse.json(
        { error: "Debes iniciar sesión para gestionar favoritos" },
        { status: 401 }
      );
    }

    // Buscar propiedad por idPublic
    const propiedad = await prisma.propiedad.findUnique({
      where: { idPublic: idPropiedadPublic },
    });

    if (!propiedad) {
      return NextResponse.json(
        { error: "Propiedad no encontrada" },
        { status: 404 }
      );
    }

    // Buscar y eliminar favorito
    const favorito = await prisma.favorito.findUnique({
      where: {
        idUsuario_idPropiedad: {
          idUsuario,
          idPropiedad: propiedad.id,
        },
      },
    });

    if (!favorito) {
      return NextResponse.json(
        { error: "La propiedad no está en favoritos" },
        { status: 404 }
      );
    }

    await prisma.favorito.delete({
      where: {
        id: favorito.id,
      },
    });

    return successResponse({
      mensaje: "Propiedad eliminada de favoritos",
      idPropiedadPublic: propiedad.idPublic,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
