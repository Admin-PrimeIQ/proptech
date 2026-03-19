import { NextRequest, NextResponse } from "next/server";

// Valores por defecto
const DEFAULT_CONFIG = {
  nombreEmpresa: "Nombre de la Compañía",
  esloganEmpresa: "Tu eslogan aquí",
};

// Simulación de almacenamiento en memoria (temporal, sin BD)
// TODO: Conectar con base de datos después
let configuracionCache = { ...DEFAULT_CONFIG };

// GET - Obtener configuración del sitio
export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      data: {
        nombreEmpresa: configuracionCache.nombreEmpresa,
        esloganEmpresa: configuracionCache.esloganEmpresa,
      },
    });
  } catch (error) {
    console.error("Error obteniendo configuración:", error);
    return NextResponse.json(
      { success: false, error: "Error al obtener la configuración" },
      { status: 500 }
    );
  }
}

// PUT - Actualizar configuración del sitio
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { nombreEmpresa, esloganEmpresa } = body;

    // Actualizar cache en memoria (temporal)
    // TODO: Guardar en base de datos después
    if (nombreEmpresa !== undefined) {
      configuracionCache.nombreEmpresa = nombreEmpresa;
    }
    if (esloganEmpresa !== undefined) {
      configuracionCache.esloganEmpresa = esloganEmpresa;
    }

    return NextResponse.json({
      success: true,
      data: {
        nombreEmpresa: configuracionCache.nombreEmpresa,
        esloganEmpresa: configuracionCache.esloganEmpresa,
        message: "Configuración actualizada correctamente",
      },
    });
  } catch (error) {
    console.error("Error actualizando configuración:", error);
    return NextResponse.json(
      { success: false, error: "Error al actualizar la configuración" },
      { status: 500 }
    );
  }
}
