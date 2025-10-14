-- ===================================
-- TABLA DE CERTIFICACIONES
-- ===================================
-- Descripción: Almacena las certificaciones de los entrenadores
-- para ser revisadas y aprobadas por los administradores

CREATE TABLE IF NOT EXISTS certifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  certification_type VARCHAR(100) NOT NULL, -- Ej: 'RPT', 'RFET Nivel 1', 'RFET Nivel 2', etc.
  certification_name VARCHAR(255) NOT NULL,
  issuing_organization VARCHAR(255), -- Organización que emite el certificado
  issue_date DATE,
  expiry_date DATE,
  certificate_number VARCHAR(100),
  document_url TEXT, -- URL del documento en storage
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  reviewed_by UUID REFERENCES auth.users(id),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  rejection_reason TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para mejorar rendimiento
CREATE INDEX idx_certifications_user_id ON certifications(user_id);
CREATE INDEX idx_certifications_status ON certifications(status);
CREATE INDEX idx_certifications_reviewed_by ON certifications(reviewed_by);

-- RLS Policies
ALTER TABLE certifications ENABLE ROW LEVEL SECURITY;

-- Los usuarios pueden ver sus propias certificaciones
CREATE POLICY "Users can view own certifications"
ON certifications FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Los usuarios pueden insertar sus propias certificaciones
CREATE POLICY "Users can insert own certifications"
ON certifications FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Los usuarios pueden actualizar sus certificaciones pendientes
CREATE POLICY "Users can update own pending certifications"
ON certifications FOR UPDATE
TO authenticated
USING (auth.uid() = user_id AND status = 'pending')
WITH CHECK (auth.uid() = user_id AND status = 'pending');

-- Los admins pueden ver todas las certificaciones
CREATE POLICY "Admins can view all certifications"
ON certifications FOR SELECT
TO authenticated
USING ((auth.jwt()->>'role')::text = 'admin');

-- Los admins pueden actualizar cualquier certificación
CREATE POLICY "Admins can update all certifications"
ON certifications FOR UPDATE
TO authenticated
USING ((auth.jwt()->>'role')::text = 'admin');

-- Comentarios
COMMENT ON TABLE certifications IS 'Almacena las certificaciones de entrenadores para revisión';
COMMENT ON COLUMN certifications.status IS 'Estado: pending (pendiente), approved (aprobada), rejected (rechazada)';
COMMENT ON COLUMN certifications.document_url IS 'URL del documento almacenado en Supabase Storage';
