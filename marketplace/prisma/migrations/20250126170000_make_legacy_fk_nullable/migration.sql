-- =============================================================================
-- Hacer nullable las columnas *_legacy (FK antigua UUID).
-- Prisma create/insert solo usa id_usuario, id_rol, etc.; sin esto falla NOT NULL.
-- =============================================================================

ALTER TABLE usuario_roles ALTER COLUMN id_usuario_legacy DROP NOT NULL;
ALTER TABLE usuario_roles ALTER COLUMN id_rol_legacy DROP NOT NULL;
ALTER TABLE permisos_especificos_usuario ALTER COLUMN id_usuario_legacy DROP NOT NULL;
ALTER TABLE recursos ALTER COLUMN creado_por_legacy DROP NOT NULL;
ALTER TABLE departamentos ALTER COLUMN id_pais_legacy DROP NOT NULL;
ALTER TABLE configuracion_sitio ALTER COLUMN id_logo_recurso_legacy DROP NOT NULL;
ALTER TABLE home_configuracion ALTER COLUMN id_imagen_hero_legacy DROP NOT NULL;
ALTER TABLE ciudades ALTER COLUMN id_departamento_legacy DROP NOT NULL;
ALTER TABLE zonas ALTER COLUMN id_ciudad_legacy DROP NOT NULL;
ALTER TABLE vendedores ALTER COLUMN id_usuario_legacy DROP NOT NULL;
ALTER TABLE vendedores ALTER COLUMN id_foto_recurso_legacy DROP NOT NULL;
ALTER TABLE caracteristicas_pagina_principal ALTER COLUMN id_banner_legacy DROP NOT NULL;
ALTER TABLE caracteristicas_pagina_principal ALTER COLUMN id_footer_legacy DROP NOT NULL;
ALTER TABLE caracteristicas_pagina_principal ALTER COLUMN id_seo_legacy DROP NOT NULL;
ALTER TABLE caracteristicas_pagina_principal ALTER COLUMN actualizado_por_legacy DROP NOT NULL;
ALTER TABLE propiedades ALTER COLUMN id_categoria_legacy DROP NOT NULL;
ALTER TABLE propiedades ALTER COLUMN id_tipo_operacion_inmobiliaria_legacy DROP NOT NULL;
ALTER TABLE propiedades ALTER COLUMN id_zona_legacy DROP NOT NULL;
ALTER TABLE propiedades ALTER COLUMN id_vendedor_legacy DROP NOT NULL;
ALTER TABLE propiedades ALTER COLUMN creado_por_legacy DROP NOT NULL;
ALTER TABLE precios_propiedad ALTER COLUMN id_propiedad_legacy DROP NOT NULL;
ALTER TABLE imagenes_propiedad ALTER COLUMN id_propiedad_legacy DROP NOT NULL;
ALTER TABLE imagenes_propiedad ALTER COLUMN id_recurso_legacy DROP NOT NULL;
ALTER TABLE solicitudes_contacto ALTER COLUMN id_propiedad_legacy DROP NOT NULL;
ALTER TABLE solicitudes_contacto ALTER COLUMN id_usuario_legacy DROP NOT NULL;
ALTER TABLE favoritos ALTER COLUMN id_usuario_legacy DROP NOT NULL;
ALTER TABLE favoritos ALTER COLUMN id_propiedad_legacy DROP NOT NULL;
