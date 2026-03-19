CREATE TABLE "informacion_pagina_items" (
  "id" BIGSERIAL PRIMARY KEY,
  "id_public" UUID NOT NULL DEFAULT gen_random_uuid(),
  "id_caracteristica" BIGINT NOT NULL,
  "titulo" TEXT NOT NULL,
  "descripcion" TEXT,
  "id_recurso" BIGINT NOT NULL,
  "orden" INTEGER NOT NULL DEFAULT 0,
  "activo" BOOLEAN NOT NULL DEFAULT true,
  "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "fecha_actualizacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX "informacion_pagina_items_id_public_key" ON "informacion_pagina_items"("id_public");
CREATE INDEX "informacion_pagina_items_id_caracteristica_orden_idx" ON "informacion_pagina_items"("id_caracteristica", "orden");

ALTER TABLE "informacion_pagina_items"
  ADD CONSTRAINT "informacion_pagina_items_id_caracteristica_fkey"
  FOREIGN KEY ("id_caracteristica") REFERENCES "caracteristicas_pagina_principal"("id")
  ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "informacion_pagina_items"
  ADD CONSTRAINT "informacion_pagina_items_id_recurso_fkey"
  FOREIGN KEY ("id_recurso") REFERENCES "recursos"("id")
  ON DELETE RESTRICT ON UPDATE CASCADE;
