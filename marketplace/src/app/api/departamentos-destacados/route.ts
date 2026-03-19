import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { handleApiError, successResponse } from "@/lib/api-helpers";
import { getOrCreateHomeFeature } from "@/lib/get-home-feature";

/** Normaliza nombre para match (trim, minúsculas, sin acentos). */
function normalizeNombreForMatch(s: string): string {
  return s
    .trim()
    .toLowerCase()
    .replace(/[áàäâã]/g, "a")
    .replace(/[éèëê]/g, "e")
    .replace(/[íìïî]/g, "i")
    .replace(/[óòöôõ]/g, "o")
    .replace(/[úùüû]/g, "u")
    .replace(/ñ/g, "n");
}

export async function GET() {
  try {
    const feature = await getOrCreateHomeFeature();
    const [items, departamentos] = await Promise.all([
      prisma.departamentoDestacado.findMany({
        where: { idCaracteristica: feature.id },
        include: { recurso: true, usuario: true, departamento: true },
        orderBy: [{ orden: "asc" }, { fechaModificacion: "desc" }],
      }),
      prisma.departamento.findMany({ orderBy: { nombre: "asc" } }),
    ]);

    const mapByNombre = new Map<string, string>();
    for (const d of departamentos) {
      const k = normalizeNombreForMatch(d.nombre);
      if (!mapByNombre.has(k)) mapByNombre.set(k, d.idPublic);
    }

    const formatted = items.map((item) => {
      const departamentoIdPublic =
        item.departamento?.idPublic ??
        mapByNombre.get(normalizeNombreForMatch(item.nombreDepartamento)) ??
        null;
      return {
        idPublic: item.idPublic,
        nombreDepartamento: item.nombreDepartamento,
        departamentoIdPublic,
        imagen: item.recurso ? { idPublic: item.recurso.idPublic, url: item.recurso.url } : null,
        orden: item.orden,
        activo: item.activo,
        fechaModificacion: item.fechaModificacion.toISOString(),
      };
    });

    return successResponse(formatted);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { nombreDepartamento, imagenIdRecurso, orden, activo, departamentoIdPublic } = body;

    if (!nombreDepartamento) {
      return NextResponse.json({ error: "nombreDepartamento es requerido" }, { status: 400 });
    }

    const feature = await getOrCreateHomeFeature();
    const primerUsuario = await prisma.usuario.findFirst();
    if (!primerUsuario) {
      return NextResponse.json({ error: "No hay usuarios en el sistema" }, { status: 500 });
    }

    if (!imagenIdRecurso) {
      return NextResponse.json({ error: "imagenIdRecurso es requerido" }, { status: 400 });
    }

    const recurso = await prisma.recurso.findUnique({ where: { idPublic: imagenIdRecurso } });
    if (!recurso) {
      return NextResponse.json({ error: "Recurso no encontrado" }, { status: 404 });
    }

    let idDepartamento: bigint | undefined;
    if (departamentoIdPublic?.trim()) {
      const dept = await prisma.departamento.findUnique({
        where: { idPublic: departamentoIdPublic.trim() },
      });
      if (dept) idDepartamento = dept.id;
    }

    const nuevo = await prisma.departamentoDestacado.create({
      data: {
        nombreDepartamento,
        idDepartamento: idDepartamento ?? null,
        idRecurso: recurso.id,
        idCaracteristica: feature.id,
        idUsuario: primerUsuario.id,
        orden: orden ?? 0,
        activo: activo !== undefined ? activo : true,
      },
      include: { recurso: true, departamento: true },
    });

    return successResponse({
      idPublic: nuevo.idPublic,
      nombreDepartamento: nuevo.nombreDepartamento,
      departamentoIdPublic: nuevo.departamento?.idPublic ?? null,
      imagen: nuevo.recurso ? { idPublic: nuevo.recurso.idPublic, url: nuevo.recurso.url } : null,
      orden: nuevo.orden,
      activo: nuevo.activo,
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { idPublic, nombreDepartamento, imagenIdRecurso, orden, activo, departamentoIdPublic } = body;

    if (!idPublic) {
      return NextResponse.json({ error: "idPublic es requerido" }, { status: 400 });
    }

    const existente = await prisma.departamentoDestacado.findUnique({
      where: { idPublic },
      include: { recurso: true },
    });

    if (!existente) {
      return NextResponse.json({ error: "Departamento destacado no encontrado" }, { status: 404 });
    }

    const updateData: any = {};
    if (nombreDepartamento !== undefined) updateData.nombreDepartamento = nombreDepartamento;
    if (orden !== undefined) updateData.orden = orden;
    if (activo !== undefined) updateData.activo = activo;

    if (departamentoIdPublic !== undefined) {
      if (!departamentoIdPublic?.trim()) {
        updateData.idDepartamento = null;
      } else {
        const dept = await prisma.departamento.findUnique({
          where: { idPublic: departamentoIdPublic.trim() },
        });
        updateData.idDepartamento = dept ? dept.id : null;
      }
    }

    if (imagenIdRecurso) {
      const recurso = await prisma.recurso.findUnique({ where: { idPublic: imagenIdRecurso } });
      if (!recurso) {
        return NextResponse.json({ error: "Recurso no encontrado" }, { status: 404 });
      }
      updateData.idRecurso = recurso.id;
    }

    const actualizado = await prisma.departamentoDestacado.update({
      where: { idPublic },
      data: updateData,
      include: { recurso: true, departamento: true },
    });

    return successResponse({
      idPublic: actualizado.idPublic,
      nombreDepartamento: actualizado.nombreDepartamento,
      departamentoIdPublic: actualizado.departamento?.idPublic ?? null,
      imagen: actualizado.recurso ? { idPublic: actualizado.recurso.idPublic, url: actualizado.recurso.url } : null,
      orden: actualizado.orden,
      activo: actualizado.activo,
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

    await prisma.departamentoDestacado.delete({
      where: { idPublic },
    });

    return successResponse({ message: "Departamento destacado eliminado correctamente" });
  } catch (error) {
    return handleApiError(error);
  }
}
