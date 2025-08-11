import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import { User as SupabaseUser } from '@supabase/supabase-js';

export interface User {
  id: string;
  email: string;
  nome: string;
  tipo: 'ADM' | 'PROFESSOR';
  cpf: string;
  id_professor?: string;
  primeiro_acesso: boolean;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  supabaseUser: SupabaseUser | null;
  login: (cpf: string, senha: string) => Promise<{ success: boolean; firstAccess?: boolean; error?: string; errorType?: string }>;
  setFirstAccessPassword: (novaSenha: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [supabaseUser, setSupabaseUser] = useState<SupabaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Função para buscar dados do usuário na tabela usuarios
  const fetchUserData = async (supabaseUserId: string): Promise<User | null> => {
    try {
      const { data, error } = await supabase
        .from('usuarios')
        .select('id, cpf, nome_usuario, tipo_usuario, primeiro_acesso, id_professor')
        .eq('id', supabaseUserId)
        .single();

      if (error) {
        console.error('Erro ao buscar dados do usuário:', error);
        return null;
      }

      return {
        id: data.id,
        email: '', // Será preenchido com o email do Supabase Auth
        nome: data.nome_usuario || 'Usuário',
        tipo: data.tipo_usuario as 'ADM' | 'PROFESSOR',
        cpf: data.cpf,
        id_professor: data.id_professor,
        primeiro_acesso: data.primeiro_acesso
      };
    } catch (error) {
      console.error('Erro ao buscar dados do usuário:', error);
      return null;
    }
  };

  // Monitorar mudanças de autenticação
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.id);
        
        if (session?.user) {
          setSupabaseUser(session.user);
          
          // Buscar dados do usuário na tabela usuarios
          const userData = await fetchUserData(session.user.id);
          if (userData) {
            setUser({
              ...userData,
              email: session.user.email || ''
            });
          } else {
            // Se não encontrar o usuário na tabela, fazer logout
            await supabase.auth.signOut();
          }
        } else {
          setSupabaseUser(null);
          setUser(null);
        }
        
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const login = async (cpf: string, senha: string) => {
    try {
      setLoading(true);

      // Tentar fazer login diretamente com Supabase Auth
      const email = `${cpf}@mkp.local`;
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password: senha,
      });

      if (error) {
        console.error('Erro de login Supabase:', error);
        
        // Se as credenciais são inválidas, verificar se é primeiro acesso
        if (error.message.includes('Invalid login credentials')) {
          // Verificar se o usuário existe na tabela usuarios
          const { data: usuario, error: userError } = await supabase
            .from('usuarios')
            .select('id, cpf, nome_usuario, tipo_usuario, primeiro_acesso, id_professor')
            .eq('cpf', cpf)
            .single();

          if (userError || !usuario) {
            return { success: false, error: 'CPF não encontrado no sistema' };
          }

          // Se é primeiro acesso, verificar se a senha é o CPF
          if (usuario.primeiro_acesso) {
            if (senha !== cpf) {
              return { 
                success: false, 
                error: 'No primeiro acesso, use seu CPF como senha'
              };
            }
            
            return { 
              success: true, 
              firstAccess: true,
              userData: usuario
            };
          }
          
          // Se não é primeiro acesso mas as credenciais são inválidas
          return { success: false, error: 'CPF ou senha incorretos' };
        }
        
        return { success: false, error: 'Erro ao fazer login. Tente novamente.' };
      }

      // Login bem-sucedido
      if (data.user) {
        // Verificar se o usuário existe na tabela usuarios e validações
        const { data: usuario, error: userError } = await supabase
          .from('usuarios')
          .select('id, cpf, nome_usuario, tipo_usuario, primeiro_acesso, id_professor')
          .eq('cpf', cpf)
          .single();

        if (userError || !usuario) {
          // Se não encontrar na tabela usuarios, fazer logout
          await supabase.auth.signOut();
          return { success: false, error: 'Usuário não encontrado no sistema' };
        }

        // Verificar validações específicas
        if (usuario.tipo_usuario === 'PROFESSOR' && !usuario.id_professor) {
          await supabase.auth.signOut();
          return { 
            success: false, 
            error: 'Professor não vinculado. Entre em contato com a administração.',
            errorType: 'PROFESSOR_NOT_LINKED'
          };
        }

        return { success: true };
      }

      return { success: false, error: 'Erro inesperado no login' };

    } catch (error) {
      console.error('Erro no login:', error);
      return { success: false, error: 'Erro de conexão. Tente novamente.' };
    } finally {
      setLoading(false);
    }
  };

  const setFirstAccessPassword = async (novaSenha: string) => {
    try {
      if (!user) {
        return { success: false, error: 'Usuário não encontrado' };
      }

      // Criar conta no Supabase Auth
      const email = `${user.cpf}@mkp.local`;
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password: novaSenha,
        options: {
          data: {
            cpf: user.cpf,
            nome: user.nome
          }
        }
      });

      if (error) {
        console.error('Erro ao criar conta:', error);
        return { success: false, error: 'Erro ao criar conta. Tente novamente.' };
      }

      if (data.user) {
        // Atualizar a tabela usuarios
        const { error: updateError } = await supabase
          .from('usuarios')
          .update({
            id: data.user.id, // Atualizar com o ID do Supabase Auth
            primeiro_acesso: false,
            updated_at: new Date().toISOString()
          })
          .eq('cpf', user.cpf);

        if (updateError) {
          console.error('Erro ao atualizar usuário:', updateError);
          return { success: false, error: 'Erro ao finalizar configuração' };
        }

        return { success: true };
      }

      return { success: false, error: 'Erro ao criar conta' };

    } catch (error) {
      console.error('Erro ao definir senha:', error);
      return { success: false, error: 'Erro de conexão. Tente novamente.' };
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        supabaseUser,
        loading,
        login,
        setFirstAccessPassword,
        logout,
        isAuthenticated: !!user && !!supabaseUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};