'use client';

import { useState, useEffect } from 'react';
import AdminDashboard from '../../components/admin/AdminDashboard';

export default function AdminPage() {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState('');
  const [isLocalhost, setIsLocalhost] = useState<boolean | null>(null);

  // Security check: Only allow admin panel on localhost
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
      setIsLocalhost(isLocal);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'tinyshreya101') {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Invalid password');
    }
  };

  if (isLocalhost === null) {
    // Checking environment...
    return <div className="min-h-screen bg-[#02080c]" />;
  }

  if (!isLocalhost) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#02080c] text-teal-400 font-cormorant flex-col gap-4">
        <h1 className="text-4xl font-cinzel text-red-500">Access Denied</h1>
        <p className="text-[#fed7aa] tracking-widest uppercase">Admin controls are offline in this sector.</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#02080c] text-teal-400 font-cormorant">
        <form onSubmit={handleLogin} className="flex flex-col gap-4 p-8 border border-teal-900 bg-teal-950/20 rounded-lg shadow-[0_0_15px_rgba(20,184,166,0.1)] w-80 max-w-full relative overflow-hidden">
          {/* ambient glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-teal-900/20 to-transparent pointer-events-none" />
          
          <h2 className="text-2xl font-cinzel text-center text-[#fed7aa] mb-2 tracking-widest uppercase relative z-10">
            System Override
          </h2>
          <div className="relative z-10 flex flex-col gap-2">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="px-4 py-2 bg-[#02080c] text-[#fed7aa] border border-teal-800 rounded outline-none focus:border-teal-400 focus:shadow-[0_0_8px_rgba(45,212,191,0.3)] transition-all font-mono text-sm"
              placeholder="Enter authorization code..."
              autoFocus
            />
            {error && <p className="text-red-400 text-xs text-center font-mono uppercase tracking-wider">{error}</p>}
          </div>
          <button type="submit" className="relative z-10 px-4 py-2 mt-4 bg-teal-900/40 hover:bg-teal-800/60 border border-teal-800 hover:border-teal-500 text-[#fed7aa] font-cinzel uppercase tracking-widest rounded transition-all hover:shadow-[0_0_12px_rgba(45,212,191,0.4)]">
            Initialize
          </button>
        </form>
      </div>
    );
  }

  return <AdminDashboard password={password} />;
}
