-- Migration: grant_permissions_andreric
-- Description: Concede permissões de uso do schema para os papéis da API e cria políticas de escrita (INSERT/UPDATE/DELETE) para usuários autenticados.

-- 1. Conceder permissão de USO do schema para as roles da API do Supabase
GRANT USAGE ON SCHEMA andreric TO anon, authenticated, service_role;

-- 2. Conceder permissões em todas as tabelas e sequências atuais para as roles da API
GRANT ALL ON ALL TABLES IN SCHEMA andreric TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA andreric TO anon, authenticated, service_role;

-- 3. Configurar privilégios padrões para tabelas futuras (opcional, mas recomendado)
ALTER DEFAULT PRIVILEGES IN SCHEMA andreric GRANT ALL ON TABLES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA andreric GRANT ALL ON SEQUENCES TO anon, authenticated, service_role;

-- 4. Criar políticas RLS de ESCRITA (Insert, Update, Delete) permitindo apenas para usuários autenticados

-- Profile
CREATE POLICY "Escrita_autenticada_profile_insert" ON andreric.profile FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Escrita_autenticada_profile_update" ON andreric.profile FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Escrita_autenticada_profile_delete" ON andreric.profile FOR DELETE USING (auth.role() = 'authenticated');

-- Experiencias
CREATE POLICY "Escrita_autenticada_experiencias_insert" ON andreric.experiencias FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Escrita_autenticada_experiencias_update" ON andreric.experiencias FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Escrita_autenticada_experiencias_delete" ON andreric.experiencias FOR DELETE USING (auth.role() = 'authenticated');

-- Formacoes
CREATE POLICY "Escrita_autenticada_formacoes_insert" ON andreric.formacoes FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Escrita_autenticada_formacoes_update" ON andreric.formacoes FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Escrita_autenticada_formacoes_delete" ON andreric.formacoes FOR DELETE USING (auth.role() = 'authenticated');

-- Categorias de Habilidades
CREATE POLICY "Escrita_autenticada_categorias_hab_insert" ON andreric.categorias_habilidades FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Escrita_autenticada_categorias_hab_update" ON andreric.categorias_habilidades FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Escrita_autenticada_categorias_hab_delete" ON andreric.categorias_habilidades FOR DELETE USING (auth.role() = 'authenticated');

-- Habilidades
CREATE POLICY "Escrita_autenticada_habilidades_insert" ON andreric.habilidades FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Escrita_autenticada_habilidades_update" ON andreric.habilidades FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Escrita_autenticada_habilidades_delete" ON andreric.habilidades FOR DELETE USING (auth.role() = 'authenticated');

-- Projetos
CREATE POLICY "Escrita_autenticada_projetos_insert" ON andreric.projetos FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Escrita_autenticada_projetos_update" ON andreric.projetos FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Escrita_autenticada_projetos_delete" ON andreric.projetos FOR DELETE USING (auth.role() = 'authenticated');

-- Certificacoes
CREATE POLICY "Escrita_autenticada_certificacoes_insert" ON andreric.certificacoes FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Escrita_autenticada_certificacoes_update" ON andreric.certificacoes FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Escrita_autenticada_certificacoes_delete" ON andreric.certificacoes FOR DELETE USING (auth.role() = 'authenticated');

-- Idiomas
CREATE POLICY "Escrita_autenticada_idiomas_insert" ON andreric.idiomas FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Escrita_autenticada_idiomas_update" ON andreric.idiomas FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Escrita_autenticada_idiomas_delete" ON andreric.idiomas FOR DELETE USING (auth.role() = 'authenticated');
