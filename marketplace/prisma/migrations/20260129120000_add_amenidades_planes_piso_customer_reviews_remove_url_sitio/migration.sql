-- AlterTable: quitar url_sitio de logos_asociados
ALTER TABLE "logos_asociados" DROP COLUMN IF EXISTS "url_sitio";

-- CreateTable: amenidades (catálogo)
CREATE TABLE "amenidades" (
    "id" BIGSERIAL NOT NULL,
    "id_public" UUID NOT NULL,
    "nombre_amenidad" TEXT NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_actualizacion" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "amenidades_pkey" PRIMARY KEY ("id")
);

-- CreateTable: propiedad_amenidad (tabla puente N:M)
CREATE TABLE "propiedad_amenidad" (
    "id_propiedad" BIGINT NOT NULL,
    "id_amenidad" BIGINT NOT NULL,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "propiedad_amenidad_pkey" PRIMARY KEY ("id_propiedad","id_amenidad")
);

-- CreateTable: planes_piso
CREATE TABLE "planes_piso" (
    "id" BIGSERIAL NOT NULL,
    "id_public" UUID NOT NULL,
    "nombre_del_plano" TEXT NOT NULL,
    "id_recurso" BIGINT NOT NULL,
    "id_propiedad" BIGINT NOT NULL,
    "orden" INTEGER NOT NULL DEFAULT 0,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_actualizacion" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "planes_piso_pkey" PRIMARY KEY ("id")
);

-- CreateTable: customer_reviews (reseñas de clientes)
CREATE TABLE "customer_reviews" (
    "id" BIGSERIAL NOT NULL,
    "id_public" UUID NOT NULL,
    "nombre_completo" TEXT NOT NULL,
    "numero_telefono" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "mensaje" TEXT NOT NULL,
    "id_usuario" BIGINT NOT NULL,
    "desea_publicar" BOOLEAN NOT NULL DEFAULT false,
    "visible_publico" BOOLEAN NOT NULL DEFAULT false,
    "estado" TEXT NOT NULL DEFAULT 'NUEVA',
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_actualizacion" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "customer_reviews_pkey" PRIMARY KEY ("id")
);

-- CreateIndex: amenidades
CREATE UNIQUE INDEX "amenidades_id_public_key" ON "amenidades"("id_public");
CREATE UNIQUE INDEX "amenidades_nombre_amenidad_key" ON "amenidades"("nombre_amenidad");

-- CreateIndex: propiedad_amenidad
CREATE INDEX "propiedad_amenidad_id_amenidad_idx" ON "propiedad_amenidad"("id_amenidad");

-- CreateIndex: planes_piso
CREATE UNIQUE INDEX "planes_piso_id_public_key" ON "planes_piso"("id_public");
CREATE INDEX "planes_piso_id_propiedad_orden_idx" ON "planes_piso"("id_propiedad", "orden");
CREATE INDEX "planes_piso_id_recurso_idx" ON "planes_piso"("id_recurso");

-- CreateIndex: customer_reviews
CREATE UNIQUE INDEX "customer_reviews_id_public_key" ON "customer_reviews"("id_public");
CREATE INDEX "customer_reviews_id_usuario_idx" ON "customer_reviews"("id_usuario");
CREATE INDEX "customer_reviews_estado_idx" ON "customer_reviews"("estado");

-- AddForeignKey: propiedad_amenidad
ALTER TABLE "propiedad_amenidad" ADD CONSTRAINT "propiedad_amenidad_id_propiedad_fkey" FOREIGN KEY ("id_propiedad") REFERENCES "propiedades"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "propiedad_amenidad" ADD CONSTRAINT "propiedad_amenidad_id_amenidad_fkey" FOREIGN KEY ("id_amenidad") REFERENCES "amenidades"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey: planes_piso
ALTER TABLE "planes_piso" ADD CONSTRAINT "planes_piso_id_recurso_fkey" FOREIGN KEY ("id_recurso") REFERENCES "recursos"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "planes_piso" ADD CONSTRAINT "planes_piso_id_propiedad_fkey" FOREIGN KEY ("id_propiedad") REFERENCES "propiedades"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey: customer_reviews
ALTER TABLE "customer_reviews" ADD CONSTRAINT "customer_reviews_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;
