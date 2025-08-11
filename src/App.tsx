import React from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AuthPage } from './components/auth/AuthPage';
import { Layout } from './components/layout/Layout';
import { AdminDashboard } from './components/dashboard/AdminDashboard';
import { ProfessorDashboard } from './components/dashboard/ProfessorDashboard';

const AppContent: React.FC = () => {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#E6E6E6] via-white to-[#E6E6E6] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-[#FE6000] to-[#e55500] rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <span className="text-white text-2xl font-bold">MKP</span>
          </div>
          <p className="text-[#062038] font-medium">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AuthPage />;
  }

  // Renderizar dashboard baseado no tipo de usuário
  const renderDashboard = () => {
    if (user?.tipo === 'ADM') {
      return <AdminDashboard />;
    } else if (user?.tipo === 'PROFESSOR') {
      // Verificar se professor tem id_professor válido
      if (!user.id_professor) {
        return (
          <div className="min-h-screen bg-gradient-to-br from-[#E6E6E6] via-white to-[#E6E6E6] flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl border border-gray-100 p-8 max-w-md w-full text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-red-600 text-2xl">⚠️</span>
              </div>
              <h2 className="text-2xl font-bold text-[#062038] mb-4">Acesso Restrito</h2>
              <p className="text-gray-600 mb-6">
                Seu perfil de professor não está vinculado ao sistema. 
                Entre em contato com a administração para resolver esta situação.
              </p>
              <button 
                onClick={() => window.location.reload()}
                className="bg-[#FE6000] hover:bg-[#e55500] text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Tentar Novamente
              </button>
            </div>
          </div>
        );
      }
      return <ProfessorDashboard />;
    }
    
    // Fallback para tipos não reconhecidos
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#E6E6E6] via-white to-[#E6E6E6] flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-2xl border border-gray-100 p-8 max-w-md w-full text-center">
          <h2 className="text-2xl font-bold text-[#062038] mb-4">Tipo de Usuário Inválido</h2>
          <p className="text-gray-600">Entre em contato com a administração.</p>
        </div>
      </div>
    );
  };

  return (
    <Layout>
      {renderDashboard()}
    </Layout>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;