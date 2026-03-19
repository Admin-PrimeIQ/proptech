-- AlterTable
ALTER TABLE "customer_reviews" ADD COLUMN IF NOT EXISTS "id_propiedad" BIGINT;

-- CreateIndex
CREATE INDEX IF NOT EXISTS "customer_reviews_id_propiedad_idx" ON "customer_reviews"("id_propiedad");

-- AddForeignKey
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'customer_reviews_id_propiedad_fkey'
  ) THEN
    ALTER TABLE "customer_reviews" ADD CONSTRAINT "customer_reviews_id_propiedad_fkey"
      FOREIGN KEY ("id_propiedad") REFERENCES "propiedades"("id") ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
END $$;
