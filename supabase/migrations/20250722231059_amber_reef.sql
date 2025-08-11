/*
  # Atualizar políticas RLS para horarios_aula

  1. Políticas de Acesso
    - Administradores: acesso total (CRUD)
    - Professores: apenas horários de suas modalidades
    - Público: leitura de horários disponíveis

  2. Segurança
    - Controle baseado na modalidade_aula_id
    - Professores só veem horários de suas modalidades
*/

-- Remover políticas existentes
DROP POLICY IF EXISTS "permitir_visual" ON horarios_aula;

-- Política para leitura pública de horários disponíveis
CREATE POLICY "public_read_available_horarios" ON horarios_aula
  FOR SELECT TO public
  USING (disponivel = true);

-- Política para administradores - acesso total
CREATE POLICY "admin_full_access_horarios" ON horarios_aula
  FOR ALL TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- Política para professores - apenas horários de suas modalidades
CREATE POLICY "professor_own_horarios_read" ON horarios_aula
  FOR SELECT TO authenticated
  USING (
    is_professor() AND 
    EXISTS (
      SELECT 1 FROM modalidades_aula m 
      WHERE m.id = horarios_aula.modalidade_aula_id 
      AND m.professor_id = get_professor_id()
    )
  );

CREATE POLICY "professor_own_horarios_insert" ON horarios_aula
  FOR INSERT TO authenticated
  WITH CHECK (
    is_professor() AND 
    EXISTS (
      SELECT 1 FROM modalidades_aula m 
      WHERE m.id = horarios_aula.modalidade_aula_id 
      AND m.professor_id = get_professor_id()
    )
  );

CREATE POLICY "professor_own_horarios_update" ON horarios_aula
  FOR UPDATE TO authenticated
  USING (
    is_professor() AND 
    EXISTS (
      SELECT 1 FROM modalidades_aula m 
      WHERE m.id = horarios_aula.modalidade_aula_id 
      AND m.professor_id = get_professor_id()
    )
  )
  WITH CHECK (
    is_professor() AND 
    EXISTS (
      SELECT 1 FROM modalidades_aula m 
      WHERE m.id = horarios_aula.modalidade_aula_id 
      AND m.professor_id = get_professor_id()
    )
  );

CREATE POLICY "professor_own_horarios_delete" ON horarios_aula
  FOR DELETE TO authenticated
  USING (
    is_professor() AND 
    EXISTS (
      SELECT 1 FROM modalidades_aula m 
      WHERE m.id = horarios_aula.modalidade_aula_id 
      AND m.professor_id = get_professor_id()
    )
  );