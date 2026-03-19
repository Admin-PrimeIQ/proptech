/*
  Warnings:

  - You are about to drop the column `actualizado_por_legacy` on the `caracteristicas_pagina_principal` table. All the data in the column will be lost.
  - You are about to drop the column `id_banner_legacy` on the `caracteristicas_pagina_principal` table. All the data in the column will be lost.
  - You are about to drop the column `id_footer_legacy` on the `caracteristicas_pagina_principal` table. All the data in the column will be lost.
  - You are about to drop the column `id_seo_legacy` on the `caracteristicas_pagina_principal` table. All the data in the column will be lost.
  - You are about to drop the column `id_ciudad` on the `ciudades` table. All the data in the column will be lost.
  - You are about to drop the column `id_departamento_legacy` on the `ciudades` table. All the data in the column will be lost.
  - You are about to drop the column `id_logo_recurso_legacy` on the `configuracion_sitio` table. All the data in the column will be lost.
  - You are about to drop the column `id_departamento` on the `departamentos` table. All the data in the column will be lost.
  - You are about to drop the column `id_pais_legacy` on the `departamentos` table. All the data in the column will be lost.
  - You are about to drop the column `id_imagen_hero_legacy` on the `home_configuracion` table. All the data in the column will be lost.
  - You are about to drop the column `id_propiedad_legacy` on the `imagenes_propiedad` table. All the data in the column will be lost.
  - You are about to drop the column `id_recurso_legacy` on the `imagenes_propiedad` table. All the data in the column will be lost.
  - You are about to drop the column `id_pais` on the `paises` table. All the data in the column will be lost.
  - You are about to drop the column `id_usuario_legacy` on the `permisos_especificos_usuario` table. All the data in the column will be lost.
  - You are about to drop the column `creado_por_legacy` on the `propiedades` table. All the data in the column will be lost.
  - You are about to drop the column `id_categoria_legacy` on the `propiedades` table. All the data in the column will be lost.
  - You are about to drop the column `id_tipo_operacion_inmobiliaria_legacy` on the `propiedades` table. All the data in the column will be lost.
  - You are about to drop the column `id_vendedor_legacy` on the `propiedades` table. All the data in the column will be lost.
  - You are about to drop the column `id_zona_legacy` on the `propiedades` table. All the data in the column will be lost.
  - You are about to drop the column `creado_por_legacy` on the `recursos` table. All the data in the column will be lost.
  - You are about to drop the column `id_propiedad_legacy` on the `solicitudes_contacto` table. All the data in the column will be lost.
  - You are about to drop the column `id_usuario_legacy` on the `solicitudes_contacto` table. All the data in the column will be lost.
  - You are about to drop the column `id_foto_recurso_legacy` on the `vendedores` table. All the data in the column will be lost.
  - You are about to drop the column `id_usuario_legacy` on the `vendedores` table. All the data in the column will be lost.
  - You are about to drop the column `id_ciudad_legacy` on the `zonas` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[id_usuario]` on the table `permisos_especificos_usuario` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id_usuario]` on the table `vendedores` will be added. If there are existing duplicate values, this will fail.

*/
/*
-- DropIndex
DROP INDEX "uq_caracteristicas_pagina_principal_id";

-- DropIndex
--DROP INDEX "uq_categorias_propiedad_id";

-- DropIndex
DROP INDEX "uq_ciudades_id";

-- DropIndex
DROP INDEX "uq_configuracion_sitio_id";

-- DropIndex
DROP INDEX "uq_departamentos_id";

-- DropIndex
DROP INDEX "uq_favoritos_id";

-- DropIndex
DROP INDEX "uq_footer_id";

-- DropIndex
DROP INDEX "uq_home_configuracion_id";

-- DropIndex
DROP INDEX "uq_imagenes_propiedad_id";

-- DropIndex
DROP INDEX "uq_paises_id";

-- DropIndex
DROP INDEX "permisos_especificos_usuario_id_usuario_key";

-- DropIndex
DROP INDEX "uq_permisos_especificos_usuario_id";

-- DropIndex
DROP INDEX "uq_precios_propiedad_id";

-- DropIndex
DROP INDEX "uq_propiedades_id";

-- DropIndex
DROP INDEX "uq_recursos_id";

-- DropIndex
DROP INDEX "uq_roles_id";

-- DropIndex
DROP INDEX "uq_seo_id";

-- DropIndex
DROP INDEX "uq_solicitudes_contacto_id";

-- DropIndex
DROP INDEX "uq_tipo_operacion_inmobiliaria_id";

-- DropIndex
DROP INDEX "uq_usuario_roles_id";

-- DropIndex
DROP INDEX "uq_usuarios_id";

-- DropIndex
DROP INDEX "uq_vendedores_id";

-- DropIndex
DROP INDEX "vendedores_id_usuario_key";

-- DropIndex
DROP INDEX "uq_zonas_id";
*/
-- AlterTable
ALTER TABLE "caracteristicas_pagina_principal" DROP COLUMN "actualizado_por_legacy",
DROP COLUMN "id_banner_legacy",
DROP COLUMN "id_footer_legacy",
DROP COLUMN "id_seo_legacy";

-- AlterTable
ALTER TABLE "ciudades" DROP COLUMN "id_ciudad",
DROP COLUMN "id_departamento_legacy";

-- AlterTable
ALTER TABLE "configuracion_sitio" DROP COLUMN "id_logo_recurso_legacy";

-- AlterTable
ALTER TABLE "departamentos" DROP COLUMN "id_departamento",
DROP COLUMN "id_pais_legacy";

-- AlterTable
ALTER TABLE "home_configuracion" DROP COLUMN "id_imagen_hero_legacy";

-- AlterTable
ALTER TABLE "imagenes_propiedad" DROP COLUMN "id_propiedad_legacy",
DROP COLUMN "id_recurso_legacy";

-- AlterTable
ALTER TABLE "paises" DROP COLUMN "id_pais";

-- AlterTable
ALTER TABLE "permisos_especificos_usuario" DROP COLUMN "id_usuario_legacy";

-- AlterTable
ALTER TABLE "propiedades" DROP COLUMN "creado_por_legacy",
DROP COLUMN "id_categoria_legacy",
DROP COLUMN "id_tipo_operacion_inmobiliaria_legacy",
DROP COLUMN "id_vendedor_legacy",
DROP COLUMN "id_zona_legacy";

-- AlterTable
ALTER TABLE "recursos" DROP COLUMN "creado_por_legacy";

-- AlterTable
ALTER TABLE "solicitudes_contacto" DROP COLUMN "id_propiedad_legacy",
DROP COLUMN "id_usuario_legacy";

-- AlterTable
ALTER TABLE "vendedores" DROP COLUMN "id_foto_recurso_legacy",
DROP COLUMN "id_usuario_legacy";

-- AlterTable
ALTER TABLE "zonas" DROP COLUMN "id_ciudad_legacy";

-- CreateTable
CREATE TABLE "departamentos_destacados" (
    "id" BIGSERIAL NOT NULL,
    "id_public" UUID NOT NULL,
    "nombre_departamento" TEXT NOT NULL,
    "id_recurso" BIGINT NOT NULL,
    "id_caracteristica" BIGINT NOT NULL,
    "id_usuario" BIGINT NOT NULL,
    "orden" INTEGER NOT NULL DEFAULT 0,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "fecha_modificacion" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "departamentos_destacados_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "comentarios_personas" (
    "id" BIGSERIAL NOT NULL,
    "id_public" UUID NOT NULL,
    "nombre_persona_comentario" TEXT NOT NULL,
    "puesto" TEXT NOT NULL,
    "comentario" TEXT NOT NULL,
    "id_recurso" BIGINT NOT NULL,
    "id_caracteristica" BIGINT NOT NULL,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_actualizacion" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "comentarios_personas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "palabras_clave" (
    "id" BIGSERIAL NOT NULL,
    "id_public" UUID NOT NULL,
    "palabra_clave" TEXT NOT NULL,
    "id_caracteristica" BIGINT NOT NULL,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "palabras_clave_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "administradores_publicos" (
    "id" BIGSERIAL NOT NULL,
    "id_public" UUID NOT NULL,
    "nombre" TEXT NOT NULL,
    "puesto" TEXT NOT NULL,
    "id_recurso" BIGINT NOT NULL,
    "id_caracteristica" BIGINT NOT NULL,
    "orden" INTEGER NOT NULL DEFAULT 0,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_actualizacion" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "administradores_publicos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "logos_asociados" (
    "id" BIGSERIAL NOT NULL,
    "id_public" UUID NOT NULL,
    "nombre_asociado" TEXT NOT NULL,
    "id_recurso" BIGINT NOT NULL,
    "id_caracteristica" BIGINT NOT NULL,
    "url_sitio" TEXT,
    "orden" INTEGER NOT NULL DEFAULT 0,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_actualizacion" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "logos_asociados_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "departamentos_destacados_id_public_key" ON "departamentos_destacados"("id_public");

-- CreateIndex
CREATE INDEX "departamentos_destacados_id_caracteristica_orden_idx" ON "departamentos_destacados"("id_caracteristica", "orden");

-- CreateIndex
CREATE INDEX "departamentos_destacados_id_recurso_idx" ON "departamentos_destacados"("id_recurso");

-- CreateIndex
CREATE UNIQUE INDEX "comentarios_personas_id_public_key" ON "comentarios_personas"("id_public");

-- CreateIndex
CREATE INDEX "comentarios_personas_id_caracteristica_id_recurso_idx" ON "comentarios_personas"("id_caracteristica", "id_recurso");

-- CreateIndex
CREATE UNIQUE INDEX "palabras_clave_id_public_key" ON "palabras_clave"("id_public");

-- CreateIndex
CREATE INDEX "palabras_clave_id_caracteristica_idx" ON "palabras_clave"("id_caracteristica");

-- CreateIndex
CREATE UNIQUE INDEX "administradores_publicos_id_public_key" ON "administradores_publicos"("id_public");

-- CreateIndex
CREATE INDEX "administradores_publicos_id_caracteristica_orden_idx" ON "administradores_publicos"("id_caracteristica", "orden");

-- CreateIndex
CREATE INDEX "administradores_publicos_id_recurso_idx" ON "administradores_publicos"("id_recurso");

-- CreateIndex
CREATE UNIQUE INDEX "logos_asociados_id_public_key" ON "logos_asociados"("id_public");

-- CreateIndex
CREATE INDEX "logos_asociados_id_caracteristica_orden_idx" ON "logos_asociados"("id_caracteristica", "orden");

-- CreateIndex
CREATE INDEX "logos_asociados_id_recurso_idx" ON "logos_asociados"("id_recurso");

-- CreateIndex
CREATE UNIQUE INDEX "permisos_especificos_usuario_id_usuario_key" ON "permisos_especificos_usuario"("id_usuario");

-- CreateIndex
CREATE UNIQUE INDEX "vendedores_id_usuario_key" ON "vendedores"("id_usuario");

-- AddForeignKey
ALTER TABLE "departamentos_destacados" ADD CONSTRAINT "departamentos_destacados_id_recurso_fkey" FOREIGN KEY ("id_recurso") REFERENCES "recursos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "departamentos_destacados" ADD CONSTRAINT "departamentos_destacados_id_caracteristica_fkey" FOREIGN KEY ("id_caracteristica") REFERENCES "caracteristicas_pagina_principal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "departamentos_destacados" ADD CONSTRAINT "departamentos_destacados_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comentarios_personas" ADD CONSTRAINT "comentarios_personas_id_recurso_fkey" FOREIGN KEY ("id_recurso") REFERENCES "recursos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comentarios_personas" ADD CONSTRAINT "comentarios_personas_id_caracteristica_fkey" FOREIGN KEY ("id_caracteristica") REFERENCES "caracteristicas_pagina_principal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "palabras_clave" ADD CONSTRAINT "palabras_clave_id_caracteristica_fkey" FOREIGN KEY ("id_caracteristica") REFERENCES "caracteristicas_pagina_principal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "administradores_publicos" ADD CONSTRAINT "administradores_publicos_id_recurso_fkey" FOREIGN KEY ("id_recurso") REFERENCES "recursos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "administradores_publicos" ADD CONSTRAINT "administradores_publicos_id_caracteristica_fkey" FOREIGN KEY ("id_caracteristica") REFERENCES "caracteristicas_pagina_principal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "logos_asociados" ADD CONSTRAINT "logos_asociados_id_recurso_fkey" FOREIGN KEY ("id_recurso") REFERENCES "recursos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "logos_asociados" ADD CONSTRAINT "logos_asociados_id_caracteristica_fkey" FOREIGN KEY ("id_caracteristica") REFERENCES "caracteristicas_pagina_principal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- RenameIndex
ALTER INDEX "uq_caracteristicas_pagina_principal_id_public" RENAME TO "caracteristicas_pagina_principal_id_public_key";

-- RenameIndex
ALTER INDEX "uq_categorias_propiedad_id_public" RENAME TO "categorias_propiedad_id_public_key";

-- RenameIndex
ALTER INDEX "uq_ciudades_id_public" RENAME TO "ciudades_id_public_key";

-- RenameIndex
ALTER INDEX "uq_configuracion_sitio_id_public" RENAME TO "configuracion_sitio_id_public_key";

-- RenameIndex
ALTER INDEX "uq_departamentos_id_public" RENAME TO "departamentos_id_public_key";

-- RenameIndex
ALTER INDEX "favoritos_usuario_propiedad_unique" RENAME TO "favoritos_id_usuario_id_propiedad_key";

-- RenameIndex
ALTER INDEX "uq_favoritos_id_public" RENAME TO "favoritos_id_public_key";

-- RenameIndex
ALTER INDEX "uq_footer_id_public" RENAME TO "footer_id_public_key";

-- RenameIndex
ALTER INDEX "uq_home_configuracion_id_public" RENAME TO "home_configuracion_id_public_key";

-- RenameIndex
ALTER INDEX "uq_imagenes_propiedad_id_public" RENAME TO "imagenes_propiedad_id_public_key";

-- RenameIndex
ALTER INDEX "uq_paises_id_public" RENAME TO "paises_id_public_key";

-- RenameIndex
ALTER INDEX "uq_permisos_especificos_usuario_id_public" RENAME TO "permisos_especificos_usuario_id_public_key";

-- RenameIndex
ALTER INDEX "uq_precios_propiedad_id_public" RENAME TO "precios_propiedad_id_public_key";

-- RenameIndex
ALTER INDEX "uq_propiedades_id_public" RENAME TO "propiedades_id_public_key";

-- RenameIndex
ALTER INDEX "uq_recursos_id_public" RENAME TO "recursos_id_public_key";

-- RenameIndex
ALTER INDEX "uq_roles_id_public" RENAME TO "roles_id_public_key";

-- RenameIndex
ALTER INDEX "uq_seo_id_public" RENAME TO "seo_id_public_key";

-- RenameIndex
ALTER INDEX "uq_solicitudes_contacto_id_public" RENAME TO "solicitudes_contacto_id_public_key";

-- RenameIndex
ALTER INDEX "uq_tipo_operacion_inmobiliaria_id_public" RENAME TO "tipo_operacion_inmobiliaria_id_public_key";

-- RenameIndex
ALTER INDEX "uq_usuario_roles_id_public" RENAME TO "usuario_roles_id_public_key";

-- RenameIndex
ALTER INDEX "usuario_roles_usuario_rol_unique" RENAME TO "usuario_roles_id_usuario_id_rol_key";

-- RenameIndex
ALTER INDEX "uq_usuarios_id_public" RENAME TO "usuarios_id_public_key";

-- RenameIndex
ALTER INDEX "uq_vendedores_id_public" RENAME TO "vendedores_id_public_key";

-- RenameIndex
ALTER INDEX "uq_zonas_id_public" RENAME TO "zonas_id_public_key";
