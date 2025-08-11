import React, { useState } from 'react';
import { Eye, EyeOff, Lock, Check, X } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { useAuth, User as AuthUser } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';

interface FirstAccessFormProps {
  cpf: string;
  userData?: any;
  onBack: () => void;
}

interface PasswordRequirement {
  text: string;
  test: (password: string) => boolean;
}

const passwordRequirements: PasswordRequirement[] = [
  { text: 'Mínimo 8 caracteres', test: (pwd) => pwd.length >= 8 },
  { text: 'Pelo menos uma letra maiúscula', test: (pwd) => /[A-Z]/.test(pwd) },
  { text: 'Pelo menos uma letra minúscula', test: (pwd) => /[a-z]/.test(pwd) },
  { text: 'Pelo menos um número', test: (pwd) => /\d/.test(pwd) },
];

export const FirstAccessForm: React.FC<FirstAccessFormProps> = ({ cpf, onBack }) => {
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { setFirstAccessPassword } = useAuth();

  const isPasswordValid = passwordRequirements.every(req => req.test(novaSenha));
  const passwordsMatch = novaSenha === confirmarSenha && novaSenha.length > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!isPasswordValid) {
      setError('A senha não atende todos os requisitos');
      return;
    }

    if (!passwordsMatch) {
      setError('As senhas não coincidem');
      return;
    }

    setLoading(true);

    try {
      // Primeiro, criar a conta no Supabase Auth
      const email = `${cpf}@mkp.local`;
      
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password: novaSenha,
        options: {
          data: {
            cpf: cpf,
            nome: userData?.nome_usuario || 'Usuário'
          }
        }
      });

      if (signUpError) {
        console.error('Erro ao criar conta:', signUpError);
        setError('Erro ao criar conta. Tente novamente.');
        return;
      }

      if (data.user) {
        // Atualizar a tabela usuarios com o ID do Supabase Auth
        const { error: updateError } = await supabase
          .from('usuarios')
          .update({
            id: data.user.id,
            primeiro_acesso: false,
            updated_at: new Date().toISOString()
          })
          .eq('cpf', cpf);

        if (updateError) {
          console.error('Erro ao atualizar usuário:', updateError);
          setError('Erro ao finalizar configuração');
          return;
        }

        // Fazer login automático
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password: novaSenha,
        });

        if (signInError) {
          console.error('Erro no login automático:', signInError);
          setError('Conta criada, mas erro no login. Tente fazer login novamente.');
          onBack();
          return;
        }
      }
    } catch (err) {
      console.error('Erro no primeiro acesso:', err);
      setError('Erro de conexão. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-br from-[#FE6000] to-[#e55500] rounded-full flex items-center justify-center mx-auto mb-4">
          <Lock className="text-white" size={32} />
        </div>
        <h2 className="text-2xl font-bold text-[#062038] mb-2">PRIMEIRO ACESSO</h2>
        <p className="text-gray-600">Defina sua nova senha para acessar a plataforma</p>
        <p className="text-sm text-gray-500 mt-2">
          CPF: <span className="font-mono font-medium">{cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')}</span>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div className="relative">
            <Input
              label="Nova Senha"
              type={showPassword ? 'text' : 'password'}
              value={novaSenha}
              onChange={(e) => setNovaSenha(e.target.value)}
              placeholder="Digite sua nova senha"
              required
            />
            <button
              type="button"
              className="absolute right-3 top-12 text-gray-400 hover:text-[#0C4579] transition-colors"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <div className="relative">
            <Input
              label="Confirmar Senha"
              type={showConfirmPassword ? 'text' : 'password'}
              value={confirmarSenha}
              onChange={(e) => setConfirmarSenha(e.target.value)}
              placeholder="Confirme sua senha"
              required
            />
            <button
              type="button"
              className="absolute right-3 top-12 text-gray-400 hover:text-[#0C4579] transition-colors"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        {/* Password Requirements */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="text-sm font-medium text-[#062038] mb-3">Requisitos da senha:</h4>
          <ul className="space-y-2">
            {passwordRequirements.map((req, index) => (
              <li key={index} className="flex items-center space-x-2 text-sm">
                {req.test(novaSenha) ? (
                  <Check className="text-green-500" size={16} />
                ) : (
                  <X className="text-gray-400" size={16} />
                )}
                <span className={req.test(novaSenha) ? 'text-green-700' : 'text-gray-600'}>
                  {req.text}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Password Match Indicator */}
        {confirmarSenha.length > 0 && (
          <div className="flex items-center space-x-2 text-sm">
            {passwordsMatch ? (
              <>
                <Check className="text-green-500" size={16} />
                <span className="text-green-700">Senhas coincidem</span>
              </>
            ) : (
              <>
                <X className="text-red-500" size={16} />
                <span className="text-red-700">Senhas não coincidem</span>
              </>
            )}
          </div>
        )}

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        <div className="space-y-3">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full"
            loading={loading}
            disabled={!isPasswordValid || !passwordsMatch}
          >
            DEFINIR SENHA
          </Button>

          <Button
            type="button"
            variant="outline"
            size="lg"
            className="w-full"
            onClick={onBack}
          >
            VOLTAR
          </Button>
        </div>
      </form>
    </div>
  );
};