import { NextResponse } from 'next/server'
import { ZodError } from 'zod'

// Helper para manejar errores en API routes
export function handleApiError(error: unknown) {
  console.error('API Error:', error)

  if (error instanceof ZodError) {
    return NextResponse.json(
      {
        error: 'Error de validación',
        details: error.errors,
      },
      { status: 400 }
    )
  }

  if (error instanceof Error) {
    return NextResponse.json(
      {
        error: error.message || 'Error interno del servidor',
      },
      { status: 500 }
    )
  }

  return NextResponse.json(
    {
      error: 'Error desconocido',
    },
    { status: 500 }
  )
}

// Helper para respuestas exitosas
export function successResponse(data: any, status: number = 200) {
  return NextResponse.json(data, { status })
}

// Helper para respuestas de error
export function errorResponse(message: string, status: number = 400) {
  return NextResponse.json({ error: message }, { status })
}

// Helper para verificar autenticación (ejemplo básico)
export function requireAuth(request: Request) {
  // Aquí puedes implementar tu lógica de autenticación
  // Por ejemplo, verificar tokens JWT, sesiones, etc.
  const authHeader = request.headers.get('authorization')
  
  if (!authHeader) {
    throw new Error('No autorizado')
  }
  
  return true
}
