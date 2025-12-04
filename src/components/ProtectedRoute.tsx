
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const ProtectedRoute = () => {
  const { session, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // For development/demo purposes, if Supabase is not configured, allow access
  // In production, this should strictly check for session
  const isSupabaseConfigured = import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY;
  if (!isSupabaseConfigured) {
     // return <Outlet />; // Uncomment to bypass auth when no keys
  }

  return session ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
