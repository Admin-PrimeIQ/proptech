import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    // Contar el total de propiedades existentes
    const totalPropiedades = await prisma.propiedad.count();
    
    // El siguiente número será totalPropiedades + 1
    const siguienteNumero = totalPropiedades + 1;
    
    // Formatear como REF-001, REF-002, etc.
    const referenciaCorta = `REF-${siguienteNumero.toString().padStart(3, '0')}`;
    
    return NextResponse.json({ 
      referenciaCorta,
      siguienteNumero 
    });
  } catch (error) {
    console.error("Error al obtener siguiente referencia:", error);
    return NextResponse.json(
      { error: "Error al generar referencia" },
      { status: 500 }
    );
  }
}
