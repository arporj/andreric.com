import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      
      // Successful login
      navigate('/admin/dashboard');
    } catch (err: any) {
      setError(err.message || 'Erro ao realizar login. Verifique suas credenciais.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-surface font-body text-on-surface min-h-screen flex flex-col selection:bg-primary-fixed selection:text-on-primary-fixed">
      {/* Header Admin Menor/Mais Discreto para a tela de Login */}
      <header className="fixed top-0 w-full z-50 bg-slate-50/70 dark:bg-slate-900/70 backdrop-blur-xl border-b border-slate-200/10 dark:border-slate-800/10 shadow-sm dark:shadow-none">
        <div className="flex justify-between items-center px-6 py-4 w-full max-w-7xl mx-auto">
          <div className="text-lg font-bold tracking-tighter text-slate-900 dark:text-slate-100">André Ric - Área Administrativa</div>
          <div className="flex items-center gap-4">
            <span className="material-symbols-outlined text-slate-500 dark:text-slate-400">account_circle</span>
          </div>
        </div>
      </header>

      <main className="flex-grow flex flex-col items-center justify-center px-6 relative overflow-hidden pt-20">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] -z-10"></div>
        <div className="w-full max-w-md glass-card rounded-lg p-10 shadow-[0_20px_40px_rgba(15,23,42,0.04)] border border-white/20 bg-white/70 backdrop-blur-xl">
          <div className="text-center mb-10">
            <h1 className="font-headline font-bold text-2xl tracking-tighter text-on-surface mb-2">Área Administrativa</h1>
            <p className="text-on-surface-variant text-sm font-medium tracking-tight">Acesse o Painel de Controle</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <div className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-sm p-3 rounded-lg border border-red-200 dark:border-red-800/50">
                {error}
              </div>
            )}
            <div className="relative group">
              <input 
                id="email" 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder=" "
                className="peer w-full bg-surface-container-lowest border border-outline-variant/30 rounded-full px-6 py-4 text-on-surface placeholder-transparent focus:outline-none focus:ring-2 focus:ring-primary-container focus:border-transparent transition-all duration-200"
              />
              <label htmlFor="email" className="absolute left-6 top-4 text-on-surface-variant text-sm transition-all duration-200 pointer-events-none peer-focus:-top-2.5 peer-focus:left-5 peer-focus:text-xs peer-focus:bg-surface-container-lowest peer-focus:px-2 peer-[:not(:placeholder-shown)]:-top-2.5 peer-[:not(:placeholder-shown)]:left-5 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:bg-surface-container-lowest peer-[:not(:placeholder-shown)]:px-2">
                E-mail
              </label>
            </div>

            <div className="relative group">
              <input 
                id="password" 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder=" "
                className="peer w-full bg-surface-container-lowest border border-outline-variant/30 rounded-full px-6 py-4 text-on-surface placeholder-transparent focus:outline-none focus:ring-2 focus:ring-primary-container focus:border-transparent transition-all duration-200"
              />
              <label htmlFor="password" className="absolute left-6 top-4 text-on-surface-variant text-sm transition-all duration-200 pointer-events-none peer-focus:-top-2.5 peer-focus:left-5 peer-focus:text-xs peer-focus:bg-surface-container-lowest peer-focus:px-2 peer-[:not(:placeholder-shown)]:-top-2.5 peer-[:not(:placeholder-shown)]:left-5 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:bg-surface-container-lowest peer-[:not(:placeholder-shown)]:px-2">
                Senha
              </label>
            </div>

            <button type="submit" disabled={loading} className="w-full bg-gradient-to-br from-primary to-primary-container text-on-primary font-semibold py-4 rounded-full shadow-lg shadow-primary/10 hover:-translate-y-0.5 hover:shadow-xl active:scale-95 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed">
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>

          <div className="mt-8 text-center">
            <a href="#" className="text-xs font-label uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors">
              Esqueceu a senha?
            </a>
          </div>
        </div>

        <div className="mt-10 flex items-center gap-2 group cursor-pointer" onClick={() => navigate('/')}>
          <span className="material-symbols-outlined text-sm text-primary group-hover:-translate-x-1 transition-transform">arrow_back</span>
          <span className="text-sm font-medium text-primary hover:text-on-primary-fixed-variant transition-colors">Voltar ao Portfólio</span>
        </div>
      </main>

      <footer className="w-full py-8 mt-auto bg-transparent">
        <div className="flex flex-col md:flex-row justify-between items-center px-12 w-full">
          <div className="font-['Inter'] text-[11px] uppercase tracking-[0.05em] font-medium text-slate-400 dark:text-slate-500">
              © 2026 André Ric. Construído com Precisão.
          </div>
          <div className="flex gap-8 mt-4 md:mt-0">
            <a href="#" className="font-['Inter'] text-[11px] uppercase tracking-[0.05em] font-medium text-slate-400 dark:text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 transition-all">Política de Privacidade</a>
            <button onClick={() => navigate('/')} className="font-['Inter'] text-[11px] uppercase tracking-[0.05em] font-medium text-blue-600 dark:text-blue-400 underline decoration-2 underline-offset-4 hover:text-slate-900 dark:hover:text-slate-100 transition-all">Voltar ao Portfólio</button>
          </div>
        </div>
      </footer>
    </div>
  );
}
