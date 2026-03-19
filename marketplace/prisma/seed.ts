import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando seed...')

  let superAdminRol = await prisma.rol.findUnique({
    where: { claveRol: 'SUPER_ADMIN' },
  })

  if (!superAdminRol) {
    superAdminRol = await prisma.rol.create({
      data: {
        claveRol: 'SUPER_ADMIN',
        nombreRol: 'Super Administrador',
      },
    })
    console.log('✅ Rol SUPER_ADMIN creado')
  } else {
    console.log('ℹ️  Rol SUPER_ADMIN ya existe')
  }

  let usuario = await prisma.usuario.findUnique({
    where: { correo: 'joshua' },
  })

  if (usuario) {
    console.log('ℹ️  Usuario joshua ya existe, actualizando...')

    usuario = await prisma.usuario.update({
      where: { id: usuario.id },
      data: {
        contrasenaHash: '123',
        nombreCompleto: 'Joshua',
        activo: true,
      },
    })

    const usuarioRol = await prisma.usuarioRol.findUnique({
      where: {
        idUsuario_idRol: {
          idUsuario: usuario.id,
          idRol: superAdminRol.id,
        },
      },
    })

    if (!usuarioRol) {
      await prisma.usuarioRol.create({
        data: {
          idUsuario: usuario.id,
          idRol: superAdminRol.id,
        },
      })
      console.log('✅ Rol SUPER_ADMIN asignado al usuario')
    }

    const permisos = await prisma.permisosEspecificosUsuario.findUnique({
      where: { idUsuario: usuario.id },
    })

    if (permisos) {
      await prisma.permisosEspecificosUsuario.update({
        where: { id: permisos.id },
        data: {
          accesoGeneral: true,
          accesoHome: true,
          accesoPropiedades: true,
          accesoConfiguracionPerfil: true,
        },
      })
      console.log('✅ Permisos actualizados')
    } else {
      await prisma.permisosEspecificosUsuario.create({
        data: {
          idUsuario: usuario.id,
          accesoGeneral: true,
          accesoHome: true,
          accesoPropiedades: true,
          accesoConfiguracionPerfil: true,
        },
      })
      console.log('✅ Permisos creados')
    }
  } else {
    usuario = await prisma.usuario.create({
      data: {
        correo: 'joshua',
        contrasenaHash: '123',
        nombreCompleto: 'Joshua',
        activo: true,
      },
    })
    console.log('✅ Usuario joshua creado')

    await prisma.usuarioRol.create({
      data: {
        idUsuario: usuario.id,
        idRol: superAdminRol.id,
      },
    })
    console.log('✅ Rol SUPER_ADMIN asignado')

    await prisma.permisosEspecificosUsuario.create({
      data: {
        idUsuario: usuario.id,
        accesoGeneral: true,
        accesoHome: true,
        accesoPropiedades: true,
        accesoConfiguracionPerfil: true,
      },
    })
    console.log('✅ Permisos creados con todos los accesos activos')
  }

  console.log('🎉 Seed completado exitosamente!')
  console.log('📧 Usuario: joshua')
  console.log('🔑 Contraseña: 123')
}

main()
  .catch((e) => {
    console.error('❌ Error en seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
