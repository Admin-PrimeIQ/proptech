-- CreateTable
CREATE TABLE "soluciones_empresariales" (
    "id" SERIAL NOT NULL,
    "id_public" UUID NOT NULL,
    "id_recursos" BIGINT NOT NULL,
    "titulo_hero" TEXT NOT NULL,
    "titulo_seccion_informacion" TEXT,
    "contexto_seccion_informacion" TEXT,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_actualizacion" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "soluciones_empresariales_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "planes" (
    "id" SERIAL NOT NULL,
    "id_public" UUID NOT NULL,
    "titulo" TEXT NOT NULL,
    "monto_quetzales" DECIMAL(15,2) NOT NULL,
    "monto_dolares" DECIMAL(15,2) NOT NULL,
    "orden" INTEGER NOT NULL DEFAULT 0,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_actualizacion" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "planes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "beneficios_plan" (
    "id" SERIAL NOT NULL,
    "id_public" UUID NOT NULL,
    "id_plan" INTEGER NOT NULL,
    "titulo_ventaja" TEXT NOT NULL,
    "orden" INTEGER NOT NULL DEFAULT 0,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "beneficios_plan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "servicios_empresariales" (
    "id" SERIAL NOT NULL,
    "id_public" UUID NOT NULL,
    "titulo_servicio" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "id_recursos" BIGINT NOT NULL,
    "orden" INTEGER NOT NULL DEFAULT 0,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_actualizacion" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "servicios_empresariales_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "planes_servicios" (
    "id_plan" INTEGER NOT NULL,
    "id_servicio" INTEGER NOT NULL,
    "orden" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "planes_servicios_pkey" PRIMARY KEY ("id_plan","id_servicio")
);

-- CreateIndex
CREATE UNIQUE INDEX "soluciones_empresariales_id_public_key" ON "soluciones_empresariales"("id_public");

-- CreateIndex
CREATE INDEX "soluciones_empresariales_id_recursos_idx" ON "soluciones_empresariales"("id_recursos");

-- CreateIndex
CREATE UNIQUE INDEX "planes_id_public_key" ON "planes"("id_public");

-- CreateIndex
CREATE INDEX "planes_orden_idx" ON "planes"("orden");

-- CreateIndex
CREATE UNIQUE INDEX "beneficios_plan_id_public_key" ON "beneficios_plan"("id_public");

-- CreateIndex
CREATE INDEX "beneficios_plan_id_plan_orden_idx" ON "beneficios_plan"("id_plan", "orden");

-- CreateIndex
CREATE UNIQUE INDEX "servicios_empresariales_id_public_key" ON "servicios_empresariales"("id_public");

-- CreateIndex
CREATE INDEX "servicios_empresariales_id_recursos_orden_idx" ON "servicios_empresariales"("id_recursos", "orden");

-- CreateIndex
CREATE INDEX "planes_servicios_id_plan_orden_idx" ON "planes_servicios"("id_plan", "orden");

-- CreateIndex
CREATE INDEX "planes_servicios_id_servicio_idx" ON "planes_servicios"("id_servicio");

-- AddForeignKey
ALTER TABLE "soluciones_empresariales" ADD CONSTRAINT "soluciones_empresariales_id_recursos_fkey" FOREIGN KEY ("id_recursos") REFERENCES "recursos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "beneficios_plan" ADD CONSTRAINT "beneficios_plan_id_plan_fkey" FOREIGN KEY ("id_plan") REFERENCES "planes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "servicios_empresariales" ADD CONSTRAINT "servicios_empresariales_id_recursos_fkey" FOREIGN KEY ("id_recursos") REFERENCES "recursos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "planes_servicios" ADD CONSTRAINT "planes_servicios_id_plan_fkey" FOREIGN KEY ("id_plan") REFERENCES "planes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "planes_servicios" ADD CONSTRAINT "planes_servicios_id_servicio_fkey" FOREIGN KEY ("id_servicio") REFERENCES "servicios_empresariales"("id") ON DELETE CASCADE ON UPDATE CASCADE;
