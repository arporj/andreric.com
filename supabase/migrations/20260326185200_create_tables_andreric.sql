-- Migration: create_tables_andreric
-- Description: Cria as tabelas do currículo no schema andreric com RLS e timestamps.

-- Tabela: Profile (Configurações Gerais)
CREATE TABLE andreric.profile (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  nome text NOT NULL,
  titulo text,
  resumo text,
  email text,
  telefone text,
  cidade text,
  pais text DEFAULT 'Brasil',
  foto_url text,
  linkedin_url text,
  github_url text,
  site_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Tabela: Experiências
CREATE TABLE andreric.experiencias (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  empresa text NOT NULL,
  cargo text NOT NULL,
  descricao text[],
  inicio date NOT NULL,
  fim date,
  created_at timestamptz DEFAULT now()
);

-- Tabela: Formações (Educação)
CREATE TABLE andreric.formacoes (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  instituicao text NOT NULL,
  curso text NOT NULL,
  grau text,
  inicio date,
  fim date,
  created_at timestamptz DEFAULT now()
);

-- Tabela Auxiliar: Categoria de Habilidades (para resolver os ícones automaticamente)
CREATE TABLE andreric.categorias_habilidades (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  nome text NOT NULL UNIQUE,
  icone text NOT NULL,
  ordem int DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Tabela: Habilidades
CREATE TABLE andreric.habilidades (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  categoria_id uuid REFERENCES andreric.categorias_habilidades(id) ON DELETE CASCADE,
  nome text NOT NULL,
  nivel int CHECK (nivel BETWEEN 1 AND 5),
  ordem int DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Tabela: Projetos
CREATE TABLE andreric.projetos (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  nome text NOT NULL,
  descricao text,
  url text,
  repo_url text,
  imagem_url text,
  tecnologias text[] DEFAULT '{}',
  destaque bool DEFAULT false,
  ordem int DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Tabela: Certificações
CREATE TABLE andreric.certificacoes (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  nome text NOT NULL,
  emissor text,
  url text,
  data_emissao date,
  data_expiracao date,
  ordem int DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Tabela: Idiomas
CREATE TABLE andreric.idiomas (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  nome text NOT NULL,
  nivel text CHECK (nivel IN ('Básico','Intermediário','Avançado','Fluente','Nativo')),
  ordem int DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Habilitar RLS (Row Level Security)
ALTER TABLE andreric.profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE andreric.experiencias ENABLE ROW LEVEL SECURITY;
ALTER TABLE andreric.formacoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE andreric.categorias_habilidades ENABLE ROW LEVEL SECURITY;
ALTER TABLE andreric.habilidades ENABLE ROW LEVEL SECURITY;
ALTER TABLE andreric.projetos ENABLE ROW LEVEL SECURITY;
ALTER TABLE andreric.certificacoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE andreric.idiomas ENABLE ROW LEVEL SECURITY;

-- Políticas de Leitura Pública para que o frontend/site consiga ler sem autenticação
CREATE POLICY "Leitura_publica_profile" ON andreric.profile FOR SELECT USING (true);
CREATE POLICY "Leitura_publica_experiencias" ON andreric.experiencias FOR SELECT USING (true);
CREATE POLICY "Leitura_publica_formacoes" ON andreric.formacoes FOR SELECT USING (true);
CREATE POLICY "Leitura_publica_categorias_hab" ON andreric.categorias_habilidades FOR SELECT USING (true);
CREATE POLICY "Leitura_publica_habilidades" ON andreric.habilidades FOR SELECT USING (true);
CREATE POLICY "Leitura_publica_projetos" ON andreric.projetos FOR SELECT USING (true);
CREATE POLICY "Leitura_publica_certificacoes" ON andreric.certificacoes FOR SELECT USING (true);
CREATE POLICY "Leitura_publica_idiomas" ON andreric.idiomas FOR SELECT USING (true);

-- Popular as categorias padrões do Design para evitar pesquisa manual na aba do administrador
INSERT INTO andreric.categorias_habilidades (nome, icone, ordem) VALUES
  ('Frontend Architecture', 'brush', 1),
  ('Backend & Systems', 'database', 2),
  ('Infrastructure & Tools', 'terminal', 3),
  ('Design & UX', 'palette', 4),
  ('Business & Soft Skills', 'psychology', 5);
