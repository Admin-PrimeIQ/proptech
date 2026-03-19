import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { handleApiError, successResponse } from "@/lib/api-helpers";
import { getOrCreateHomeFeature } from "@/lib/get-home-feature";

export async function GET() {
  try {
    const feature = await getOrCreateHomeFeature();
    const items = await prisma.palabraClave.findMany({
      where: { idCaracteristica: feature.id },
      orderBy: { fechaCreacion: "desc" },
    });

    const formatted = items.map((item) => ({
      idPublic: item.idPublic,
      palabraClave: item.palabraClave,
      fechaCreacion: item.fechaCreacion.toISOString(),
    }));

    return successResponse(formatted);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { palabraClave } = body;

    if (!palabraClave) {
      return NextResponse.json({ error: "palabraClave es requerido" }, { status: 400 });
    }

    const feature = await getOrCreateHomeFeature();

    const nuevo = await prisma.palabraClave.create({
      data: {
        palabraClave,
        idCaracteristica: feature.id,
      },
    });

    return successResponse({
      idPublic: nuevo.idPublic,
      palabraClave: nuevo.palabraClave,
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { idPublic, palabraClave } = body;

    if (!idPublic) {
      return NextResponse.json({ error: "idPublic es requerido" }, { status: 400 });
    }

    const existente = await prisma.palabraClave.findUnique({
      where: { idPublic },
    });

    if (!existente) {
      return NextResponse.json({ error: "Palabra clave no encontrada" }, { status: 404 });
    }

    const actualizado = await prisma.palabraClave.update({
      where: { idPublic },
      data: { palabraClave },
    });

    return successResponse({
      idPublic: actualizado.idPublic,
      palabraClave: actualizado.palabraClave,
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

    await prisma.palabraClave.delete({
      where: { idPublic },
    });

    return successResponse({ message: "Palabra clave eliminada correctamente" });
  } catch (error) {
    return handleApiError(error);
  }
}
