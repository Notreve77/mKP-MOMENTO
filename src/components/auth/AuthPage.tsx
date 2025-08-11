import React, { useState } from 'react';
import { LoginForm } from './LoginForm';
import { FirstAccessForm } from './FirstAccessForm';

export const AuthPage: React.FC = () => {
  const [isFirstAccess, setIsFirstAccess] = useState(false);
  const [firstAccessCpf, setFirstAccessCpf] = useState('');
  const [firstAccessUserData, setFirstAccessUserData] = useState<any>(null);

  const handleFirstAccess = (cpf: string, userData?: any) => {
    setFirstAccessCpf(cpf);
    setFirstAccessUserData(userData);
    setIsFirstAccess(true);
  };

  const handleBackToLogin = () => {
    setIsFirstAccess(false);
    setFirstAccessCpf('');
    setFirstAccessUserData(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#E6E6E6] via-white to-[#E6E6E6] flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Logo and Branding */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-[#FE6000] to-[#e55500] rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <span className="text-white text-3xl font-bold">MKP</span>
          </div>
          <h1 className="text-4xl font-bold text-[#062038] uppercase tracking-wide">
            Momento Kids Pass
          </h1>
          <p className="text-lg text-[#0C4579] font-medium mt-2">
            Infância em Movimento
          </p>
        </div>

        {/* Auth Card */}
        <div className="bg-white rounded-xl shadow-2xl border border-gray-100 p-8">
          {isFirstAccess ? (
            <FirstAccessForm
              cpf={firstAccessCpf}
              userData={firstAccessUserData}
              onBack={handleBackToLogin}
            />
          ) : (
            <div>
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-[#062038] uppercase">
                  ACESSO AO SISTEMA
                </h2>
                <p className="text-gray-600 mt-2">
                  Entre com suas credenciais para continuar
                </p>
              </div>
              
              <LoginForm onFirstAccess={handleFirstAccess} />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-500">
            © 2025 Momento Kids Pass. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </div>
  );
};