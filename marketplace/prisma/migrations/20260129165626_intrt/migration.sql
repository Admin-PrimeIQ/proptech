-- Migration 20260129165626_intrt: no-op.
-- Los índices uq_* están en uso por claves foráneas; no se pueden eliminar sin romper la BD.
-- Se deja esta migración sin cambios para que Prisma la marque como aplicada.
SELECT 1;
