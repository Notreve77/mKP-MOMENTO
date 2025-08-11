/*
  # Funções de controle de acesso

  1. Funções de Segurança
    - `is_admin()` - Verifica se o usuário atual é administrador
    - `is_professor()` - Verifica se o usuário atual é professor
    - `get_professor_id()` - Retorna o ID do professor do usuário atual
    - `can_access_professor_data()` - Verifica se pode acessar dados de um professor específico

  2. Aplicação
    - Essas funções serão usadas nas políticas RLS das tabelas
    - Garantem que professores só vejam seus próprios dados
    - Administradores têm acesso total
*/

-- Função para verificar se o usuário atual é administrador
CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM usuarios 
    WHERE id = auth.uid() 
    AND tipo_usuario = 'ADM'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função para verificar se o usuário atual é professor
CREATE OR REPLACE FUNCTION is_professor()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM usuarios 
    WHERE id = auth.uid() 
    AND tipo_usuario = 'PROFESSOR'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função para obter o ID do professor do usuário atual
CREATE OR REPLACE FUNCTION get_professor_id()
RETURNS uuid AS $$
DECLARE
  prof_id uuid;
BEGIN
  SELECT id_professor INTO prof_id
  FROM usuarios 
  WHERE id = auth.uid() 
  AND tipo_usuario = 'PROFESSOR';
  
  RETURN prof_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função para verificar se pode acessar dados de um professor específico
CREATE OR REPLACE FUNCTION can_access_professor_data(target_professor_id uuid)
RETURNS boolean AS $$
BEGIN
  -- Administradores podem acessar tudo
  IF is_admin() THEN
    RETURN true;
  END IF;
  
  -- Professores só podem acessar seus próprios dados
  IF is_professor() THEN
    RETURN get_professor_id() = target_professor_id;
  END IF;
  
  RETURN false;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;