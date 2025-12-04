import { useEffect, useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';
import Home from './pages/Home';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Maintenance from './pages/Maintenance';
import ProtectedRoute from './components/ProtectedRoute';
import { getSiteSettings } from './services/dataService';
import { useAuth } from './hooks/useAuth';

import Chatbot from './components/Chatbot';

function App() {
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const { session } = useAuth();
  const location = useLocation();

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
    checkMaintenance();
  }, []);

  const checkMaintenance = async () => {
    const settings = await getSiteSettings();
    if (settings?.maintenance_mode) {
      setMaintenanceMode(true);
    }
    setLoading(false);
  };

  if (loading) return null;

  // Show Maintenance page if mode is on, user is NOT logged in, and NOT on login/admin pages
  const isAdminRoute = location.pathname.startsWith('/admin') || location.pathname === '/login';
  if (maintenanceMode && !session && !isAdminRoute) {
    return <Maintenance />;
  }

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/admin" element={<Dashboard />} />
        </Route>
      </Routes>
      <Chatbot />
    </>
  );
}

export default App;
