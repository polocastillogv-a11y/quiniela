-- Ejecuta esto en el SQL Editor de tu proyecto Supabase
-- (https://supabase.com/dashboard/project/hjshjrwmlfeuqhglfpft/sql/new)

-- 1. Participantes
CREATE TABLE IF NOT EXISTS participantes (
  id BIGINT PRIMARY KEY,
  nombre TEXT NOT NULL,
  token TEXT NOT NULL UNIQUE,
  cuota NUMERIC DEFAULT 0,
  pagado BOOLEAN DEFAULT false,
  metodo_pago TEXT DEFAULT '',
  referencia TEXT DEFAULT '',
  fecha_pago TIMESTAMPTZ,
  activo BOOLEAN DEFAULT true,
  fecha_registro TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Predicciones (1/X/2 por partido)
CREATE TABLE IF NOT EXISTS predicciones (
  id BIGSERIAL PRIMARY KEY,
  participante_id BIGINT NOT NULL REFERENCES participantes(id) ON DELETE CASCADE,
  partido_id TEXT NOT NULL,
  valor TEXT NOT NULL CHECK (valor IN ('1', 'X', '2')),
  UNIQUE(participante_id, partido_id)
);

-- 3. Asignaciones de equipos del sorteo
CREATE TABLE IF NOT EXISTS asignaciones (
  id BIGSERIAL PRIMARY KEY,
  participante_id BIGINT NOT NULL REFERENCES participantes(id) ON DELETE CASCADE,
  equipo_id TEXT NOT NULL,
  UNIQUE(participante_id, equipo_id)
);

-- 4. Resultados de partidos (ingresados por admin)
CREATE TABLE IF NOT EXISTS resultados (
  partido_id TEXT PRIMARY KEY,
  marcador_local INTEGER,
  marcador_visita INTEGER,
  actualizado BOOLEAN DEFAULT false
);

-- Índices para búsquedas rápidas
CREATE INDEX IF NOT EXISTS idx_predicciones_participante ON predicciones(participante_id);
CREATE INDEX IF NOT EXISTS idx_asignaciones_participante ON asignaciones(participante_id);

-- Desactivar RLS para simplificar (app cerrada con tokens propios)
ALTER TABLE participantes DISABLE ROW LEVEL SECURITY;
ALTER TABLE predicciones DISABLE ROW LEVEL SECURITY;
ALTER TABLE asignaciones DISABLE ROW LEVEL SECURITY;
ALTER TABLE resultados DISABLE ROW LEVEL SECURITY;
