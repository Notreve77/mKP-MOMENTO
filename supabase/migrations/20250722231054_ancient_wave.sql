/*
  # Atualizar políticas RLS para modalidades_aula

  1. Políticas de Acesso
    - Administradores: acesso total (CRUD)
    - Professores: apenas modalidades vinculadas ao seu professor_id
    - Público: leitura de modalidades ativas

  2. Segurança
    - Professores só podem gerenciar suas próprias modalidades
    - Controle baseado no professor_id da modalidade
*/

-- Remover políticas existentes
DROP POLICY IF EXISTS "permitir_leitura_modalidades" ON modalidades_aula;

-- Política para leitura pública de modalidades ativas
CREATE POLICY "public_read_active_modalidades" ON modalidades_aula
  FOR SELECT TO public
  USING (ativo = true);

-- Política para administradores - acesso total
CREATE POLICY "admin_full_access_modalidades" ON modalidades_aula
  FOR ALL TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- Política para professores - apenas suas modalidades
CREATE POLICY "professor_own_modalidades_read" ON modalidades_aula
  FOR SELECT TO authenticated
  USING (
    is_professor() AND 
    professor_id = get_professor_id()
  );

CREATE POLICY "professor_own_modalidades_insert" ON modalidades_aula
  FOR INSERT TO authenticated
  WITH CHECK (
    is_professor() AND 
    professor_id = get_professor_id()
  );

CREATE POLICY "professor_own_modalidades_update" ON modalidades_aula
  FOR UPDATE TO authenticated
  USING (
    is_professor() AND 
    professor_id = get_professor_id()
  )
  WITH CHECK (
    is_professor() AND 
    professor_id = get_professor_id()
  );

CREATE POLICY "professor_own_modalidades_delete" ON modalidades_aula
  FOR DELETE TO authenticated
  USING (
    is_professor() AND 
    professor_id = get_professor_id()
  );