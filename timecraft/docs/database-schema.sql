-- docs/database-schema.sql
-- TimeCraft Database Schema
-- Execute este SQL no Supabase SQL Editor se precisar recriar o banco

-- Enable Row Level Security
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO postgres, anon, authenticated, service_role;

-- Tabela de usuários
CREATE TABLE IF NOT EXISTS usuarios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR NOT NULL UNIQUE,
  nome_completo VARCHAR,
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de metas
CREATE TABLE IF NOT EXISTS metas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  titulo VARCHAR(200) NOT NULL,
  descricao TEXT,
  tipo VARCHAR(20) DEFAULT 'resultado' CHECK (tipo IN ('resultado', 'processo', 'aprendizado')),
  status VARCHAR(20) DEFAULT 'ativa' CHECK (status IN ('ativa', 'pausada', 'concluida', 'cancelada')),
  prazo DATE,
  progresso INTEGER DEFAULT 0 CHECK (progresso >= 0 AND progresso <= 100),
  categoria VARCHAR(50),
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de notas
CREATE TABLE IF NOT EXISTS notas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  titulo VARCHAR(200),
  conteudo TEXT NOT NULL,
  tipo VARCHAR(20) DEFAULT 'rapida' CHECK (tipo IN ('rapida', 'projeto', 'referencia', 'algum_dia')),
  categoria_para VARCHAR(20) CHECK (categoria_para IN ('projetos', 'areas', 'recursos', 'arquivo')),
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de tarefas
CREATE TABLE IF NOT EXISTS tarefas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  titulo VARCHAR(200) NOT NULL,
  descricao TEXT,
  status VARCHAR(20) DEFAULT 'a_fazer' CHECK (status IN ('a_fazer', 'fazendo', 'concluida')),
  prioridade VARCHAR(20) DEFAULT 'media' CHECK (prioridade IN ('baixa', 'media', 'alta')),
  projeto VARCHAR(50),
  data_vencimento DATE,
  minutos_estimados INTEGER,
  meta_id UUID REFERENCES metas(id) ON DELETE SET NULL,
  nota_id UUID REFERENCES notas(id) ON DELETE SET NULL,
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de hábitos
CREATE TABLE IF NOT EXISTS habitos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  nome VARCHAR(100) NOT NULL,
  frequencia VARCHAR(20) DEFAULT 'diaria' CHECK (frequencia IN ('diaria', 'semanal')),
  sequencia INTEGER DEFAULT 0,
  ultima_conclusao DATE,
  esta_ativo BOOLEAN DEFAULT true,
  meta_id UUID REFERENCES metas(id) ON DELETE SET NULL,
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de marcos
CREATE TABLE IF NOT EXISTS marcos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  meta_id UUID NOT NULL REFERENCES metas(id) ON DELETE CASCADE,
  titulo VARCHAR(200) NOT NULL,
  data_alvo DATE,
  concluido BOOLEAN DEFAULT false,
  concluido_em TIMESTAMP WITH TIME ZONE,
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de vínculos de notas
CREATE TABLE IF NOT EXISTS vinculos_notas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nota_id UUID NOT NULL REFERENCES notas(id) ON DELETE CASCADE,
  tipo_vinculado VARCHAR(20) NOT NULL CHECK (tipo_vinculado IN ('tarefa', 'habito', 'meta', 'nota', 'evento')),
  id_vinculado UUID NOT NULL,
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de conclusões de hábito
CREATE TABLE IF NOT EXISTS conclusoes_habito (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  habito_id UUID NOT NULL REFERENCES habitos(id) ON DELETE CASCADE,
  data_conclusao DATE NOT NULL,
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(habito_id, data_conclusao)
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_tarefas_usuario_status ON tarefas(usuario_id, status);
CREATE INDEX IF NOT EXISTS idx_tarefas_meta ON tarefas(meta_id);
CREATE INDEX IF NOT EXISTS idx_habitos_usuario ON habitos(usuario_id);
CREATE INDEX IF NOT EXISTS idx_metas_usuario_status ON metas(usuario_id, status);
CREATE INDEX IF NOT EXISTS idx_notas_usuario_tipo ON notas(usuario_id, tipo);
CREATE INDEX IF NOT EXISTS idx_notas_para ON notas(usuario_id, categoria_para);
CREATE INDEX IF NOT EXISTS idx_vinculos_nota ON vinculos_notas(nota_id);
CREATE INDEX IF NOT EXISTS idx_vinculos_linked ON vinculos_notas(tipo_vinculado, id_vinculado);

-- Habilitar RLS
ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE tarefas ENABLE ROW LEVEL SECURITY;
ALTER TABLE metas ENABLE ROW LEVEL SECURITY;
ALTER TABLE notas ENABLE ROW LEVEL SECURITY;
ALTER TABLE habitos ENABLE ROW LEVEL SECURITY;
ALTER TABLE marcos ENABLE ROW LEVEL SECURITY;
ALTER TABLE vinculos_notas ENABLE ROW LEVEL SECURITY;
ALTER TABLE conclusoes_habito ENABLE ROW LEVEL SECURITY;

-- Policies RLS
CREATE POLICY "Users can manage their own data" ON usuarios FOR ALL USING (auth.uid() = id);
CREATE POLICY "Users can manage their own tasks" ON tarefas FOR ALL USING (auth.uid() = usuario_id);
CREATE POLICY "Users can manage their own goals" ON metas FOR ALL USING (auth.uid() = usuario_id);
CREATE POLICY "Users can manage their own notes" ON notas FOR ALL USING (auth.uid() = usuario_id);
CREATE POLICY "Users can manage their own habits" ON habitos FOR ALL USING (auth.uid() = usuario_id);
CREATE POLICY "Users can manage their own milestones" ON marcos FOR ALL USING (
  auth.uid() = (SELECT usuario_id FROM metas WHERE id = marcos.meta_id)
);
CREATE POLICY "Users can manage their own note links" ON vinculos_notas FOR ALL USING (
  auth.uid() = (SELECT usuario_id FROM notas WHERE id = vinculos_notas.nota_id)
);
CREATE POLICY "Users can manage their own habit completions" ON conclusoes_habito FOR ALL USING (
  auth.uid() = (SELECT usuario_id FROM habitos WHERE id = conclusoes_habito.habito_id)
);

-- Triggers para updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.atualizado_em = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_usuarios_updated_at BEFORE UPDATE ON usuarios FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tarefas_updated_at BEFORE UPDATE ON tarefas FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_metas_updated_at BEFORE UPDATE ON metas FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_notas_updated_at BEFORE UPDATE ON notas FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_habitos_updated_at BEFORE UPDATE ON habitos FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_marcos_updated_at BEFORE UPDATE ON marcos FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_vinculos_notas_updated_at BEFORE UPDATE ON vinculos_notas FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_conclusoes_habito_updated_at BEFORE UPDATE ON conclusoes_habito FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();