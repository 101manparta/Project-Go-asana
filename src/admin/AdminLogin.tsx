import React, { useState } from 'react';
import { ShieldCheck, Lock, AlertCircle, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface AdminLoginProps {
  navigate: (route: string) => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ navigate }) => {
  const { loginAsAdmin, loginAsCustomer, user, isAdmin } = useAuth();
  const [email, setEmail] = useState('admin@asanayoga.wellness');
  const [password, setPassword] = useState('••••••••••••');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginAsAdmin();
    navigate('/admin/dashboard');
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white flex flex-col justify-center items-center p-4">
      <div className="max-w-md w-full bg-neutral-900 border border-white/10 rounded-3xl p-8 space-y-6 shadow-2xl">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center mx-auto border border-white/10">
            <Lock className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-2xl font-serif font-medium text-white">
            ASANA-Yoga Administration
          </h1>
          <p className="text-xs text-neutral-400">
            Authorized studio operations and governance portal.
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-950/50 border border-red-500/30 rounded-xl text-xs text-red-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="space-y-1">
            <label className="text-neutral-300 font-medium">Administrator Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-neutral-800 border border-white/10 text-white focus:outline-none focus:border-white"
            />
          </div>

          <div className="space-y-1">
            <label className="text-neutral-300 font-medium">Security Credential</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-neutral-800 border border-white/10 text-white focus:outline-none focus:border-white"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-full bg-white text-neutral-950 font-medium text-xs hover:bg-neutral-200 transition-colors cursor-pointer shadow-md mt-2"
          >
            Authenticate &amp; Open Dashboard
          </button>
        </form>

        {/* Evaluation Helper */}
        <div className="pt-4 border-t border-white/10 space-y-2">
          <span className="text-[10px] text-neutral-500 uppercase tracking-wider block font-mono">
            Demo RBAC Evaluation Switcher
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                loginAsAdmin();
                navigate('/admin/dashboard');
              }}
              className="p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-[11px] text-left text-neutral-300"
            >
              <strong className="block text-emerald-400">SUPER_ADMIN</strong>
              Sarah (Studio Director)
            </button>
            <button
              onClick={() => {
                loginAsCustomer();
                setError('Access denied: Customer role cannot access /admin.');
              }}
              className="p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-[11px] text-left text-neutral-300"
            >
              <strong className="block text-amber-400">CUSTOMER</strong>
              Test Unauthorized Role
            </button>
          </div>
        </div>

        <div className="text-center">
          <button
            onClick={() => navigate('/')}
            className="text-xs text-neutral-500 hover:text-white"
          >
            &larr; Back to Public Sanctuary
          </button>
        </div>

      </div>
    </div>
  );
};
