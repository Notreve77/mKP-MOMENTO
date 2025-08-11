import React from 'react';
import { LogOut, User } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/Button';

export const Header: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className="text-2xl font-bold text-[#062038]">
                <span className="text-[#FE6000]">MKP</span>
              </h1>
            </div>
            <div className="ml-4">
              <h2 className="text-sm text-gray-600 font-medium">
                Momento Kids Pass
              </h2>
              <p className="text-xs text-gray-500">Infância em Movimento</p>
            </div>
          </div>

          {/* User Info & Logout */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-[#FE6000] to-[#e55500] rounded-full flex items-center justify-center">
                <User className="text-white" size={16} />
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-medium text-[#062038]">{user?.nome}</p>
                <p className="text-xs text-gray-500 uppercase">{user?.tipo}</p>
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={logout}
              className="text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300"
            >
              <LogOut size={16} className="mr-1" />
              Sair
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};