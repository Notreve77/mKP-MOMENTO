-- Fix security issues and add proper RLS policies

-- 1. Add RLS policies for tabelas sem políticas
ALTER TABLE public.professores ENABLE ROW LEVEL SECURITY;

-- Políticas para professores
CREATE POLICY "admin_full_access_professores" ON public.professores
  FOR ALL TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "professor_own_profile_read" ON public.professores  
  FOR SELECT TO authenticated
  USING (is_professor() AND id = get_professor_id());

CREATE POLICY "professor_own_profile_update" ON public.professores
  FOR UPDATE TO authenticated  
  USING (is_professor() AND id = get_professor_id())
  WITH CHECK (is_professor() AND id = get_professor_id());

-- Políticas para usuarios (sem acesso direto - apenas via Edge Functions)
ALTER TABLE public.usuarios ENABLE ROW LEVEL SECURITY;

CREATE POLICY "no_direct_access_usuarios" ON public.usuarios
  FOR ALL TO authenticated
  USING (false)
  WITH CHECK (false);

-- 2. Fix search_path for existing functions
CREATE OR REPLACE FUNCTION public.autenticar_usuario(p_cpf text, p_senha text)
 RETURNS TABLE(id uuid, cpf text, tipo_usuario text, primeiro_acesso boolean, nome_usuario text)
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = ''
AS $function$
BEGIN
  -- Verificar se o usuário existe e validar a senha
  RETURN QUERY
  SELECT 
    u.id,
    u.cpf,
    u.tipo_usuario,
    u.primeiro_acesso,
    u.nome_usuario
  FROM public.usuarios u
  WHERE u.cpf = p_cpf 
    AND u.senha_hash = crypt(p_senha, u.senha_hash);
    
  -- Se não encontrou resultados, gerar erro
  IF NOT FOUND THEN
    RAISE EXCEPTION 'CPF ou senha inválidos.' USING ERRCODE = 'P0001';
  END IF;
END;
$function$;

CREATE OR REPLACE FUNCTION public.is_admin()
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = ''
AS $function$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.usuarios 
    WHERE id = auth.uid() 
    AND tipo_usuario = 'ADM'
  );
END;
$function$;

CREATE OR REPLACE FUNCTION public.alterar_senha(p_cpf text, p_nova_senha text)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = ''
AS $function$
DECLARE
    v_rows_updated INTEGER;
BEGIN
    UPDATE public.usuarios
    SET
        senha_hash = crypt(p_nova_senha, gen_salt('bf')), 
        primeiro_acesso = FALSE, 
        updated_at = now()
    WHERE cpf = p_cpf;

    GET DIAGNOSTICS v_rows_updated = ROW_COUNT;

    IF v_rows_updated = 1 THEN
        RETURN TRUE;
    ELSE
        RAISE EXCEPTION 'Erro ao alterar a senha. CPF não encontrado ou nenhum registro foi atualizado.';
    END IF;
END;
$function$;

CREATE OR REPLACE FUNCTION public.is_professor()
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = ''
AS $function$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.usuarios 
    WHERE id = auth.uid() 
    AND tipo_usuario = 'PROFESSOR'
  );
END;
$function$;

CREATE OR REPLACE FUNCTION public.get_professor_id()
 RETURNS uuid
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = ''
AS $function$
DECLARE
  prof_id uuid;
BEGIN
  SELECT id_professor INTO prof_id
  FROM public.usuarios 
  WHERE id = auth.uid() 
  AND tipo_usuario = 'PROFESSOR';
  
  RETURN prof_id;
END;
$function$;

CREATE OR REPLACE FUNCTION public.can_access_professor_data(target_professor_id uuid)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = ''
AS $function$
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
$function$;

CREATE OR REPLACE FUNCTION public.criar_ou_atualizar_usuario_professor()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path = ''
AS $function$
BEGIN
  -- Verifica se já existe um usuário com esse CPF
  IF EXISTS (
    SELECT 1 FROM public.usuarios WHERE cpf = NEW.cpf_professor
  ) THEN
    -- Atualiza o nome se for diferente do anterior
    UPDATE public.usuarios
    SET nome_usuario = NEW.nome_completo
    WHERE cpf = NEW.cpf_professor;
  ELSE
    -- Cria novo usuário se não existir
    INSERT INTO public.usuarios (
      cpf,
      senha_hash,
      tipo_usuario,
      primeiro_acesso,
      nome_usuario
    )
    VALUES (
      NEW.cpf_professor,
      crypt(NEW.cpf_professor, gen_salt('bf')),
      'Professor',
      TRUE,
      NEW.nome_completo
    );
  END IF;

  RETURN NEW;
END;
$function$;