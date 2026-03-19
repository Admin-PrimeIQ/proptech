-- =============================================================================
-- Eliminar columnas PK/FK legacy ya no usadas.
-- =============================================================================

ALTER TABLE roles DROP COLUMN IF EXISTS id_rol;
ALTER TABLE usuario_roles DROP COLUMN IF EXISTS id_usuario_legacy;
ALTER TABLE usuario_roles DROP COLUMN IF EXISTS id_rol_legacy;
ALTER TABLE footer DROP COLUMN IF EXISTS id_footer;
ALTER TABLE permisos_especificos_usuario DROP COLUMN IF EXISTS id_permiso_usuario;
ALTER TABLE seo DROP COLUMN IF EXISTS id_seo;
ALTER TABLE usuarios DROP COLUMN IF EXISTS id_usuario;
ALTER TABLE recursos DROP COLUMN IF EXISTS id_recurso;
ALTER TABLE caracteristicas_pagina_principal DROP COLUMN IF EXISTS id_caracteristica;
ALTER TABLE categorias_propiedad DROP COLUMN IF EXISTS id_categoria;
ALTER TABLE tipo_operacion_inmobiliaria DROP COLUMN IF EXISTS id_tipo_operacion_inmobiliaria;
ALTER TABLE configuracion_sitio DROP COLUMN IF EXISTS id_configuracion;
ALTER TABLE home_configuracion DROP COLUMN IF EXISTS id_home;
ALTER TABLE vendedores DROP COLUMN IF EXISTS id_vendedor;
ALTER TABLE zonas DROP COLUMN IF EXISTS id_zona;
ALTER TABLE favoritos DROP COLUMN IF EXISTS id_usuario_legacy;
ALTER TABLE favoritos DROP COLUMN IF EXISTS id_propiedad_legacy;
ALTER TABLE imagenes_propiedad DROP COLUMN IF EXISTS id_imagen;
ALTER TABLE propiedades DROP COLUMN IF EXISTS id_propiedad;
ALTER TABLE precios_propiedad DROP COLUMN IF EXISTS id_propiedad_legacy;
ALTER TABLE solicitudes_contacto DROP COLUMN IF EXISTS id_solicitud;
