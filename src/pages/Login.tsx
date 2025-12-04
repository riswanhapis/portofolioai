import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabaseClient';
import { Shield, Lock, AlertCircle } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      navigate('/admin');
    } catch (err: any) {
      setError(err.message || 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark text-white relative overflow-hidden">
      {/* Background Animation */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-secondary/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 w-full max-w-md p-8 bg-dark-lighter rounded-2xl border border-gray-800 shadow-2xl">
        <div className="text-center mb-8">
          <div className="inline-flex p-4 bg-dark rounded-full border border-gray-800 mb-4">
            <Shield className="text-primary w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold">Admin Access</h2>
          <p className="text-gray-400 text-sm mt-2">Enter credentials to access dashboard</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg flex items-center gap-3 text-red-400 text-sm">
            <AlertCircle size={18} />
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-gray-400 mb-2 text-sm">Email</label>
            <div className="relative">
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-dark border border-gray-700 rounded-lg pl-4 pr-10 py-3 text-white focus:border-primary focus:outline-none transition-colors"
                placeholder="admin@example.com"
                required
              />
            </div>
          </div>
          
          <div>
            <label className="block text-gray-400 mb-2 text-sm">Password</label>
            <div className="relative">
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-dark border border-gray-700 rounded-lg pl-4 pr-10 py-3 text-white focus:border-primary focus:outline-none transition-colors"
                placeholder="••••••••"
                required
              />
              <Lock className="absolute right-3 top-3.5 text-gray-500 w-5 h-5" />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-primary text-dark font-bold py-3 rounded-lg hover:bg-white transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Authenticating...' : 'Login to Dashboard'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
