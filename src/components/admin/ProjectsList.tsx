import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { TagInput } from './TagInput';

type Project = {
  id: string;
  nome: string;
  descricao: string;
  url: string | null;
  repo_url: string | null;
  imagem_url: string | null;
  tecnologias: string[];
  destaque: boolean;
};

export function ProjectsList() {
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentProj, setCurrentProj] = useState<Partial<Project> | null>(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('projetos')
        .select('*')
        .order('destaque', { ascending: false })
        .order('nome', { ascending: true });

      if (error) throw error;
      if (data) setProjects(data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (proj: Project) => {
    setCurrentProj(proj);
    setIsEditing(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Tem certeza que deseja remover este projeto?')) return;
    
    try {
      const { error } = await supabase.from('projetos').delete().eq('id', id);
      if (error) throw error;
      setProjects(projects.filter(p => p.id !== id));
    } catch (error) {
      console.error('Error deleting:', error);
      alert('Erro ao excluir.');
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentProj) return;

    // Convert string of comma-separated techs to array
    const techArray = typeof currentProj.tecnologias === 'string' 
      ? (currentProj.tecnologias as string).split(',').map(t => t.trim()).filter(Boolean)
      : currentProj.tecnologias || [];

    const payload = {
      nome: currentProj.nome,
      descricao: currentProj.descricao,
      url: currentProj.url || null,
      repo_url: currentProj.repo_url || null,
      imagem_url: currentProj.imagem_url || null,
      tecnologias: techArray,
      destaque: currentProj.destaque || false,
    };

    try {
      if (currentProj.id) {
        // Update
        const { error } = await supabase
          .from('projetos')
          .update(payload)
          .eq('id', currentProj.id);
        if (error) throw error;
      } else {
        // Insert
        const { error } = await supabase
          .from('projetos')
          .insert([payload]);
        if (error) throw error;
      }
      setIsEditing(false);
      setCurrentProj(null);
      fetchProjects();
    } catch (error) {
      console.error('Error saving:', error);
      alert('Erro ao salvar projeto.');
    }
  };

  if (loading) {
    return <div className="animate-pulse h-32 bg-slate-200 rounded-xl"></div>;
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-6 border-b border-slate-200 flex justify-between items-center">
        <div>
          <h3 className="text-lg font-bold text-slate-800">Projetos</h3>
          <p className="text-sm text-slate-500 mt-1">Gerencie os projetos exibidos no portfólio.</p>
        </div>
        {!isEditing && (
          <button 
            onClick={() => { setCurrentProj({ destaque: false }); setIsEditing(true); }}
            className="px-4 py-2 bg-primary text-on-primary rounded-lg text-sm font-medium hover:bg-primary/90 flex items-center gap-2 transition-all"
          >
            <span className="material-symbols-outlined text-[18px]">add</span> Adicionar Projeto
          </button>
        )}
      </div>

      {isEditing ? (
        <form onSubmit={handleSave} className="p-6 space-y-4 bg-slate-50">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700">Nome do Projeto</label>
              <input 
                required
                value={currentProj?.nome || ''}
                onChange={e => setCurrentProj({...currentProj, nome: e.target.value})}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-primary focus:border-primary"
              />
            </div>
            <div className="space-y-1 flex items-end pb-2">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-700 cursor-pointer">
                <input 
                  type="checkbox"
                  checked={currentProj?.destaque || false}
                  onChange={e => setCurrentProj({...currentProj, destaque: e.target.checked})}
                  className="w-4 h-4 text-primary focus:ring-primary border-slate-300 rounded"
                />
                Projeto em Destaque?
              </label>
            </div>
          </div>
          
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700">Descrição Breve</label>
            <textarea 
              rows={2}
              required
              value={currentProj?.descricao || ''}
              onChange={e => setCurrentProj({...currentProj, descricao: e.target.value})}
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-primary focus:border-primary resize-none"
            />
          </div>

          <TagInput
            label="Tecnologias Usadas"
            value={Array.isArray(currentProj?.tecnologias) ? currentProj.tecnologias.join(', ') : currentProj?.tecnologias || ''}
            onChange={val => setCurrentProj({...currentProj, tecnologias: val as any})}
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700">URL do Live Demo</label>
              <input 
                value={currentProj?.url || ''}
                onChange={e => setCurrentProj({...currentProj, url: e.target.value})}
                placeholder="https://"
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-primary focus:border-primary"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700">URL do GitHub (Código)</label>
              <input 
                value={currentProj?.repo_url || ''}
                onChange={e => setCurrentProj({...currentProj, repo_url: e.target.value})}
                placeholder="https://github.com/..."
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-primary focus:border-primary"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700">URL da Imagem (Capa)</label>
              <input 
                value={currentProj?.imagem_url || ''}
                onChange={e => setCurrentProj({...currentProj, imagem_url: e.target.value})}
                placeholder="https://..."
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-primary focus:border-primary"
              />
            </div>
          </div>

          <div className="flex gap-3 justify-end pt-4">
            <button 
              type="button" 
              onClick={() => { setIsEditing(false); setCurrentProj(null); }}
              className="px-4 py-2 text-slate-600 hover:bg-slate-200 rounded-md text-sm font-medium transition-colors"
            >
              Cancelar
            </button>
            <button 
              type="submit"
              className="px-4 py-2 bg-primary text-on-primary rounded-md text-sm font-medium hover:bg-primary/90 transition-colors flex items-center gap-1"
            >
               <span className="material-symbols-outlined text-[18px]">check</span> Salvar
            </button>
          </div>
        </form>
      ) : (
        <div className="divide-y divide-slate-100">
          {projects.length === 0 ? (
            <div className="p-8 text-center text-slate-500">Nenhum projeto cadastrado.</div>
          ) : (
            projects.map(proj => (
              <div key={proj.id} className="p-6 flex justify-between items-start hover:bg-slate-50 transition-colors">
                <div className="flex gap-4">
                  {proj.imagem_url ? (
                    <img src={proj.imagem_url} alt={proj.nome} className="w-24 h-16 object-cover rounded-lg bg-slate-100" />
                  ) : (
                    <div className="w-24 h-16 bg-slate-100 rounded-lg flex items-center justify-center">
                      <span className="material-symbols-outlined text-slate-400">image</span>
                    </div>
                  )}
                  <div>
                    <h4 className="font-bold text-slate-800 flex items-center gap-2">
                       {proj.nome}
                       {proj.destaque && <span className="px-2 py-0.5 bg-yellow-100 text-yellow-800 text-[10px] uppercase font-bold rounded-full">Destaque</span>}
                    </h4>
                    <p className="text-sm text-slate-500 mt-1 line-clamp-1">{proj.descricao}</p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {proj.tecnologias.filter(Boolean).slice(0, 3).map((tech, i) => (
                        <span key={i} className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[11px] rounded-md">{tech}</span>
                      ))}
                      {proj.tecnologias.length > 3 && <span className="text-xs text-slate-400">+{proj.tecnologias.length - 3}</span>}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleEdit(proj)} className="p-2 text-slate-400 hover:text-primary hover:bg-primary/10 rounded-full transition-all">
                    <span className="material-symbols-outlined text-[20px]">edit</span>
                  </button>
                  <button onClick={() => handleDelete(proj.id)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all">
                    <span className="material-symbols-outlined text-[20px]">delete</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
