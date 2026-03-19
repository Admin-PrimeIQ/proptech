-- =============================================================================
-- Hacer que "id" sea la PK en todas las tablas.
-- 1) Migrar FKs a id (BIGINT). 2) Reemplazar PKs por PRIMARY KEY (id).
-- =============================================================================

-- -----------------------------------------------------------------------------
-- FASE 1: Migrar FKs a id (orden: hijos primero)
-- -----------------------------------------------------------------------------

-- 1) usuario_roles: id_usuario -> usuarios.id, id_rol -> roles.id (PK compuesta)
ALTER TABLE usuario_roles ADD COLUMN IF NOT EXISTS id_usuario_new BIGINT;
ALTER TABLE usuario_roles ADD COLUMN IF NOT EXISTS id_rol_new BIGINT;
UPDATE usuario_roles ur SET id_usuario_new = u.id FROM usuarios u WHERE u.id_public::text = ur.id_usuario::text;
UPDATE usuario_roles ur SET id_rol_new = r.id FROM roles r WHERE r.id_public::text = ur.id_rol::text;
ALTER TABLE usuario_roles DROP CONSTRAINT IF EXISTS usuario_roles_id_usuario_fkey;
ALTER TABLE usuario_roles DROP CONSTRAINT IF EXISTS usuario_roles_id_rol_fkey;
ALTER TABLE usuario_roles DROP CONSTRAINT IF EXISTS usuario_roles_pkey;
ALTER TABLE usuario_roles RENAME COLUMN id_usuario TO id_usuario_legacy;
ALTER TABLE usuario_roles RENAME COLUMN id_rol TO id_rol_legacy;
ALTER TABLE usuario_roles RENAME COLUMN id_usuario_new TO id_usuario;
ALTER TABLE usuario_roles RENAME COLUMN id_rol_new TO id_rol;
ALTER TABLE usuario_roles ALTER COLUMN id_usuario SET NOT NULL;
ALTER TABLE usuario_roles ALTER COLUMN id_rol SET NOT NULL;
ALTER TABLE usuario_roles ADD CONSTRAINT usuario_roles_id_usuario_fkey FOREIGN KEY (id_usuario) REFERENCES usuarios(id) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE usuario_roles ADD CONSTRAINT usuario_roles_id_rol_fkey FOREIGN KEY (id_rol) REFERENCES roles(id) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE usuario_roles ADD CONSTRAINT usuario_roles_usuario_rol_unique UNIQUE (id_usuario, id_rol);

-- 2) permisos_especificos_usuario: id_usuario -> usuarios.id
ALTER TABLE permisos_especificos_usuario ADD COLUMN IF NOT EXISTS id_usuario_new BIGINT;
UPDATE permisos_especificos_usuario p SET id_usuario_new = u.id FROM usuarios u WHERE u.id_public::text = p.id_usuario::text;
ALTER TABLE permisos_especificos_usuario DROP CONSTRAINT IF EXISTS permisos_especificos_usuario_id_usuario_fkey;
ALTER TABLE permisos_especificos_usuario DROP CONSTRAINT IF EXISTS permisos_especificos_usuario_id_usuario_key;
ALTER TABLE permisos_especificos_usuario RENAME COLUMN id_usuario TO id_usuario_legacy;
ALTER TABLE permisos_especificos_usuario RENAME COLUMN id_usuario_new TO id_usuario;
ALTER TABLE permisos_especificos_usuario ALTER COLUMN id_usuario SET NOT NULL;
ALTER TABLE permisos_especificos_usuario ADD CONSTRAINT permisos_especificos_usuario_id_usuario_fkey FOREIGN KEY (id_usuario) REFERENCES usuarios(id) ON DELETE CASCADE ON UPDATE CASCADE;
CREATE UNIQUE INDEX IF NOT EXISTS permisos_especificos_usuario_id_usuario_key ON permisos_especificos_usuario(id_usuario);

-- 3) recursos: creado_por -> usuarios.id
ALTER TABLE recursos ADD COLUMN IF NOT EXISTS id_usuario_new BIGINT;
UPDATE recursos r SET id_usuario_new = u.id FROM usuarios u WHERE u.id_public::text = r.creado_por::text;
ALTER TABLE recursos DROP CONSTRAINT IF EXISTS recursos_creado_por_fkey;
ALTER TABLE recursos RENAME COLUMN creado_por TO creado_por_legacy;
ALTER TABLE recursos RENAME COLUMN id_usuario_new TO creado_por;
ALTER TABLE recursos ALTER COLUMN creado_por SET NOT NULL;
ALTER TABLE recursos ADD CONSTRAINT recursos_creado_por_fkey FOREIGN KEY (creado_por) REFERENCES usuarios(id) ON DELETE RESTRICT ON UPDATE CASCADE;

-- 4) departamentos: id_pais -> paises.id
ALTER TABLE departamentos ADD COLUMN IF NOT EXISTS id_pais_new BIGINT;
UPDATE departamentos d SET id_pais_new = p.id FROM paises p WHERE p.id_public::text = d.id_pais::text;
ALTER TABLE departamentos DROP CONSTRAINT IF EXISTS departamentos_id_pais_fkey;
ALTER TABLE departamentos RENAME COLUMN id_pais TO id_pais_legacy;
ALTER TABLE departamentos RENAME COLUMN id_pais_new TO id_pais;
ALTER TABLE departamentos ALTER COLUMN id_pais SET NOT NULL;
ALTER TABLE departamentos ADD CONSTRAINT departamentos_id_pais_fkey FOREIGN KEY (id_pais) REFERENCES paises(id) ON DELETE CASCADE ON UPDATE CASCADE;

-- 5) configuracion_sitio: id_logo_recurso -> recursos.id (nullable)
ALTER TABLE configuracion_sitio ADD COLUMN IF NOT EXISTS id_logo_recurso_new BIGINT;
UPDATE configuracion_sitio c SET id_logo_recurso_new = r.id FROM recursos r WHERE r.id_public::text = c.id_logo_recurso::text AND c.id_logo_recurso IS NOT NULL;
ALTER TABLE configuracion_sitio DROP CONSTRAINT IF EXISTS configuracion_sitio_id_logo_recurso_fkey;
ALTER TABLE configuracion_sitio RENAME COLUMN id_logo_recurso TO id_logo_recurso_legacy;
ALTER TABLE configuracion_sitio RENAME COLUMN id_logo_recurso_new TO id_logo_recurso;
ALTER TABLE configuracion_sitio ADD CONSTRAINT configuracion_sitio_id_logo_recurso_fkey FOREIGN KEY (id_logo_recurso) REFERENCES recursos(id) ON DELETE SET NULL ON UPDATE CASCADE;

-- 6) home_configuracion: id_imagen_hero -> recursos.id (nullable)
ALTER TABLE home_configuracion ADD COLUMN IF NOT EXISTS id_imagen_hero_new BIGINT;
UPDATE home_configuracion h SET id_imagen_hero_new = r.id FROM recursos r WHERE r.id_public::text = h.id_imagen_hero::text AND h.id_imagen_hero IS NOT NULL;
ALTER TABLE home_configuracion DROP CONSTRAINT IF EXISTS home_configuracion_id_imagen_hero_fkey;
ALTER TABLE home_configuracion RENAME COLUMN id_imagen_hero TO id_imagen_hero_legacy;
ALTER TABLE home_configuracion RENAME COLUMN id_imagen_hero_new TO id_imagen_hero;
ALTER TABLE home_configuracion ADD CONSTRAINT home_configuracion_id_imagen_hero_fkey FOREIGN KEY (id_imagen_hero) REFERENCES recursos(id) ON DELETE SET NULL ON UPDATE CASCADE;

-- 7) ciudades: id_departamento -> departamentos.id
ALTER TABLE ciudades ADD COLUMN IF NOT EXISTS id_departamento_new BIGINT;
UPDATE ciudades c SET id_departamento_new = d.id FROM departamentos d WHERE d.id_public::text = c.id_departamento::text;
ALTER TABLE ciudades DROP CONSTRAINT IF EXISTS ciudades_id_departamento_fkey;
ALTER TABLE ciudades RENAME COLUMN id_departamento TO id_departamento_legacy;
ALTER TABLE ciudades RENAME COLUMN id_departamento_new TO id_departamento;
ALTER TABLE ciudades ALTER COLUMN id_departamento SET NOT NULL;
ALTER TABLE ciudades ADD CONSTRAINT ciudades_id_departamento_fkey FOREIGN KEY (id_departamento) REFERENCES departamentos(id) ON DELETE CASCADE ON UPDATE CASCADE;

-- 8) zonas: id_ciudad -> ciudades.id
ALTER TABLE zonas ADD COLUMN IF NOT EXISTS id_ciudad_new BIGINT;
UPDATE zonas z SET id_ciudad_new = c.id FROM ciudades c WHERE c.id_public::text = z.id_ciudad::text;
ALTER TABLE zonas DROP CONSTRAINT IF EXISTS zonas_id_ciudad_fkey;
ALTER TABLE zonas RENAME COLUMN id_ciudad TO id_ciudad_legacy;
ALTER TABLE zonas RENAME COLUMN id_ciudad_new TO id_ciudad;
ALTER TABLE zonas ALTER COLUMN id_ciudad SET NOT NULL;
ALTER TABLE zonas ADD CONSTRAINT zonas_id_ciudad_fkey FOREIGN KEY (id_ciudad) REFERENCES ciudades(id) ON DELETE CASCADE ON UPDATE CASCADE;

-- 9) vendedores: id_usuario -> usuarios.id, id_foto_recurso -> recursos.id (nullable)
ALTER TABLE vendedores ADD COLUMN IF NOT EXISTS id_usuario_new BIGINT;
ALTER TABLE vendedores ADD COLUMN IF NOT EXISTS id_foto_recurso_new BIGINT;
UPDATE vendedores v SET id_usuario_new = u.id FROM usuarios u WHERE u.id_public::text = v.id_usuario::text;
UPDATE vendedores v SET id_foto_recurso_new = r.id FROM recursos r WHERE r.id_public::text = v.id_foto_recurso::text AND v.id_foto_recurso IS NOT NULL;
ALTER TABLE vendedores DROP CONSTRAINT IF EXISTS vendedores_id_usuario_fkey;
ALTER TABLE vendedores DROP CONSTRAINT IF EXISTS vendedores_id_foto_recurso_fkey;
ALTER TABLE vendedores DROP CONSTRAINT IF EXISTS vendedores_id_usuario_key;
ALTER TABLE vendedores RENAME COLUMN id_usuario TO id_usuario_legacy;
ALTER TABLE vendedores RENAME COLUMN id_foto_recurso TO id_foto_recurso_legacy;
ALTER TABLE vendedores RENAME COLUMN id_usuario_new TO id_usuario;
ALTER TABLE vendedores RENAME COLUMN id_foto_recurso_new TO id_foto_recurso;
ALTER TABLE vendedores ALTER COLUMN id_usuario SET NOT NULL;
ALTER TABLE vendedores ADD CONSTRAINT vendedores_id_usuario_fkey FOREIGN KEY (id_usuario) REFERENCES usuarios(id) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE vendedores ADD CONSTRAINT vendedores_id_foto_recurso_fkey FOREIGN KEY (id_foto_recurso) REFERENCES recursos(id) ON DELETE SET NULL ON UPDATE CASCADE;
CREATE UNIQUE INDEX IF NOT EXISTS vendedores_id_usuario_key ON vendedores(id_usuario);

-- 10) caracteristicas_pagina_principal: id_banner->recursos, id_footer->footer, id_seo->seo, actualizado_por->usuarios
ALTER TABLE caracteristicas_pagina_principal ADD COLUMN IF NOT EXISTS id_banner_new BIGINT;
ALTER TABLE caracteristicas_pagina_principal ADD COLUMN IF NOT EXISTS id_footer_new BIGINT;
ALTER TABLE caracteristicas_pagina_principal ADD COLUMN IF NOT EXISTS id_seo_new BIGINT;
ALTER TABLE caracteristicas_pagina_principal ADD COLUMN IF NOT EXISTS actualizado_por_new BIGINT;
UPDATE caracteristicas_pagina_principal c SET id_banner_new = r.id FROM recursos r WHERE r.id_public::text = c.id_banner::text AND c.id_banner IS NOT NULL;
UPDATE caracteristicas_pagina_principal c SET id_footer_new = f.id FROM footer f WHERE f.id_public::text = c.id_footer::text AND c.id_footer IS NOT NULL;
UPDATE caracteristicas_pagina_principal c SET id_seo_new = s.id FROM seo s WHERE s.id_public::text = c.id_seo::text AND c.id_seo IS NOT NULL;
UPDATE caracteristicas_pagina_principal c SET actualizado_por_new = u.id FROM usuarios u WHERE u.id_public::text = c.actualizado_por::text;
ALTER TABLE caracteristicas_pagina_principal DROP CONSTRAINT IF EXISTS caracteristicas_pagina_principal_id_banner_fkey;
ALTER TABLE caracteristicas_pagina_principal DROP CONSTRAINT IF EXISTS caracteristicas_pagina_principal_id_footer_fkey;
ALTER TABLE caracteristicas_pagina_principal DROP CONSTRAINT IF EXISTS caracteristicas_pagina_principal_id_seo_fkey;
ALTER TABLE caracteristicas_pagina_principal DROP CONSTRAINT IF EXISTS caracteristicas_pagina_principal_actualizado_por_fkey;
ALTER TABLE caracteristicas_pagina_principal RENAME COLUMN id_banner TO id_banner_legacy;
ALTER TABLE caracteristicas_pagina_principal RENAME COLUMN id_footer TO id_footer_legacy;
ALTER TABLE caracteristicas_pagina_principal RENAME COLUMN id_seo TO id_seo_legacy;
ALTER TABLE caracteristicas_pagina_principal RENAME COLUMN actualizado_por TO actualizado_por_legacy;
ALTER TABLE caracteristicas_pagina_principal RENAME COLUMN id_banner_new TO id_banner;
ALTER TABLE caracteristicas_pagina_principal RENAME COLUMN id_footer_new TO id_footer;
ALTER TABLE caracteristicas_pagina_principal RENAME COLUMN id_seo_new TO id_seo;
ALTER TABLE caracteristicas_pagina_principal RENAME COLUMN actualizado_por_new TO actualizado_por;
ALTER TABLE caracteristicas_pagina_principal ALTER COLUMN actualizado_por SET NOT NULL;
ALTER TABLE caracteristicas_pagina_principal ADD CONSTRAINT caracteristicas_pagina_principal_id_banner_fkey FOREIGN KEY (id_banner) REFERENCES recursos(id) ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE caracteristicas_pagina_principal ADD CONSTRAINT caracteristicas_pagina_principal_id_footer_fkey FOREIGN KEY (id_footer) REFERENCES footer(id) ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE caracteristicas_pagina_principal ADD CONSTRAINT caracteristicas_pagina_principal_id_seo_fkey FOREIGN KEY (id_seo) REFERENCES seo(id) ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE caracteristicas_pagina_principal ADD CONSTRAINT caracteristicas_pagina_principal_actualizado_por_fkey FOREIGN KEY (actualizado_por) REFERENCES usuarios(id) ON DELETE RESTRICT ON UPDATE CASCADE;

-- 11) propiedades: id_categoria, id_tipo_operacion_inmobiliaria, id_zona, id_vendedor, creado_por
ALTER TABLE propiedades ADD COLUMN IF NOT EXISTS id_categoria_new BIGINT;
ALTER TABLE propiedades ADD COLUMN IF NOT EXISTS id_tipo_operacion_inmobiliaria_new BIGINT;
ALTER TABLE propiedades ADD COLUMN IF NOT EXISTS id_zona_new BIGINT;
ALTER TABLE propiedades ADD COLUMN IF NOT EXISTS id_vendedor_new BIGINT;
ALTER TABLE propiedades ADD COLUMN IF NOT EXISTS creado_por_new BIGINT;
UPDATE propiedades p SET id_categoria_new = c.id FROM categorias_propiedad c WHERE c.id_public::text = p.id_categoria::text;
UPDATE propiedades p SET id_tipo_operacion_inmobiliaria_new = t.id FROM tipo_operacion_inmobiliaria t WHERE t.id_public::text = p.id_tipo_operacion_inmobiliaria::text;
UPDATE propiedades p SET id_zona_new = z.id FROM zonas z WHERE z.id_public::text = p.id_zona::text AND p.id_zona IS NOT NULL;
UPDATE propiedades p SET id_vendedor_new = v.id FROM vendedores v WHERE v.id_public::text = p.id_vendedor::text AND p.id_vendedor IS NOT NULL;
UPDATE propiedades p SET creado_por_new = u.id FROM usuarios u WHERE u.id_public::text = p.creado_por::text;
ALTER TABLE propiedades DROP CONSTRAINT IF EXISTS propiedades_id_categoria_fkey;
ALTER TABLE propiedades DROP CONSTRAINT IF EXISTS propiedades_id_tipo_operacion_inmobiliaria_fkey;
ALTER TABLE propiedades DROP CONSTRAINT IF EXISTS propiedades_id_zona_fkey;
ALTER TABLE propiedades DROP CONSTRAINT IF EXISTS propiedades_id_vendedor_fkey;
ALTER TABLE propiedades DROP CONSTRAINT IF EXISTS propiedades_creado_por_fkey;
ALTER TABLE propiedades RENAME COLUMN id_categoria TO id_categoria_legacy;
ALTER TABLE propiedades RENAME COLUMN id_tipo_operacion_inmobiliaria TO id_tipo_operacion_inmobiliaria_legacy;
ALTER TABLE propiedades RENAME COLUMN id_zona TO id_zona_legacy;
ALTER TABLE propiedades RENAME COLUMN id_vendedor TO id_vendedor_legacy;
ALTER TABLE propiedades RENAME COLUMN creado_por TO creado_por_legacy;
ALTER TABLE propiedades RENAME COLUMN id_categoria_new TO id_categoria;
ALTER TABLE propiedades RENAME COLUMN id_tipo_operacion_inmobiliaria_new TO id_tipo_operacion_inmobiliaria;
ALTER TABLE propiedades RENAME COLUMN id_zona_new TO id_zona;
ALTER TABLE propiedades RENAME COLUMN id_vendedor_new TO id_vendedor;
ALTER TABLE propiedades RENAME COLUMN creado_por_new TO creado_por;
ALTER TABLE propiedades ALTER COLUMN id_categoria SET NOT NULL;
ALTER TABLE propiedades ALTER COLUMN id_tipo_operacion_inmobiliaria SET NOT NULL;
ALTER TABLE propiedades ALTER COLUMN creado_por SET NOT NULL;
ALTER TABLE propiedades ADD CONSTRAINT propiedades_id_categoria_fkey FOREIGN KEY (id_categoria) REFERENCES categorias_propiedad(id) ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE propiedades ADD CONSTRAINT propiedades_id_tipo_operacion_inmobiliaria_fkey FOREIGN KEY (id_tipo_operacion_inmobiliaria) REFERENCES tipo_operacion_inmobiliaria(id) ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE propiedades ADD CONSTRAINT propiedades_id_zona_fkey FOREIGN KEY (id_zona) REFERENCES zonas(id) ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE propiedades ADD CONSTRAINT propiedades_id_vendedor_fkey FOREIGN KEY (id_vendedor) REFERENCES vendedores(id) ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE propiedades ADD CONSTRAINT propiedades_creado_por_fkey FOREIGN KEY (creado_por) REFERENCES usuarios(id) ON DELETE RESTRICT ON UPDATE CASCADE;

-- 12) precios_propiedad: id_propiedad -> propiedades.id (PK = id_propiedad)
ALTER TABLE precios_propiedad ADD COLUMN IF NOT EXISTS id_propiedad_new BIGINT;
UPDATE precios_propiedad pp SET id_propiedad_new = p.id FROM propiedades p WHERE p.id_public::text = pp.id_propiedad::text;
ALTER TABLE precios_propiedad DROP CONSTRAINT IF EXISTS precios_propiedad_id_propiedad_fkey;
ALTER TABLE precios_propiedad DROP CONSTRAINT IF EXISTS precios_propiedad_pkey;
ALTER TABLE precios_propiedad RENAME COLUMN id_propiedad TO id_propiedad_legacy;
ALTER TABLE precios_propiedad RENAME COLUMN id_propiedad_new TO id_propiedad;
ALTER TABLE precios_propiedad ALTER COLUMN id_propiedad SET NOT NULL;
ALTER TABLE precios_propiedad ADD CONSTRAINT precios_propiedad_id_propiedad_fkey FOREIGN KEY (id_propiedad) REFERENCES propiedades(id) ON DELETE CASCADE ON UPDATE CASCADE;

-- 13) imagenes_propiedad: id_propiedad -> propiedades.id, id_recurso -> recursos.id
ALTER TABLE imagenes_propiedad ADD COLUMN IF NOT EXISTS id_propiedad_new BIGINT;
ALTER TABLE imagenes_propiedad ADD COLUMN IF NOT EXISTS id_recurso_new BIGINT;
UPDATE imagenes_propiedad i SET id_propiedad_new = p.id FROM propiedades p WHERE p.id_public::text = i.id_propiedad::text;
UPDATE imagenes_propiedad i SET id_recurso_new = r.id FROM recursos r WHERE r.id_public::text = i.id_recurso::text;
ALTER TABLE imagenes_propiedad DROP CONSTRAINT IF EXISTS imagenes_propiedad_id_propiedad_fkey;
ALTER TABLE imagenes_propiedad DROP CONSTRAINT IF EXISTS imagenes_propiedad_id_recurso_fkey;
ALTER TABLE imagenes_propiedad RENAME COLUMN id_propiedad TO id_propiedad_legacy;
ALTER TABLE imagenes_propiedad RENAME COLUMN id_recurso TO id_recurso_legacy;
ALTER TABLE imagenes_propiedad RENAME COLUMN id_propiedad_new TO id_propiedad;
ALTER TABLE imagenes_propiedad RENAME COLUMN id_recurso_new TO id_recurso;
ALTER TABLE imagenes_propiedad ALTER COLUMN id_propiedad SET NOT NULL;
ALTER TABLE imagenes_propiedad ALTER COLUMN id_recurso SET NOT NULL;
ALTER TABLE imagenes_propiedad ADD CONSTRAINT imagenes_propiedad_id_propiedad_fkey FOREIGN KEY (id_propiedad) REFERENCES propiedades(id) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE imagenes_propiedad ADD CONSTRAINT imagenes_propiedad_id_recurso_fkey FOREIGN KEY (id_recurso) REFERENCES recursos(id) ON DELETE CASCADE ON UPDATE CASCADE;

-- 14) solicitudes_contacto: id_propiedad -> propiedades.id, id_usuario -> usuarios.id (nullable)
ALTER TABLE solicitudes_contacto ADD COLUMN IF NOT EXISTS id_propiedad_new BIGINT;
ALTER TABLE solicitudes_contacto ADD COLUMN IF NOT EXISTS id_usuario_new BIGINT;
UPDATE solicitudes_contacto s SET id_propiedad_new = p.id FROM propiedades p WHERE p.id_public::text = s.id_propiedad::text;
UPDATE solicitudes_contacto s SET id_usuario_new = u.id FROM usuarios u WHERE u.id_public::text = s.id_usuario::text AND s.id_usuario IS NOT NULL;
ALTER TABLE solicitudes_contacto DROP CONSTRAINT IF EXISTS solicitudes_contacto_id_propiedad_fkey;
ALTER TABLE solicitudes_contacto DROP CONSTRAINT IF EXISTS solicitudes_contacto_id_usuario_fkey;
ALTER TABLE solicitudes_contacto RENAME COLUMN id_propiedad TO id_propiedad_legacy;
ALTER TABLE solicitudes_contacto RENAME COLUMN id_usuario TO id_usuario_legacy;
ALTER TABLE solicitudes_contacto RENAME COLUMN id_propiedad_new TO id_propiedad;
ALTER TABLE solicitudes_contacto RENAME COLUMN id_usuario_new TO id_usuario;
ALTER TABLE solicitudes_contacto ALTER COLUMN id_propiedad SET NOT NULL;
ALTER TABLE solicitudes_contacto ADD CONSTRAINT solicitudes_contacto_id_propiedad_fkey FOREIGN KEY (id_propiedad) REFERENCES propiedades(id) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE solicitudes_contacto ADD CONSTRAINT solicitudes_contacto_id_usuario_fkey FOREIGN KEY (id_usuario) REFERENCES usuarios(id) ON DELETE SET NULL ON UPDATE CASCADE;

-- 15) favoritos: id_usuario -> usuarios.id, id_propiedad -> propiedades.id (PK compuesta)
ALTER TABLE favoritos ADD COLUMN IF NOT EXISTS id_usuario_new BIGINT;
ALTER TABLE favoritos ADD COLUMN IF NOT EXISTS id_propiedad_new BIGINT;
UPDATE favoritos f SET id_usuario_new = u.id FROM usuarios u WHERE u.id_public::text = f.id_usuario::text;
UPDATE favoritos f SET id_propiedad_new = p.id FROM propiedades p WHERE p.id_public::text = f.id_propiedad::text;
ALTER TABLE favoritos DROP CONSTRAINT IF EXISTS favoritos_id_usuario_fkey;
ALTER TABLE favoritos DROP CONSTRAINT IF EXISTS favoritos_id_propiedad_fkey;
ALTER TABLE favoritos DROP CONSTRAINT IF EXISTS favoritos_pkey;
ALTER TABLE favoritos RENAME COLUMN id_usuario TO id_usuario_legacy;
ALTER TABLE favoritos RENAME COLUMN id_propiedad TO id_propiedad_legacy;
ALTER TABLE favoritos RENAME COLUMN id_usuario_new TO id_usuario;
ALTER TABLE favoritos RENAME COLUMN id_propiedad_new TO id_propiedad;
ALTER TABLE favoritos ALTER COLUMN id_usuario SET NOT NULL;
ALTER TABLE favoritos ALTER COLUMN id_propiedad SET NOT NULL;
ALTER TABLE favoritos ADD CONSTRAINT favoritos_id_usuario_fkey FOREIGN KEY (id_usuario) REFERENCES usuarios(id) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE favoritos ADD CONSTRAINT favoritos_id_propiedad_fkey FOREIGN KEY (id_propiedad) REFERENCES propiedades(id) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE favoritos ADD CONSTRAINT favoritos_usuario_propiedad_unique UNIQUE (id_usuario, id_propiedad);

-- -----------------------------------------------------------------------------
-- FASE 2: Hacer id la PK en cada tabla (drop old PK, add PK(id))
-- No eliminamos uq_*_id: las FKs creadas en Fase 1 dependen de ellos.
-- Al añadir PK(id) se crea otro índice único; dejar uq_*_id es redundante pero válido.
-- -----------------------------------------------------------------------------

-- precios_propiedad: PK es id_propiedad; debemos usar id como PK. Añadimos PK(id) y UNIQUE(id_propiedad).
ALTER TABLE precios_propiedad ADD CONSTRAINT precios_propiedad_id_propiedad_key UNIQUE (id_propiedad);

-- Drop old PKs and add PK(id). Orden: tablas sin FKs entrantes primero (ya migradas).
ALTER TABLE usuarios DROP CONSTRAINT IF EXISTS usuarios_pkey;
ALTER TABLE usuarios ADD PRIMARY KEY (id);

ALTER TABLE roles DROP CONSTRAINT IF EXISTS roles_pkey;
ALTER TABLE roles ADD PRIMARY KEY (id);

ALTER TABLE paises DROP CONSTRAINT IF EXISTS paises_pkey;
ALTER TABLE paises ADD PRIMARY KEY (id);

ALTER TABLE tipo_operacion_inmobiliaria DROP CONSTRAINT IF EXISTS tipo_operacion_inmobiliaria_pkey;
ALTER TABLE tipo_operacion_inmobiliaria ADD PRIMARY KEY (id);

ALTER TABLE seo DROP CONSTRAINT IF EXISTS seo_pkey;
ALTER TABLE seo ADD PRIMARY KEY (id);

ALTER TABLE footer DROP CONSTRAINT IF EXISTS footer_pkey;
ALTER TABLE footer ADD PRIMARY KEY (id);

ALTER TABLE categorias_propiedad DROP CONSTRAINT IF EXISTS categorias_propiedad_pkey;
ALTER TABLE categorias_propiedad ADD PRIMARY KEY (id);

ALTER TABLE recursos DROP CONSTRAINT IF EXISTS recursos_pkey;
ALTER TABLE recursos ADD PRIMARY KEY (id);

ALTER TABLE departamentos DROP CONSTRAINT IF EXISTS departamentos_pkey;
ALTER TABLE departamentos ADD PRIMARY KEY (id);

ALTER TABLE configuracion_sitio DROP CONSTRAINT IF EXISTS configuracion_sitio_pkey;
ALTER TABLE configuracion_sitio ADD PRIMARY KEY (id);

ALTER TABLE home_configuracion DROP CONSTRAINT IF EXISTS home_configuracion_pkey;
ALTER TABLE home_configuracion ADD PRIMARY KEY (id);

ALTER TABLE permisos_especificos_usuario DROP CONSTRAINT IF EXISTS permisos_especificos_usuario_pkey;
ALTER TABLE permisos_especificos_usuario ADD PRIMARY KEY (id);

ALTER TABLE ciudades DROP CONSTRAINT IF EXISTS ciudades_pkey;
ALTER TABLE ciudades ADD PRIMARY KEY (id);

ALTER TABLE zonas DROP CONSTRAINT IF EXISTS zonas_pkey;
ALTER TABLE zonas ADD PRIMARY KEY (id);

ALTER TABLE usuario_roles DROP CONSTRAINT IF EXISTS usuario_roles_pkey;
ALTER TABLE usuario_roles ADD PRIMARY KEY (id);

ALTER TABLE vendedores DROP CONSTRAINT IF EXISTS vendedores_pkey;
ALTER TABLE vendedores ADD PRIMARY KEY (id);

ALTER TABLE caracteristicas_pagina_principal DROP CONSTRAINT IF EXISTS caracteristicas_pagina_principal_pkey;
ALTER TABLE caracteristicas_pagina_principal ADD PRIMARY KEY (id);

ALTER TABLE propiedades DROP CONSTRAINT IF EXISTS propiedades_pkey;
ALTER TABLE propiedades ADD PRIMARY KEY (id);

ALTER TABLE precios_propiedad DROP CONSTRAINT IF EXISTS precios_propiedad_pkey;
ALTER TABLE precios_propiedad ADD PRIMARY KEY (id);

ALTER TABLE imagenes_propiedad DROP CONSTRAINT IF EXISTS imagenes_propiedad_pkey;
ALTER TABLE imagenes_propiedad ADD PRIMARY KEY (id);

ALTER TABLE solicitudes_contacto DROP CONSTRAINT IF EXISTS solicitudes_contacto_pkey;
ALTER TABLE solicitudes_contacto ADD PRIMARY KEY (id);

ALTER TABLE favoritos DROP CONSTRAINT IF EXISTS favoritos_pkey;
ALTER TABLE favoritos ADD PRIMARY KEY (id);
