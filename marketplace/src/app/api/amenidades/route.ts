import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { handleApiError, successResponse } from "@/lib/api-helpers";

export async function GET() {
  try {
    const items = await prisma.amenidad.findMany({
      orderBy: [{ activo: "desc" }, { nombreAmenidad: "asc" }],
    });
    const data = items.map((a) => ({
      idPublic: a.idPublic,
      nombreAmenidad: a.nombreAmenidad,
      activo: a.activo,
      fechaCreacion: a.fechaCreacion.toISOString(),
      fechaActualizacion: a.fechaActualizacion.toISOString(),
    }));
    return successResponse(data);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { nombreAmenidad, activo = true } = body;

    if (!nombreAmenidad || typeof nombreAmenidad !== "string" || !nombreAmenidad.trim()) {
      return NextResponse.json(
        { error: "nombreAmenidad es requerido" },
        { status: 400 }
      );
    }

    const existente = await prisma.amenidad.findUnique({
      where: { nombreAmenidad: nombreAmenidad.trim() },
    });
    if (existente) {
      return NextResponse.json(
        { error: "Ya existe una amenidad con ese nombre" },
        { status: 400 }
      );
    }

    const creada = await prisma.amenidad.create({
      data: {
        nombreAmenidad: nombreAmenidad.trim(),
        activo: !!activo,
      },
    });

    return successResponse({
      idPublic: creada.idPublic,
      nombreAmenidad: creada.nombreAmenidad,
      activo: creada.activo,
      fechaCreacion: creada.fechaCreacion.toISOString(),
      fechaActualizacion: creada.fechaActualizacion.toISOString(),
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { idPublic, nombreAmenidad, activo } = body;

    if (!idPublic) {
      return NextResponse.json({ error: "idPublic es requerido" }, { status: 400 });
    }

    const existente = await prisma.amenidad.findUnique({
      where: { idPublic },
    });
    if (!existente) {
      return NextResponse.json({ error: "Amenidad no encontrada" }, { status: 404 });
    }

    const updateData: { nombreAmenidad?: string; activo?: boolean } = {};
    if (nombreAmenidad !== undefined && typeof nombreAmenidad === "string" && nombreAmenidad.trim()) {
      const otro = await prisma.amenidad.findFirst({
        where: {
          nombreAmenidad: nombreAmenidad.trim(),
          idPublic: { not: idPublic },
        },
      });
      if (otro) {
        return NextResponse.json(
          { error: "Ya existe otra amenidad con ese nombre" },
          { status: 400 }
        );
      }
      updateData.nombreAmenidad = nombreAmenidad.trim();
    }
    if (activo !== undefined) updateData.activo = !!activo;

    const actualizada = await prisma.amenidad.update({
      where: { idPublic },
      data: updateData,
    });

    return successResponse({
      idPublic: actualizada.idPublic,
      nombreAmenidad: actualizada.nombreAmenidad,
      activo: actualizada.activo,
      fechaCreacion: actualizada.fechaCreacion.toISOString(),
      fechaActualizacion: actualizada.fechaActualizacion.toISOString(),
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const idPublic = searchParams.get("idPublic");

    if (!idPublic) {
      return NextResponse.json({ error: "idPublic es requerido" }, { status: 400 });
    }

    await prisma.amenidad.delete({
      where: { idPublic },
    });

    return successResponse({ message: "Amenidad eliminada correctamente" });
  } catch (error) {
    return handleApiError(error);
  }
}
