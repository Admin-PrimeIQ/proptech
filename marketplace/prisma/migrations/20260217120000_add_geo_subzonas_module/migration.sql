-- Modulo geoespacial independiente: subzonas
-- No modifica tablas existentes del marketplace.

CREATE SCHEMA IF NOT EXISTS geo_subzonas;

-- Requiere PostGIS para la columna geometry(MultiPolygon, 4326).
CREATE EXTENSION IF NOT EXISTS postgis;

CREATE TABLE IF NOT EXISTS geo_subzonas.subzona (
  id BIGSERIAL PRIMARY KEY,
  id_public UUID NOT NULL DEFAULT gen_random_uuid(),
  codigo_subzona VARCHAR(6) NOT NULL,
  nombre VARCHAR(80),
  nombre_descriptivo VARCHAR(120) NOT NULL,
  zona_primaria VARCHAR(3),
  origen_fid INTEGER,
  origen_layer VARCHAR(64),
  origen_path TEXT,
  flag_nombre_previo CHAR(1),
  codigo_reeval_geom VARCHAR(4),
  geom geometry(MultiPolygon, 4326),
  created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT uq_geo_subzona_id_public UNIQUE (id_public),
  CONSTRAINT uq_geo_subzona_codigo_subzona UNIQUE (codigo_subzona),
  CONSTRAINT uq_geo_subzona_nombre_descriptivo UNIQUE (nombre_descriptivo),
  CONSTRAINT chk_geo_subzona_flag_nombre_previo CHECK (
    flag_nombre_previo IN ('Y', 'N') OR flag_nombre_previo IS NULL
  )
);

CREATE INDEX IF NOT EXISTS idx_geo_subzona_geom_gist
  ON geo_subzonas.subzona USING GIST (geom);

CREATE INDEX IF NOT EXISTS idx_geo_subzona_zona_primaria
  ON geo_subzonas.subzona (zona_primaria);

CREATE TABLE IF NOT EXISTS geo_subzonas.subzona_lote_carga (
  id BIGSERIAL PRIMARY KEY,
  id_public UUID NOT NULL DEFAULT gen_random_uuid(),
  nombre_archivo TEXT NOT NULL,
  hash_archivo TEXT,
  fecha_corte_archivo DATE,
  features_totales INTEGER NOT NULL,
  features_ok INTEGER NOT NULL,
  features_error INTEGER NOT NULL,
  cargado_por TEXT,
  cargado_en TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  observaciones TEXT,
  CONSTRAINT uq_geo_subzona_lote_id_public UNIQUE (id_public),
  CONSTRAINT chk_geo_subzona_lote_features_totales CHECK (features_totales >= 0),
  CONSTRAINT chk_geo_subzona_lote_features_ok CHECK (features_ok >= 0),
  CONSTRAINT chk_geo_subzona_lote_features_error CHECK (features_error >= 0),
  CONSTRAINT chk_geo_subzona_lote_balance CHECK (features_ok + features_error = features_totales)
);

CREATE INDEX IF NOT EXISTS idx_geo_subzona_lote_cargado_en
  ON geo_subzonas.subzona_lote_carga (cargado_en DESC);

CREATE TABLE IF NOT EXISTS geo_subzonas.subzona_error_ingesta (
  id BIGSERIAL PRIMARY KEY,
  id_public UUID NOT NULL DEFAULT gen_random_uuid(),
  lote_id BIGINT NOT NULL,
  origen_fid INTEGER,
  codigo_subzona VARCHAR(6),
  tipo_error VARCHAR(50) NOT NULL,
  detalle_error TEXT NOT NULL,
  feature_raw JSONB,
  creado_en TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT uq_geo_subzona_error_id_public UNIQUE (id_public),
  CONSTRAINT fk_geo_subzona_error_lote
    FOREIGN KEY (lote_id) REFERENCES geo_subzonas.subzona_lote_carga (id)
    ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_geo_subzona_error_lote_id
  ON geo_subzonas.subzona_error_ingesta (lote_id);

CREATE INDEX IF NOT EXISTS idx_geo_subzona_error_codigo_subzona
  ON geo_subzonas.subzona_error_ingesta (codigo_subzona);
