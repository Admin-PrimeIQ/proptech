import { z } from 'zod'

// Validación para crear/actualizar usuario
export const usuarioSchema = z.object({
  correo: z.string().email('Correo electrónico inválido'),
  contrasenaHash: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
  nombreCompleto: z.string().optional(),
  telefono: z.string().optional(),
})

// Validación para login
export const loginSchema = z.object({
  correo: z.string().email('Correo electrónico inválido'),
  contrasena: z.string().min(1, 'La contraseña es requerida'),
})

// Validación para crear propiedad
export const propiedadSchema = z.object({
  nombrePropiedad: z.string().min(1, 'El nombre de la propiedad es requerido'),
  referenciaCorta: z.string().optional(),
  descripcionGeneral: z.string().optional(),
  estadoPublicacion: z.string().min(1, 'El estado de publicación es requerido'),
  idCategoria: z.string().uuid('ID de categoría inválido'),
  idTipoOperacionInmobiliaria: z.string().uuid('ID de tipo de operación inválido'),
  idZona: z.string().uuid().optional(),
  direccionPublica: z.string().optional(),
  latitud: z.number().optional(),
  longitud: z.number().optional(),
  habitaciones: z.number().int().positive().optional(),
  banos: z.number().int().positive().optional(),
  parqueos: z.number().int().positive().optional(),
  metrosConstruccion: z.number().int().positive().optional(),
  metrosTerreno: z.number().int().positive().optional(),
  anoConstruccion: z.number().int().positive().optional(),
  idVendedor: z.string().uuid().optional(),
})

// Validación para precio de propiedad
export const precioPropiedadSchema = z.object({
  moneda: z.string().min(1, 'La moneda es requerida'),
  precio: z.number().positive('El precio debe ser positivo'),
  precioPorM2Construccion: z.number().positive().optional(),
  mantenimiento: z.number().positive().optional(),
})

// Validación para solicitud de contacto
export const solicitudContactoSchema = z.object({
  idPropiedad: z.string().uuid('ID de propiedad inválido'),
  nombre: z.string().min(1, 'El nombre es requerido'),
  correo: z.string().email('Correo electrónico inválido'),
  telefono: z.string().optional(),
  mensaje: z.string().optional(),
})

// Tipos TypeScript derivados de los schemas
export type UsuarioInput = z.infer<typeof usuarioSchema>
export type LoginInput = z.infer<typeof loginSchema>
export type PropiedadInput = z.infer<typeof propiedadSchema>
export type PrecioPropiedadInput = z.infer<typeof precioPropiedadSchema>
export type SolicitudContactoInput = z.infer<typeof solicitudContactoSchema>
