import { useAuth } from '../contexts/AuthContext';

export const useAccessControl = () => {
  const { user } = useAuth();

  const isAdmin = () => {
    return user?.tipo === 'ADM';
  };

  const isProfessor = () => {
    return user?.tipo === 'PROFESSOR';
  };

  const canAccessAllData = () => {
    return isAdmin();
  };

  const canAccessProfessorData = (professorId?: string) => {
    if (isAdmin()) return true;
    if (isProfessor() && user?.id_professor) {
      return user.id_professor === professorId;
    }
    return false;
  };

  const getProfessorId = () => {
    return user?.id_professor;
  };

  const getUserPermissions = () => {
    return {
      canCreateEvents: isAdmin() || isProfessor(),
      canEditAllEvents: isAdmin(),
      canEditOwnEvents: isProfessor(),
      canDeleteEvents: isAdmin(),
      canViewAllUsers: isAdmin(),
      canManageUsers: isAdmin(),
      canViewReports: isAdmin(),
      canManageSystem: isAdmin()
    };
  };

  return {
    isAdmin,
    isProfessor,
    canAccessAllData,
    canAccessProfessorData,
    getProfessorId,
    getUserPermissions,
    user
  };
};