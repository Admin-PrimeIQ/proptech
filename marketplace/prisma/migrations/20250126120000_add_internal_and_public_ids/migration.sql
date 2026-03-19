-- =============================================================================
-- MIGRACIÓN: id (BIGINT) + id_public (UUID)
-- Fase 1: Añadir columnas en todas las tablas. Prisma ejecuta en transacción.
-- =============================================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- -----------------------------------------------------------------------------
-- FASE 1: Añadir id e id_public en todas las tablas
-- -----------------------------------------------------------------------------

-- usuarios
ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS id BIGSERIAL;
ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS id_public UUID;
UPDATE usuarios SET id_public = id_usuario::uuid WHERE id_public IS NULL AND id_usuario IS NOT NULL;
ALTER TABLE usuarios ALTER COLUMN id_public SET NOT NULL;
ALTER TABLE usuarios ADD CONSTRAINT uq_usuarios_id_public UNIQUE (id_public);
CREATE UNIQUE INDEX IF NOT EXISTS uq_usuarios_id ON usuarios(id);

-- roles
ALTER TABLE roles ADD COLUMN IF NOT EXISTS id BIGSERIAL;
ALTER TABLE roles ADD COLUMN IF NOT EXISTS id_public UUID;
UPDATE roles SET id_public = id_rol::uuid WHERE id_public IS NULL AND id_rol IS NOT NULL;
ALTER TABLE roles ALTER COLUMN id_public SET NOT NULL;
ALTER TABLE roles ADD CONSTRAINT uq_roles_id_public UNIQUE (id_public);
CREATE UNIQUE INDEX IF NOT EXISTS uq_roles_id ON roles(id);

-- paises
ALTER TABLE paises ADD COLUMN IF NOT EXISTS id BIGSERIAL;
ALTER TABLE paises ADD COLUMN IF NOT EXISTS id_public UUID;
UPDATE paises SET id_public = id_pais::uuid WHERE id_public IS NULL AND id_pais IS NOT NULL;
ALTER TABLE paises ALTER COLUMN id_public SET NOT NULL;
ALTER TABLE paises ADD CONSTRAINT uq_paises_id_public UNIQUE (id_public);
CREATE UNIQUE INDEX IF NOT EXISTS uq_paises_id ON paises(id);

-- tipo_operacion_inmobiliaria
ALTER TABLE tipo_operacion_inmobiliaria ADD COLUMN IF NOT EXISTS id BIGSERIAL;
ALTER TABLE tipo_operacion_inmobiliaria ADD COLUMN IF NOT EXISTS id_public UUID;
UPDATE tipo_operacion_inmobiliaria SET id_public = id_tipo_operacion_inmobiliaria::uuid WHERE id_public IS NULL AND id_tipo_operacion_inmobiliaria IS NOT NULL;
ALTER TABLE tipo_operacion_inmobiliaria ALTER COLUMN id_public SET NOT NULL;
ALTER TABLE tipo_operacion_inmobiliaria ADD CONSTRAINT uq_tipo_operacion_inmobiliaria_id_public UNIQUE (id_public);
CREATE UNIQUE INDEX IF NOT EXISTS uq_tipo_operacion_inmobiliaria_id ON tipo_operacion_inmobiliaria(id);

-- seo
ALTER TABLE seo ADD COLUMN IF NOT EXISTS id BIGSERIAL;
ALTER TABLE seo ADD COLUMN IF NOT EXISTS id_public UUID;
UPDATE seo SET id_public = id_seo::uuid WHERE id_public IS NULL AND id_seo IS NOT NULL;
ALTER TABLE seo ALTER COLUMN id_public SET NOT NULL;
ALTER TABLE seo ADD CONSTRAINT uq_seo_id_public UNIQUE (id_public);
CREATE UNIQUE INDEX IF NOT EXISTS uq_seo_id ON seo(id);

-- footer
ALTER TABLE footer ADD COLUMN IF NOT EXISTS id BIGSERIAL;
ALTER TABLE footer ADD COLUMN IF NOT EXISTS id_public UUID;
UPDATE footer SET id_public = id_footer::uuid WHERE id_public IS NULL AND id_footer IS NOT NULL;
ALTER TABLE footer ALTER COLUMN id_public SET NOT NULL;
ALTER TABLE footer ADD CONSTRAINT uq_footer_id_public UNIQUE (id_public);
CREATE UNIQUE INDEX IF NOT EXISTS uq_footer_id ON footer(id);

-- categorias_propiedad
ALTER TABLE categorias_propiedad ADD COLUMN IF NOT EXISTS id BIGSERIAL;
ALTER TABLE categorias_propiedad ADD COLUMN IF NOT EXISTS id_public UUID;
UPDATE categorias_propiedad SET id_public = id_categoria::uuid WHERE id_public IS NULL AND id_categoria IS NOT NULL;
ALTER TABLE categorias_propiedad ALTER COLUMN id_public SET NOT NULL;
ALTER TABLE categorias_propiedad ADD CONSTRAINT uq_categorias_propiedad_id_public UNIQUE (id_public);
CREATE UNIQUE INDEX IF NOT EXISTS uq_categorias_propiedad_id ON categorias_propiedad(id);

-- recursos
ALTER TABLE recursos ADD COLUMN IF NOT EXISTS id BIGSERIAL;
ALTER TABLE recursos ADD COLUMN IF NOT EXISTS id_public UUID;
UPDATE recursos SET id_public = id_recurso::uuid WHERE id_public IS NULL AND id_recurso IS NOT NULL;
ALTER TABLE recursos ALTER COLUMN id_public SET NOT NULL;
ALTER TABLE recursos ADD CONSTRAINT uq_recursos_id_public UNIQUE (id_public);
CREATE UNIQUE INDEX IF NOT EXISTS uq_recursos_id ON recursos(id);

-- departamentos
ALTER TABLE departamentos ADD COLUMN IF NOT EXISTS id BIGSERIAL;
ALTER TABLE departamentos ADD COLUMN IF NOT EXISTS id_public UUID;
UPDATE departamentos SET id_public = id_departamento::uuid WHERE id_public IS NULL AND id_departamento IS NOT NULL;
ALTER TABLE departamentos ALTER COLUMN id_public SET NOT NULL;
ALTER TABLE departamentos ADD CONSTRAINT uq_departamentos_id_public UNIQUE (id_public);
CREATE UNIQUE INDEX IF NOT EXISTS uq_departamentos_id ON departamentos(id);

-- ciudades
ALTER TABLE ciudades ADD COLUMN IF NOT EXISTS id BIGSERIAL;
ALTER TABLE ciudades ADD COLUMN IF NOT EXISTS id_public UUID;
UPDATE ciudades SET id_public = id_ciudad::uuid WHERE id_public IS NULL AND id_ciudad IS NOT NULL;
ALTER TABLE ciudades ALTER COLUMN id_public SET NOT NULL;
ALTER TABLE ciudades ADD CONSTRAINT uq_ciudades_id_public UNIQUE (id_public);
CREATE UNIQUE INDEX IF NOT EXISTS uq_ciudades_id ON ciudades(id);

-- zonas
ALTER TABLE zonas ADD COLUMN IF NOT EXISTS id BIGSERIAL;
ALTER TABLE zonas ADD COLUMN IF NOT EXISTS id_public UUID;
UPDATE zonas SET id_public = id_zona::uuid WHERE id_public IS NULL AND id_zona IS NOT NULL;
ALTER TABLE zonas ALTER COLUMN id_public SET NOT NULL;
ALTER TABLE zonas ADD CONSTRAINT uq_zonas_id_public UNIQUE (id_public);
CREATE UNIQUE INDEX IF NOT EXISTS uq_zonas_id ON zonas(id);

-- configuracion_sitio
ALTER TABLE configuracion_sitio ADD COLUMN IF NOT EXISTS id BIGSERIAL;
ALTER TABLE configuracion_sitio ADD COLUMN IF NOT EXISTS id_public UUID;
UPDATE configuracion_sitio SET id_public = id_configuracion::uuid WHERE id_public IS NULL AND id_configuracion IS NOT NULL;
ALTER TABLE configuracion_sitio ALTER COLUMN id_public SET NOT NULL;
ALTER TABLE configuracion_sitio ADD CONSTRAINT uq_configuracion_sitio_id_public UNIQUE (id_public);
CREATE UNIQUE INDEX IF NOT EXISTS uq_configuracion_sitio_id ON configuracion_sitio(id);

-- home_configuracion
ALTER TABLE home_configuracion ADD COLUMN IF NOT EXISTS id BIGSERIAL;
ALTER TABLE home_configuracion ADD COLUMN IF NOT EXISTS id_public UUID;
UPDATE home_configuracion SET id_public = id_home::uuid WHERE id_public IS NULL AND id_home IS NOT NULL;
ALTER TABLE home_configuracion ALTER COLUMN id_public SET NOT NULL;
ALTER TABLE home_configuracion ADD CONSTRAINT uq_home_configuracion_id_public UNIQUE (id_public);
CREATE UNIQUE INDEX IF NOT EXISTS uq_home_configuracion_id ON home_configuracion(id);

-- permisos_especificos_usuario
ALTER TABLE permisos_especificos_usuario ADD COLUMN IF NOT EXISTS id BIGSERIAL;
ALTER TABLE permisos_especificos_usuario ADD COLUMN IF NOT EXISTS id_public UUID;
UPDATE permisos_especificos_usuario SET id_public = id_permiso_usuario::uuid WHERE id_public IS NULL AND id_permiso_usuario IS NOT NULL;
ALTER TABLE permisos_especificos_usuario ALTER COLUMN id_public SET NOT NULL;
ALTER TABLE permisos_especificos_usuario ADD CONSTRAINT uq_permisos_especificos_usuario_id_public UNIQUE (id_public);
CREATE UNIQUE INDEX IF NOT EXISTS uq_permisos_especificos_usuario_id ON permisos_especificos_usuario(id);

-- vendedores
ALTER TABLE vendedores ADD COLUMN IF NOT EXISTS id BIGSERIAL;
ALTER TABLE vendedores ADD COLUMN IF NOT EXISTS id_public UUID;
UPDATE vendedores SET id_public = id_vendedor::uuid WHERE id_public IS NULL AND id_vendedor IS NOT NULL;
ALTER TABLE vendedores ALTER COLUMN id_public SET NOT NULL;
ALTER TABLE vendedores ADD CONSTRAINT uq_vendedores_id_public UNIQUE (id_public);
CREATE UNIQUE INDEX IF NOT EXISTS uq_vendedores_id ON vendedores(id);

-- propiedades
ALTER TABLE propiedades ADD COLUMN IF NOT EXISTS id BIGSERIAL;
ALTER TABLE propiedades ADD COLUMN IF NOT EXISTS id_public UUID;
UPDATE propiedades SET id_public = id_propiedad::uuid WHERE id_public IS NULL AND id_propiedad IS NOT NULL;
ALTER TABLE propiedades ALTER COLUMN id_public SET NOT NULL;
ALTER TABLE propiedades ADD CONSTRAINT uq_propiedades_id_public UNIQUE (id_public);
CREATE UNIQUE INDEX IF NOT EXISTS uq_propiedades_id ON propiedades(id);

-- caracteristicas_pagina_principal
ALTER TABLE caracteristicas_pagina_principal ADD COLUMN IF NOT EXISTS id BIGSERIAL;
ALTER TABLE caracteristicas_pagina_principal ADD COLUMN IF NOT EXISTS id_public UUID;
UPDATE caracteristicas_pagina_principal SET id_public = id_caracteristica::uuid WHERE id_public IS NULL AND id_caracteristica IS NOT NULL;
ALTER TABLE caracteristicas_pagina_principal ALTER COLUMN id_public SET NOT NULL;
ALTER TABLE caracteristicas_pagina_principal ADD CONSTRAINT uq_caracteristicas_pagina_principal_id_public UNIQUE (id_public);
CREATE UNIQUE INDEX IF NOT EXISTS uq_caracteristicas_pagina_principal_id ON caracteristicas_pagina_principal(id);

-- precios_propiedad (no tiene UUID propio; usar gen_random_uuid)
ALTER TABLE precios_propiedad ADD COLUMN IF NOT EXISTS id BIGSERIAL;
ALTER TABLE precios_propiedad ADD COLUMN IF NOT EXISTS id_public UUID;
UPDATE precios_propiedad SET id_public = gen_random_uuid() WHERE id_public IS NULL;
ALTER TABLE precios_propiedad ALTER COLUMN id_public SET NOT NULL;
ALTER TABLE precios_propiedad ADD CONSTRAINT uq_precios_propiedad_id_public UNIQUE (id_public);
CREATE UNIQUE INDEX IF NOT EXISTS uq_precios_propiedad_id ON precios_propiedad(id);

-- imagenes_propiedad
ALTER TABLE imagenes_propiedad ADD COLUMN IF NOT EXISTS id BIGSERIAL;
ALTER TABLE imagenes_propiedad ADD COLUMN IF NOT EXISTS id_public UUID;
UPDATE imagenes_propiedad SET id_public = id_imagen::uuid WHERE id_public IS NULL AND id_imagen IS NOT NULL;
ALTER TABLE imagenes_propiedad ALTER COLUMN id_public SET NOT NULL;
ALTER TABLE imagenes_propiedad ADD CONSTRAINT uq_imagenes_propiedad_id_public UNIQUE (id_public);
CREATE UNIQUE INDEX IF NOT EXISTS uq_imagenes_propiedad_id ON imagenes_propiedad(id);

-- solicitudes_contacto
ALTER TABLE solicitudes_contacto ADD COLUMN IF NOT EXISTS id BIGSERIAL;
ALTER TABLE solicitudes_contacto ADD COLUMN IF NOT EXISTS id_public UUID;
UPDATE solicitudes_contacto SET id_public = id_solicitud::uuid WHERE id_public IS NULL AND id_solicitud IS NOT NULL;
ALTER TABLE solicitudes_contacto ALTER COLUMN id_public SET NOT NULL;
ALTER TABLE solicitudes_contacto ADD CONSTRAINT uq_solicitudes_contacto_id_public UNIQUE (id_public);
CREATE UNIQUE INDEX IF NOT EXISTS uq_solicitudes_contacto_id ON solicitudes_contacto(id);

-- usuario_roles (PK compuesta)
ALTER TABLE usuario_roles ADD COLUMN IF NOT EXISTS id BIGSERIAL;
ALTER TABLE usuario_roles ADD COLUMN IF NOT EXISTS id_public UUID;
UPDATE usuario_roles SET id_public = gen_random_uuid() WHERE id_public IS NULL;
ALTER TABLE usuario_roles ALTER COLUMN id_public SET NOT NULL;
ALTER TABLE usuario_roles ADD CONSTRAINT uq_usuario_roles_id_public UNIQUE (id_public);
CREATE UNIQUE INDEX IF NOT EXISTS uq_usuario_roles_id ON usuario_roles(id);

-- favoritos (PK compuesta)
ALTER TABLE favoritos ADD COLUMN IF NOT EXISTS id BIGSERIAL;
ALTER TABLE favoritos ADD COLUMN IF NOT EXISTS id_public UUID;
UPDATE favoritos SET id_public = gen_random_uuid() WHERE id_public IS NULL;
ALTER TABLE favoritos ALTER COLUMN id_public SET NOT NULL;
ALTER TABLE favoritos ADD CONSTRAINT uq_favoritos_id_public UNIQUE (id_public);
CREATE UNIQUE INDEX IF NOT EXISTS uq_favoritos_id ON favoritos(id);
