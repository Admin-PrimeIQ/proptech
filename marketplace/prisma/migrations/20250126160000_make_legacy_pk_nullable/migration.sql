-- =============================================================================
-- Hacer nullable las columnas PK legacy (UUID) que ya no usa Prisma.
-- Prisma create() solo envía id, id_public, etc.; sin esto falla NOT NULL.
-- =============================================================================

ALTER TABLE usuarios ALTER COLUMN id_usuario DROP NOT NULL;
ALTER TABLE roles ALTER COLUMN id_rol DROP NOT NULL;
ALTER TABLE paises ALTER COLUMN id_pais DROP NOT NULL;
ALTER TABLE tipo_operacion_inmobiliaria ALTER COLUMN id_tipo_operacion_inmobiliaria DROP NOT NULL;
ALTER TABLE seo ALTER COLUMN id_seo DROP NOT NULL;
ALTER TABLE footer ALTER COLUMN id_footer DROP NOT NULL;
ALTER TABLE categorias_propiedad ALTER COLUMN id_categoria DROP NOT NULL;
ALTER TABLE recursos ALTER COLUMN id_recurso DROP NOT NULL;
ALTER TABLE departamentos ALTER COLUMN id_departamento DROP NOT NULL;
ALTER TABLE configuracion_sitio ALTER COLUMN id_configuracion DROP NOT NULL;
ALTER TABLE home_configuracion ALTER COLUMN id_home DROP NOT NULL;
ALTER TABLE permisos_especificos_usuario ALTER COLUMN id_permiso_usuario DROP NOT NULL;
ALTER TABLE ciudades ALTER COLUMN id_ciudad DROP NOT NULL;
ALTER TABLE zonas ALTER COLUMN id_zona DROP NOT NULL;
ALTER TABLE vendedores ALTER COLUMN id_vendedor DROP NOT NULL;
ALTER TABLE propiedades ALTER COLUMN id_propiedad DROP NOT NULL;
ALTER TABLE caracteristicas_pagina_principal ALTER COLUMN id_caracteristica DROP NOT NULL;
ALTER TABLE imagenes_propiedad ALTER COLUMN id_imagen DROP NOT NULL;
ALTER TABLE solicitudes_contacto ALTER COLUMN id_solicitud DROP NOT NULL;
