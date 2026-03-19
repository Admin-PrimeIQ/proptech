-- CreateTable
CREATE TABLE "usuarios" (
    "id_usuario" TEXT NOT NULL,
    "correo" TEXT NOT NULL,
    "contrasena_hash" TEXT NOT NULL,
    "nombre_completo" TEXT,
    "telefono" TEXT,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_actualizacion" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id_usuario")
);

-- CreateTable
CREATE TABLE "roles" (
    "id_rol" TEXT NOT NULL,
    "clave_rol" TEXT NOT NULL,
    "nombre_rol" TEXT NOT NULL,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("id_rol")
);

-- CreateTable
CREATE TABLE "paises" (
    "id_pais" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,

    CONSTRAINT "paises_pkey" PRIMARY KEY ("id_pais")
);

-- CreateTable
CREATE TABLE "tipo_operacion_inmobiliaria" (
    "id_tipo_operacion_inmobiliaria" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "tipo_operacion_inmobiliaria_pkey" PRIMARY KEY ("id_tipo_operacion_inmobiliaria")
);

-- CreateTable
CREATE TABLE "seo" (
    "id_seo" TEXT NOT NULL,
    "titulo_seo" TEXT,
    "descripcion_seo" TEXT,
    "fecha_actualizacion" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "seo_pkey" PRIMARY KEY ("id_seo")
);

-- CreateTable
CREATE TABLE "footer" (
    "id_footer" TEXT NOT NULL,
    "eslogan_empresa" TEXT,
    "informacion_empresa" TEXT,
    "correo" TEXT,
    "whatsapp" TEXT,
    "telefono" TEXT,
    "instagram" TEXT,
    "facebook" TEXT,
    "fecha_actualizacion" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "footer_pkey" PRIMARY KEY ("id_footer")
);

-- CreateTable
CREATE TABLE "categorias_propiedad" (
    "id_categoria" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "activa" BOOLEAN NOT NULL DEFAULT true,
    "orden" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "categorias_propiedad_pkey" PRIMARY KEY ("id_categoria")
);

-- CreateTable
CREATE TABLE "recursos" (
    "id_recurso" TEXT NOT NULL,
    "tipo_recurso" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "texto_alternativo" TEXT,
    "metadatos" JSONB,
    "creado_por" TEXT NOT NULL,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "recursos_pkey" PRIMARY KEY ("id_recurso")
);

-- CreateTable
CREATE TABLE "departamentos" (
    "id_departamento" TEXT NOT NULL,
    "id_pais" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,

    CONSTRAINT "departamentos_pkey" PRIMARY KEY ("id_departamento")
);

-- CreateTable
CREATE TABLE "configuracion_sitio" (
    "id_configuracion" TEXT NOT NULL,
    "nombre_empresa" TEXT NOT NULL,
    "id_logo_recurso" TEXT,
    "fecha_actualizacion" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "configuracion_sitio_pkey" PRIMARY KEY ("id_configuracion")
);

-- CreateTable
CREATE TABLE "home_configuracion" (
    "id_home" TEXT NOT NULL,
    "titulo_hero" TEXT,
    "subtitulo_hero" TEXT,
    "id_imagen_hero" TEXT,
    "texto_boton_hero" TEXT,
    "link_boton_hero" TEXT,
    "fecha_actualizacion" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "home_configuracion_pkey" PRIMARY KEY ("id_home")
);

-- CreateTable
CREATE TABLE "permisos_especificos_usuario" (
    "id_permiso_usuario" TEXT NOT NULL,
    "id_usuario" TEXT NOT NULL,
    "acceso_general" BOOLEAN NOT NULL DEFAULT false,
    "acceso_home" BOOLEAN NOT NULL DEFAULT false,
    "acceso_propiedades" BOOLEAN NOT NULL DEFAULT false,
    "acceso_configuracion_perfil" BOOLEAN NOT NULL DEFAULT false,
    "fecha_actualizacion" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "permisos_especificos_usuario_pkey" PRIMARY KEY ("id_permiso_usuario")
);

-- CreateTable
CREATE TABLE "ciudades" (
    "id_ciudad" TEXT NOT NULL,
    "id_departamento" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,

    CONSTRAINT "ciudades_pkey" PRIMARY KEY ("id_ciudad")
);

-- CreateTable
CREATE TABLE "zonas" (
    "id_zona" TEXT NOT NULL,
    "id_ciudad" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "slug" TEXT,

    CONSTRAINT "zonas_pkey" PRIMARY KEY ("id_zona")
);

-- CreateTable
CREATE TABLE "usuario_roles" (
    "id_usuario" TEXT NOT NULL,
    "id_rol" TEXT NOT NULL,
    "fecha_asignacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "usuario_roles_pkey" PRIMARY KEY ("id_usuario","id_rol")
);

-- CreateTable
CREATE TABLE "vendedores" (
    "id_vendedor" TEXT NOT NULL,
    "id_usuario" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "id_foto_recurso" TEXT,
    "verificado" BOOLEAN NOT NULL DEFAULT false,
    "fecha_actualizacion" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "vendedores_pkey" PRIMARY KEY ("id_vendedor")
);

-- CreateTable
CREATE TABLE "propiedades" (
    "id_propiedad" TEXT NOT NULL,
    "nombre_propiedad" TEXT NOT NULL,
    "referencia_corta" TEXT,
    "descripcion_general" TEXT,
    "estado_publicacion" TEXT NOT NULL,
    "id_categoria" TEXT NOT NULL,
    "id_tipo_operacion_inmobiliaria" TEXT NOT NULL,
    "id_zona" TEXT,
    "direccion_publica" TEXT,
    "latitud" DECIMAL(10,8),
    "longitud" DECIMAL(11,8),
    "habitaciones" INTEGER,
    "banos" INTEGER,
    "parqueos" INTEGER,
    "metros_construccion" INTEGER,
    "metros_terreno" INTEGER,
    "ano_construccion" INTEGER,
    "id_vendedor" TEXT,
    "creado_por" TEXT NOT NULL,
    "fecha_publicacion" TIMESTAMP(3),
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_actualizacion" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "propiedades_pkey" PRIMARY KEY ("id_propiedad")
);

-- CreateTable
CREATE TABLE "caracteristicas_pagina_principal" (
    "id_caracteristica" TEXT NOT NULL,
    "tipo_categoria" TEXT NOT NULL,
    "referencia_id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "titulo_pagina" TEXT NOT NULL,
    "descripcion_pagina" TEXT,
    "id_banner" TEXT,
    "visible_en_menu" BOOLEAN NOT NULL DEFAULT true,
    "orden_menu" INTEGER NOT NULL DEFAULT 0,
    "filtros_por_defecto" JSONB,
    "id_footer" TEXT,
    "id_seo" TEXT,
    "actualizado_por" TEXT NOT NULL,
    "fecha_actualizacion" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "caracteristicas_pagina_principal_pkey" PRIMARY KEY ("id_caracteristica")
);

-- CreateTable
CREATE TABLE "precios_propiedad" (
    "id_propiedad" TEXT NOT NULL,
    "moneda" TEXT NOT NULL,
    "precio" DECIMAL(15,2) NOT NULL,
    "precio_por_m2_construccion" DECIMAL(15,2),
    "mantenimiento" DECIMAL(15,2),
    "fecha_actualizacion" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "precios_propiedad_pkey" PRIMARY KEY ("id_propiedad")
);

-- CreateTable
CREATE TABLE "imagenes_propiedad" (
    "id_imagen" TEXT NOT NULL,
    "id_propiedad" TEXT NOT NULL,
    "id_recurso" TEXT NOT NULL,
    "orden" INTEGER NOT NULL DEFAULT 0,
    "es_portada" BOOLEAN NOT NULL DEFAULT false,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "imagenes_propiedad_pkey" PRIMARY KEY ("id_imagen")
);

-- CreateTable
CREATE TABLE "solicitudes_contacto" (
    "id_solicitud" TEXT NOT NULL,
    "id_propiedad" TEXT NOT NULL,
    "id_usuario" TEXT,
    "nombre" TEXT NOT NULL,
    "correo" TEXT NOT NULL,
    "telefono" TEXT,
    "mensaje" TEXT,
    "contactado" BOOLEAN,
    "estado" TEXT NOT NULL,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "solicitudes_contacto_pkey" PRIMARY KEY ("id_solicitud")
);

-- CreateTable
CREATE TABLE "favoritos" (
    "id_usuario" TEXT NOT NULL,
    "id_propiedad" TEXT NOT NULL,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "favoritos_pkey" PRIMARY KEY ("id_usuario","id_propiedad")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_correo_key" ON "usuarios"("correo");

-- CreateIndex
CREATE UNIQUE INDEX "roles_clave_rol_key" ON "roles"("clave_rol");

-- CreateIndex
CREATE UNIQUE INDEX "paises_nombre_key" ON "paises"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "tipo_operacion_inmobiliaria_nombre_key" ON "tipo_operacion_inmobiliaria"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "categorias_propiedad_slug_key" ON "categorias_propiedad"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "permisos_especificos_usuario_id_usuario_key" ON "permisos_especificos_usuario"("id_usuario");

-- CreateIndex
CREATE UNIQUE INDEX "vendedores_id_usuario_key" ON "vendedores"("id_usuario");

-- CreateIndex
CREATE UNIQUE INDEX "caracteristicas_pagina_principal_slug_key" ON "caracteristicas_pagina_principal"("slug");

-- AddForeignKey
ALTER TABLE "recursos" ADD CONSTRAINT "recursos_creado_por_fkey" FOREIGN KEY ("creado_por") REFERENCES "usuarios"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "departamentos" ADD CONSTRAINT "departamentos_id_pais_fkey" FOREIGN KEY ("id_pais") REFERENCES "paises"("id_pais") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "configuracion_sitio" ADD CONSTRAINT "configuracion_sitio_id_logo_recurso_fkey" FOREIGN KEY ("id_logo_recurso") REFERENCES "recursos"("id_recurso") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "home_configuracion" ADD CONSTRAINT "home_configuracion_id_imagen_hero_fkey" FOREIGN KEY ("id_imagen_hero") REFERENCES "recursos"("id_recurso") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "permisos_especificos_usuario" ADD CONSTRAINT "permisos_especificos_usuario_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuarios"("id_usuario") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ciudades" ADD CONSTRAINT "ciudades_id_departamento_fkey" FOREIGN KEY ("id_departamento") REFERENCES "departamentos"("id_departamento") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "zonas" ADD CONSTRAINT "zonas_id_ciudad_fkey" FOREIGN KEY ("id_ciudad") REFERENCES "ciudades"("id_ciudad") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "usuario_roles" ADD CONSTRAINT "usuario_roles_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuarios"("id_usuario") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "usuario_roles" ADD CONSTRAINT "usuario_roles_id_rol_fkey" FOREIGN KEY ("id_rol") REFERENCES "roles"("id_rol") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vendedores" ADD CONSTRAINT "vendedores_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuarios"("id_usuario") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vendedores" ADD CONSTRAINT "vendedores_id_foto_recurso_fkey" FOREIGN KEY ("id_foto_recurso") REFERENCES "recursos"("id_recurso") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "propiedades" ADD CONSTRAINT "propiedades_id_categoria_fkey" FOREIGN KEY ("id_categoria") REFERENCES "categorias_propiedad"("id_categoria") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "propiedades" ADD CONSTRAINT "propiedades_id_tipo_operacion_inmobiliaria_fkey" FOREIGN KEY ("id_tipo_operacion_inmobiliaria") REFERENCES "tipo_operacion_inmobiliaria"("id_tipo_operacion_inmobiliaria") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "propiedades" ADD CONSTRAINT "propiedades_id_zona_fkey" FOREIGN KEY ("id_zona") REFERENCES "zonas"("id_zona") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "propiedades" ADD CONSTRAINT "propiedades_id_vendedor_fkey" FOREIGN KEY ("id_vendedor") REFERENCES "vendedores"("id_vendedor") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "propiedades" ADD CONSTRAINT "propiedades_creado_por_fkey" FOREIGN KEY ("creado_por") REFERENCES "usuarios"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "caracteristicas_pagina_principal" ADD CONSTRAINT "caracteristicas_pagina_principal_id_banner_fkey" FOREIGN KEY ("id_banner") REFERENCES "recursos"("id_recurso") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "caracteristicas_pagina_principal" ADD CONSTRAINT "caracteristicas_pagina_principal_id_footer_fkey" FOREIGN KEY ("id_footer") REFERENCES "footer"("id_footer") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "caracteristicas_pagina_principal" ADD CONSTRAINT "caracteristicas_pagina_principal_id_seo_fkey" FOREIGN KEY ("id_seo") REFERENCES "seo"("id_seo") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "caracteristicas_pagina_principal" ADD CONSTRAINT "caracteristicas_pagina_principal_actualizado_por_fkey" FOREIGN KEY ("actualizado_por") REFERENCES "usuarios"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "precios_propiedad" ADD CONSTRAINT "precios_propiedad_id_propiedad_fkey" FOREIGN KEY ("id_propiedad") REFERENCES "propiedades"("id_propiedad") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "imagenes_propiedad" ADD CONSTRAINT "imagenes_propiedad_id_propiedad_fkey" FOREIGN KEY ("id_propiedad") REFERENCES "propiedades"("id_propiedad") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "imagenes_propiedad" ADD CONSTRAINT "imagenes_propiedad_id_recurso_fkey" FOREIGN KEY ("id_recurso") REFERENCES "recursos"("id_recurso") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "solicitudes_contacto" ADD CONSTRAINT "solicitudes_contacto_id_propiedad_fkey" FOREIGN KEY ("id_propiedad") REFERENCES "propiedades"("id_propiedad") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "solicitudes_contacto" ADD CONSTRAINT "solicitudes_contacto_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuarios"("id_usuario") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "favoritos" ADD CONSTRAINT "favoritos_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuarios"("id_usuario") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "favoritos" ADD CONSTRAINT "favoritos_id_propiedad_fkey" FOREIGN KEY ("id_propiedad") REFERENCES "propiedades"("id_propiedad") ON DELETE CASCADE ON UPDATE CASCADE;
