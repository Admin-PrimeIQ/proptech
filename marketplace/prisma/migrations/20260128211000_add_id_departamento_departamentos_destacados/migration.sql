-- AlterTable
ALTER TABLE "departamentos_destacados" ADD COLUMN "id_departamento" BIGINT;

-- CreateIndex
CREATE INDEX "departamentos_destacados_id_departamento_idx" ON "departamentos_destacados"("id_departamento");

-- AddForeignKey
ALTER TABLE "departamentos_destacados" ADD CONSTRAINT "departamentos_destacados_id_departamento_fkey" FOREIGN KEY ("id_departamento") REFERENCES "departamentos"("id") ON DELETE SET NULL ON UPDATE CASCADE;
