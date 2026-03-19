-- AlterTable: agregar nombre_usuario a usuarios (nullable, unique)
ALTER TABLE "usuarios" ADD COLUMN IF NOT EXISTS "nombre_usuario" TEXT;

CREATE UNIQUE INDEX "usuarios_nombre_usuario_key" ON "usuarios"("nombre_usuario");

-- CreateTable: acerca_de_nosotros (contenido página institucional)
CREATE TABLE "acerca_de_nosotros" (
    "id" SERIAL NOT NULL,
    "id_public" UUID NOT NULL DEFAULT gen_random_uuid(),
    "titulo" TEXT NOT NULL,
    "titulo_seccion_razones" TEXT,
    "texto_seccion_razones" TEXT,
    "informacion_excelencia" TEXT,
    "informacion_logros" TEXT,
    "informacion_calidad" TEXT,
    "informacion_transparencia" TEXT,
    "actualizado_por" BIGINT,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_actualizacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "acerca_de_nosotros_pkey" PRIMARY KEY ("id")
);

-- CreateTable: acerca_de_nosotros_imagen (tabla puente imágenes)
CREATE TABLE "acerca_de_nosotros_imagen" (
    "id" SERIAL NOT NULL,
    "acerca_de_nosotros_id" INTEGER NOT NULL,
    "id_recurso" BIGINT NOT NULL,
    "tipo" TEXT,
    "orden" INTEGER NOT NULL DEFAULT 0,
    "alt_text" TEXT,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "acerca_de_nosotros_imagen_pkey" PRIMARY KEY ("id")
);

-- CreateIndex: acerca_de_nosotros
CREATE UNIQUE INDEX "acerca_de_nosotros_id_public_key" ON "acerca_de_nosotros"("id_public");

-- CreateIndex: acerca_de_nosotros_imagen
CREATE UNIQUE INDEX "acerca_de_nosotros_imagen_acerca_de_nosotros_id_id_recurso_key" ON "acerca_de_nosotros_imagen"("acerca_de_nosotros_id", "id_recurso");
CREATE INDEX "acerca_de_nosotros_imagen_acerca_de_nosotros_id_orden_idx" ON "acerca_de_nosotros_imagen"("acerca_de_nosotros_id", "orden");
CREATE INDEX "acerca_de_nosotros_imagen_id_recurso_idx" ON "acerca_de_nosotros_imagen"("id_recurso");

-- AddForeignKey: acerca_de_nosotros.actualizado_por -> usuarios.id
ALTER TABLE "acerca_de_nosotros" ADD CONSTRAINT "acerca_de_nosotros_actualizado_por_fkey" FOREIGN KEY ("actualizado_por") REFERENCES "usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey: acerca_de_nosotros_imagen
ALTER TABLE "acerca_de_nosotros_imagen" ADD CONSTRAINT "acerca_de_nosotros_imagen_acerca_de_nosotros_id_fkey" FOREIGN KEY ("acerca_de_nosotros_id") REFERENCES "acerca_de_nosotros"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "acerca_de_nosotros_imagen" ADD CONSTRAINT "acerca_de_nosotros_imagen_id_recurso_fkey" FOREIGN KEY ("id_recurso") REFERENCES "recursos"("id") ON DELETE CASCADE ON UPDATE CASCADE;
