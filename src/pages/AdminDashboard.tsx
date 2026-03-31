import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { ProfileForm } from '../components/admin/ProfileForm';
import { ExperienceList } from '../components/admin/ExperienceList';
import { ProjectsList } from '../components/admin/ProjectsList';
import { SkillsList } from '../components/admin/SkillsList';

export function AdminDashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profile');

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate('/admin');
      } else {
        setLoading(false);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        navigate('/admin');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/admin');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin"></div>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return <ProfileForm />;
      case 'experience':
        return <ExperienceList />;
      case 'projects':
        return <ProjectsList />;
      case 'skills':
        return <SkillsList />;
      default:
        return <ProfileForm />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row font-body">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-white border-r border-slate-200 flex flex-col">
        <div className="p-6 border-b border-slate-200">
          <h1 className="font-bold text-lg text-slate-900 border-l-4 border-primary pl-3">Área Admin</h1>
        </div>
        
        <nav className="flex-1 p-4 space-y-1">
          <button 
            onClick={() => setActiveTab('profile')}
            className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${activeTab === 'profile' ? 'bg-primary/10 text-primary' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}`}
          >
            <span className="material-symbols-outlined text-[20px]">person</span>
            Perfil Pessoal
          </button>
          
          <button 
            onClick={() => setActiveTab('experience')}
            className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${activeTab === 'experience' ? 'bg-primary/10 text-primary' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}`}
          >
            <span className="material-symbols-outlined text-[20px]">work</span>
            Experiências
          </button>

          <button 
            onClick={() => setActiveTab('projects')}
            className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${activeTab === 'projects' ? 'bg-primary/10 text-primary' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}`}
          >
            <span className="material-symbols-outlined text-[20px]">web</span>
            Projetos
          </button>

          <button 
            onClick={() => setActiveTab('skills')}
            className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${activeTab === 'skills' ? 'bg-primary/10 text-primary' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}`}
          >
            <span className="material-symbols-outlined text-[20px]">psychology</span>
            Habilidades
          </button>
        </nav>

        <div className="p-4 border-t border-slate-200">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">logout</span>
            Sair
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto bg-slate-50">
        <header className="bg-white border-b border-slate-200 px-8 py-4 flex justify-between items-center sticky top-0 z-10">
          <h2 className="text-xl font-bold text-slate-800 capitalize">
            {activeTab === 'profile' && 'Configurações de Perfil'}
            {activeTab === 'experience' && 'Gerenciar Experiências'}
            {activeTab === 'projects' && 'Gerenciar Projetos'}
            {activeTab === 'skills' && 'Habilidades Técnicas'}
          </h2>
          <a href="/" target="_blank" className="text-sm font-medium text-primary hover:underline flex items-center gap-1">
            Ver Site <span className="material-symbols-outlined text-[16px]">open_in_new</span>
          </a>
        </header>

        <div className="p-8 max-w-5xl mx-auto">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}
