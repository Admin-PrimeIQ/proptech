-- Lifestyle Matcher module in geo_subzonas
-- Compatible with current architecture: Prisma + raw SQL + PostGIS.

CREATE SCHEMA IF NOT EXISTS geo_subzonas;
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- =====================================================
-- proyecto_lifestyle
-- =====================================================
CREATE TABLE IF NOT EXISTS geo_subzonas.proyecto_lifestyle (
  id BIGSERIAL PRIMARY KEY,
  id_public UUID NOT NULL DEFAULT gen_random_uuid(),
  id_usuario BIGINT NOT NULL,
  nombre VARCHAR(160) NOT NULL,
  descripcion TEXT,
  activo BOOLEAN NOT NULL DEFAULT false,
  fecha_creacion TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  fecha_actualizacion TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_proyecto_lifestyle_id_public UNIQUE (id_public),
  CONSTRAINT fk_proyecto_lifestyle_usuario
    FOREIGN KEY (id_usuario) REFERENCES public.usuarios(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_proyecto_lifestyle_id_usuario
  ON geo_subzonas.proyecto_lifestyle(id_usuario);

CREATE INDEX IF NOT EXISTS idx_proyecto_lifestyle_activo
  ON geo_subzonas.proyecto_lifestyle(id_usuario, activo);

-- =====================================================
-- punto_interes
-- =====================================================
CREATE TABLE IF NOT EXISTS geo_subzonas.punto_interes (
  id BIGSERIAL PRIMARY KEY,
  id_public UUID NOT NULL DEFAULT gen_random_uuid(),
  id_proyecto BIGINT NOT NULL,
  categoria VARCHAR(120) NOT NULL,
  nombre VARCHAR(180) NOT NULL,
  prioridad INT NOT NULL,
  latitud NUMERIC(10, 8),
  longitud NUMERIC(11, 8),
  ubicacion GEOMETRY(Point, 4326),
  fecha_creacion TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  fecha_actualizacion TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_punto_interes_id_public UNIQUE (id_public),
  CONSTRAINT uq_punto_interes_proyecto_prioridad UNIQUE (id_proyecto, prioridad),
  CONSTRAINT ck_punto_interes_prioridad CHECK (prioridad > 0),
  CONSTRAINT ck_punto_interes_latitud CHECK (latitud IS NULL OR (latitud >= -90 AND latitud <= 90)),
  CONSTRAINT ck_punto_interes_longitud CHECK (longitud IS NULL OR (longitud >= -180 AND longitud <= 180)),
  CONSTRAINT ck_punto_interes_coord_par
    CHECK (
      (latitud IS NULL AND longitud IS NULL)
      OR (latitud IS NOT NULL AND longitud IS NOT NULL)
    ),
  CONSTRAINT fk_punto_interes_proyecto
    FOREIGN KEY (id_proyecto) REFERENCES geo_subzonas.proyecto_lifestyle(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_punto_interes_id_proyecto
  ON geo_subzonas.punto_interes(id_proyecto);

CREATE INDEX IF NOT EXISTS idx_punto_interes_categoria
  ON geo_subzonas.punto_interes(categoria);

CREATE INDEX IF NOT EXISTS idx_punto_interes_ubicacion_gist
  ON geo_subzonas.punto_interes USING GIST (ubicacion);

-- =====================================================
-- isochrone
-- =====================================================
CREATE TABLE IF NOT EXISTS geo_subzonas.isochrone (
  id BIGSERIAL PRIMARY KEY,
  id_public UUID NOT NULL DEFAULT gen_random_uuid(),
  hash_combinacion VARCHAR(128) NOT NULL,
  tipo_desplazamiento VARCHAR(32) NOT NULL,
  tiempo_maximo INT NOT NULL,
  distancia_maxima NUMERIC(12, 2),
  velocidad NUMERIC(10, 2),
  area_cobertura GEOMETRY(MultiPolygon, 4326) NOT NULL,
  metadatos JSONB,
  fecha_creacion TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  fecha_actualizacion TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_isochrone_id_public UNIQUE (id_public),
  CONSTRAINT uq_isochrone_hash_combinacion UNIQUE (hash_combinacion),
  CONSTRAINT ck_isochrone_tiempo_maximo CHECK (tiempo_maximo > 0),
  CONSTRAINT ck_isochrone_distancia_maxima CHECK (distancia_maxima IS NULL OR distancia_maxima > 0),
  CONSTRAINT ck_isochrone_velocidad CHECK (velocidad IS NULL OR velocidad > 0),
  CONSTRAINT ck_isochrone_tipo_desplazamiento
    CHECK (tipo_desplazamiento IN ('walking', 'driving', 'cycling', 'transit'))
);

CREATE INDEX IF NOT EXISTS idx_isochrone_tipo_desplazamiento
  ON geo_subzonas.isochrone(tipo_desplazamiento);

CREATE INDEX IF NOT EXISTS idx_isochrone_area_gist
  ON geo_subzonas.isochrone USING GIST (area_cobertura);

-- =====================================================
-- proyecto_isochrone
-- =====================================================
CREATE TABLE IF NOT EXISTS geo_subzonas.proyecto_isochrone (
  id BIGSERIAL PRIMARY KEY,
  id_proyecto BIGINT NOT NULL,
  id_isochrone BIGINT NOT NULL,
  es_version_actual BOOLEAN NOT NULL DEFAULT false,
  fecha_asociacion TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_proyecto_isochrone UNIQUE (id_proyecto, id_isochrone),
  CONSTRAINT fk_proyecto_isochrone_proyecto
    FOREIGN KEY (id_proyecto) REFERENCES geo_subzonas.proyecto_lifestyle(id) ON DELETE CASCADE,
  CONSTRAINT fk_proyecto_isochrone_isochrone
    FOREIGN KEY (id_isochrone) REFERENCES geo_subzonas.isochrone(id) ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS idx_proyecto_isochrone_id_proyecto
  ON geo_subzonas.proyecto_isochrone(id_proyecto);

CREATE INDEX IF NOT EXISTS idx_proyecto_isochrone_id_isochrone
  ON geo_subzonas.proyecto_isochrone(id_isochrone);

CREATE UNIQUE INDEX IF NOT EXISTS uq_proyecto_isochrone_version_actual
  ON geo_subzonas.proyecto_isochrone(id_proyecto)
  WHERE es_version_actual = true;

-- =====================================================
-- isochrone_punto_interes (snapshot de entrada)
-- =====================================================
CREATE TABLE IF NOT EXISTS geo_subzonas.isochrone_punto_interes (
  id BIGSERIAL PRIMARY KEY,
  id_isochrone BIGINT NOT NULL,
  id_punto_interes BIGINT NOT NULL,
  prioridad INT NOT NULL,
  peso NUMERIC(10, 4) NOT NULL DEFAULT 1.0,
  es_punto_principal BOOLEAN NOT NULL DEFAULT false,
  nombre_snapshot VARCHAR(180),
  categoria_snapshot VARCHAR(120),
  latitud_snapshot NUMERIC(10, 8),
  longitud_snapshot NUMERIC(11, 8),
  fecha_creacion TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_isochrone_punto_interes UNIQUE (id_isochrone, id_punto_interes),
  CONSTRAINT ck_isochrone_punto_prioridad CHECK (prioridad > 0),
  CONSTRAINT ck_isochrone_punto_peso CHECK (peso > 0),
  CONSTRAINT fk_isochrone_punto_isochrone
    FOREIGN KEY (id_isochrone) REFERENCES geo_subzonas.isochrone(id) ON DELETE CASCADE,
  CONSTRAINT fk_isochrone_punto_punto_interes
    FOREIGN KEY (id_punto_interes) REFERENCES geo_subzonas.punto_interes(id) ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS idx_isochrone_punto_id_isochrone
  ON geo_subzonas.isochrone_punto_interes(id_isochrone);

CREATE INDEX IF NOT EXISTS idx_isochrone_punto_id_punto
  ON geo_subzonas.isochrone_punto_interes(id_punto_interes);

CREATE UNIQUE INDEX IF NOT EXISTS uq_isochrone_un_punto_principal
  ON geo_subzonas.isochrone_punto_interes(id_isochrone)
  WHERE es_punto_principal = true;

-- =====================================================
-- capa_mapa
-- =====================================================
CREATE TABLE IF NOT EXISTS geo_subzonas.capa_mapa (
  id BIGSERIAL PRIMARY KEY,
  id_public UUID NOT NULL DEFAULT gen_random_uuid(),
  nombre VARCHAR(120) NOT NULL,
  tipo VARCHAR(80) NOT NULL,
  icono VARCHAR(160),
  activa_por_defecto BOOLEAN NOT NULL DEFAULT false,
  fecha_creacion TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_capa_mapa_id_public UNIQUE (id_public),
  CONSTRAINT uq_capa_mapa_nombre UNIQUE (nombre)
);

-- Estado de capa por proyecto (persistencia de activar/desactivar)
CREATE TABLE IF NOT EXISTS geo_subzonas.proyecto_capa_mapa (
  id_proyecto BIGINT NOT NULL,
  id_capa BIGINT NOT NULL,
  activa BOOLEAN NOT NULL DEFAULT true,
  fecha_actualizacion TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (id_proyecto, id_capa),
  CONSTRAINT fk_proyecto_capa_mapa_proyecto
    FOREIGN KEY (id_proyecto) REFERENCES geo_subzonas.proyecto_lifestyle(id) ON DELETE CASCADE,
  CONSTRAINT fk_proyecto_capa_mapa_capa
    FOREIGN KEY (id_capa) REFERENCES geo_subzonas.capa_mapa(id) ON DELETE CASCADE
);

-- =====================================================
-- categoria_marcador (catálogo para filtro)
-- =====================================================
CREATE TABLE IF NOT EXISTS geo_subzonas.categoria_marcador (
  id BIGSERIAL PRIMARY KEY,
  id_public UUID NOT NULL DEFAULT gen_random_uuid(),
  categoria VARCHAR(120) NOT NULL,
  activo BOOLEAN NOT NULL DEFAULT true,
  orden INT NOT NULL DEFAULT 0,
  fecha_creacion TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_categoria_marcador_id_public UNIQUE (id_public),
  CONSTRAINT uq_categoria_marcador_categoria UNIQUE (categoria)
);

