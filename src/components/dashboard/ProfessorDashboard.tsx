import React from 'react';
import { Users, Calendar, Award, BookOpen } from 'lucide-react';
import { Card } from '../ui/Card';

import { useAuth } from '../../contexts/AuthContext';

const ActivityCard: React.FC<{
  title: string;
  time: string;
  students: number;
  status: 'pending' | 'active' | 'completed';
}> = ({ title, time, students, status }) => {
  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    active: 'bg-green-100 text-green-800',
    completed: 'bg-gray-100 text-gray-800'
  };

  const statusTexts = {
    pending: 'Pendente',
    active: 'Em andamento',
    completed: 'Concluída'
  };

  return (
    <div className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-all duration-200">
      <div className="flex justify-between items-start mb-3">
        <h4 className="font-medium text-[#062038]">{title}</h4>
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[status]}`}>
          {statusTexts[status]}
        </span>
      </div>
      <div className="flex justify-between text-sm text-gray-600">
        <span className="flex items-center">
          <Calendar size={14} className="mr-1" />
          {time}
        </span>
        <span className="flex items-center">
          <Users size={14} className="mr-1" />
          {students} alunos
        </span>
      </div>
    </div>
  );
};

export const ProfessorDashboard: React.FC = () => {
  const { user } = useAuth();

  const todayActivities = [
    { title: 'Educação Física - Turma A', time: '08:00', students: 25, status: 'completed' as const },
    { title: 'Recreação - Turma B', time: '10:00', students: 22, status: 'active' as const },
    { title: 'Dança - Turma C', time: '14:00', students: 18, status: 'pending' as const },
    { title: 'Natação - Turma A', time: '16:00', students: 15, status: 'pending' as const }
  ];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-[#062038]">MEU DASHBOARD</h1>
        <p className="text-gray-600 mt-2">
          Acompanhe suas atividades e o progresso dos seus alunos
        </p>
        <p className="text-sm text-[#0C4579] font-medium mt-1">
          🔒 ACESSO RESTRITO - Professor ID: {user?.id_professor}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Alunos Hoje</p>
              <p className="text-3xl font-bold text-[#062038] mt-2">80</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-[#FE6000] to-[#e55500] rounded-full flex items-center justify-center">
              <Users className="text-white" size={24} />
            </div>
          </div>
        </Card>

        <Card className="relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Atividades</p>
              <p className="text-3xl font-bold text-[#062038] mt-2">4</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-[#0C4579] to-[#083d6b] rounded-full flex items-center justify-center">
              <Calendar className="text-white" size={24} />
            </div>
          </div>
        </Card>

        <Card className="relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Concluídas</p>
              <p className="text-3xl font-bold text-[#062038] mt-2">1</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center">
              <Award className="text-white" size={24} />
            </div>
          </div>
        </Card>

        <Card className="relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Aproveitamento</p>
              <p className="text-3xl font-bold text-[#062038] mt-2">95%</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-[#062038] to-[#051c2f] rounded-full flex items-center justify-center">
              <BookOpen className="text-white" size={24} />
            </div>
          </div>
        </Card>
      </div>

      {/* Today's Schedule */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Cronograma de Hoje" subtitle="Suas atividades programadas">
          <div className="space-y-4">
            {todayActivities.map((activity, index) => (
              <ActivityCard
                key={index}
                title={activity.title}
                time={activity.time}
                students={activity.students}
                status={activity.status}
              />
            ))}
          </div>
        </Card>

        <Card title="Progresso da Semana" subtitle="Acompanhamento das atividades realizadas">
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg border-l-4 border-green-500">
              <div>
                <p className="font-medium text-green-800">Segunda-feira</p>
                <p className="text-sm text-green-600">4/4 atividades concluídas</p>
              </div>
              <div className="text-green-600">
                <Award size={20} />
              </div>
            </div>

            <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg border-l-4 border-green-500">
              <div>
                <p className="font-medium text-green-800">Terça-feira</p>
                <p className="text-sm text-green-600">3/3 atividades concluídas</p>
              </div>
              <div className="text-green-600">
                <Award size={20} />
              </div>
            </div>

            <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg border-l-4 border-blue-500">
              <div>
                <p className="font-medium text-blue-800">Quarta-feira (hoje)</p>
                <p className="text-sm text-blue-600">1/4 atividades concluídas</p>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 ml-4">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '25%' }}></div>
              </div>
            </div>

            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border-l-4 border-gray-300">
              <div>
                <p className="font-medium text-gray-600">Quinta-feira</p>
                <p className="text-sm text-gray-500">0/4 atividades programadas</p>
              </div>
            </div>

            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border-l-4 border-gray-300">
              <div>
                <p className="font-medium text-gray-600">Sexta-feira</p>
                <p className="text-sm text-gray-500">0/3 atividades programadas</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};