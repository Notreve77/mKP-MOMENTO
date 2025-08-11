import React, { useState } from 'react';
import { Eye, EyeOff, User } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { formatCPF, validateCPF, unformatCPF } from '../../utils/cpf';
import { useAuth, User as AuthUser } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';

interface LoginFormProps {
  onFirstAccess: (cpf: string) => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onFirstAccess }) => {
  const [cpf, setCpf] = useState('');
  const [senha, setSenha] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [cpfError, setCpfError] = useState('');

  const { login } = useAuth();

  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCPF(e.target.value);
    setCpf(formatted);
    
    if (formatted.replace(/\D/g, '').length === 11) {
      if (!validateCPF(formatted)) {
        setCpfError('CPF inválido');
      } else {
        setCpfError('');
      }
    } else {
      setCpfError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    const cpfNumbers = unformatCPF(cpf);
    
    if (!validateCPF(cpf)) {
      setCpfError('CPF inválido');
      return;
    }
    
    if (!senha) {
      setError('Digite sua senha');
      return;
    }

    setLoading(true);

    try {
      const result = await login(cpfNumbers, senha);
      
      if (result.firstAccess) {
        onFirstAccess(cpfNumbers, result.userData);
      } else if (result.errorType === 'PROFESSOR_NOT_LINKED') {
        setError('Professor não vinculado ao sistema. Entre em contato com a administração para resolver esta situação.');
      } else if (!result.success) {
        setError(result.error || 'Erro no login. Tente novamente.');
      }
    } catch (err) {
      console.error('Login form error:', err);
      setError('Erro inesperado. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="relative">
          <Input
            label="CPF"
            type="text"
            value={cpf}
            onChange={handleCpfChange}
            placeholder="000.000.000-00"
            error={cpfError}
            maxLength={14}
            required
          />
          <div className="absolute right-3 top-12 text-gray-400">
            <User size={20} />
          </div>
        </div>

        <div className="relative">
          <Input
            label="Senha"
            type={showPassword ? 'text' : 'password'}
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            placeholder="Digite sua senha"
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
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      <Button
        type="submit"
        variant="primary"
        size="lg"
        className="w-full"
        loading={loading}
      >
        ENTRAR
      </Button>

      <div className="text-center">
        <p className="text-sm text-gray-600">
          Primeiro acesso? Use seu CPF como login e senha inicial.
        </p>
      </div>
    </form>
  );
};