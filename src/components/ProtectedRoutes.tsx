import { Navigate, Outlet } from 'react-router';
import { useAuth } from '../contexts/AuthContext';

function ProtectedRoutes() {
  const { loading, token } = useAuth();

  if (loading) return null;
  if (!token) return <Navigate to='login' replace />;

  return <Outlet />;
}

export default ProtectedRoutes;
