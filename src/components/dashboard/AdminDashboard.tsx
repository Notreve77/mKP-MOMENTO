import React from 'react';
import { Users, BookOpen, BarChart3, Settings } from 'lucide-react';
import { Card } from '../ui/Card';

const StatCard: React.FC<{
  title: string;
  value: string;
  icon: React.ReactNode;
  color: string;
}> = ({ title, value, icon, color }) => (
  <Card className="relative overflow-hidden">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className="text-3xl font-bold text-[#062038] mt-2">{value}</p>
      </div>
      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${color}`}>
        {icon}
      </div>
    </div>
  </Card>
);

export const AdminDashboard: React.FC = () => {
  const stats = [
    {
      title: 'Total de Professores',
      value: '24',
      icon: <Users className="text-white" size={24} />,
      color: 'bg-gradient-to-br from-[#FE6000] to-[#e55500]'
    },
    {
      title: 'Alunos Ativos',
      value: '1,254',
      icon: <BookOpen className="text-white" size={24} />,
      color: 'bg-gradient-to-br from-[#0C4579] to-[#083d6b]'
    },
    {
      title: 'Atividades Hoje',
      value: '47',
      icon: <BarChart3 className="text-white" size={24} />,
      color: 'bg-gradient-to-br from-[#062038] to-[#051c2f]'
    },
    {
      title: 'Sistema Online',
      value: '99.9%',
      icon: <Settings className="text-white" size={24} />,
      color: 'bg-gradient-to-br from-green-500 to-green-600'
    }
  ];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-[#062038]">PAINEL ADMINISTRATIVO</h1>
        <p className="text-gray-600 mt-2">
          Bem-vindo ao sistema de gestão da plataforma Momento Kids Pass
        </p>
        <p className="text-sm text-[#FE6000] font-medium mt-1">
          🔓 ACESSO TOTAL - Administrador
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatCard
            key={index}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            color={stat.color}
          />
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Ações Rápidas" subtitle="Funcionalidades administrativas principais">
          <div className="grid grid-cols-2 gap-4">
            <button className="p-4 bg-gradient-to-br from-[#FE6000] to-[#e55500] text-white rounded-lg hover:shadow-lg transition-all duration-200 hover:transform hover:scale-105">
              <Users size={24} className="mx-auto mb-2" />
              <span className="text-sm font-medium">Gerenciar Usuários</span>
            </button>
            <button className="p-4 bg-gradient-to-br from-[#0C4579] to-[#083d6b] text-white rounded-lg hover:shadow-lg transition-all duration-200 hover:transform hover:scale-105">
              <BookOpen size={24} className="mx-auto mb-2" />
              <span className="text-sm font-medium">Atividades</span>
            </button>
            <button className="p-4 bg-gradient-to-br from-[#062038] to-[#051c2f] text-white rounded-lg hover:shadow-lg transition-all duration-200 hover:transform hover:scale-105">
              <BarChart3 size={24} className="mx-auto mb-2" />
              <span className="text-sm font-medium">Relatórios</span>
            </button>
            <button className="p-4 bg-gradient-to-br from-green-500 to-green-600 text-white rounded-lg hover:shadow-lg transition-all duration-200 hover:transform hover:scale-105">
              <Settings size={24} className="mx-auto mb-2" />
              <span className="text-sm font-medium">Configurações</span>
            </button>
          </div>
        </Card>

        <Card title="Atividade Recente" subtitle="Últimas movimentações no sistema">
          <div className="space-y-4">
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-[#062038]">Novo professor cadastrado</p>
                <p className="text-xs text-gray-500">Maria Silva Santos - há 2 minutos</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-[#062038]">Relatório mensal gerado</p>
                <p className="text-xs text-gray-500">Sistema automático - há 15 minutos</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-[#062038]">Backup do sistema concluído</p>
                <p className="text-xs text-gray-500">Sistema automático - há 1 hora</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};