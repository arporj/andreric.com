import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';

type Experience = {
  id: string;
  empresa: string;
  cargo: string;
  descricao: string[];
  inicio: string;
  fim: string | null;
  tecnologias: string | null;
};

export function ExperienceList() {
  const [loading, setLoading] = useState(true);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentExp, setCurrentExp] = useState<Partial<Experience> | null>(null);

  useEffect(() => {
    fetchExperiences();
  }, []);

  const fetchExperiences = async () => {
    try {
      const { data, error } = await supabase
        .from('experiencias')
        .select('*')
        .order('inicio', { ascending: false });

      if (error) throw error;
      if (data) setExperiences(data);
    } catch (error) {
      console.error('Error fetching experiences:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (exp: Experience) => {
    setCurrentExp(exp);
    setIsEditing(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Tem certeza que deseja remover esta experiência?')) return;
    
    try {
      const { error } = await supabase.from('experiencias').delete().eq('id', id);
      if (error) throw error;
      setExperiences(experiences.filter(e => e.id !== id));
    } catch (error) {
      console.error('Error deleting:', error);
      alert('Erro ao excluir.');
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentExp) return;

    // Convert string textarea to array of strings
    const descricaoArray = typeof currentExp.descricao === 'string' 
      ? (currentExp.descricao as string).split('\n').filter(line => line.trim() !== '')
      : currentExp.descricao || [];

    const payload = {
      empresa: currentExp.empresa,
      cargo: currentExp.cargo,
      descricao: descricaoArray,
      inicio: currentExp.inicio && currentExp.inicio.length === 7 ? `${currentExp.inicio}-01` : currentExp.inicio,
      fim: currentExp.fim && currentExp.fim.length === 7 ? `${currentExp.fim}-01` : (currentExp.fim || null),
      tecnologias: currentExp.tecnologias || null,
    };

    try {
      if (currentExp.id) {
        // Update
        const { error } = await supabase
          .from('experiencias')
          .update(payload)
          .eq('id', currentExp.id);
        if (error) throw error;
      } else {
        // Insert
        const { error } = await supabase
          .from('experiencias')
          .insert([payload]);
        if (error) throw error;
      }
      setIsEditing(false);
      setCurrentExp(null);
      fetchExperiences();
    } catch (error) {
      console.error('Error saving:', error);
      alert('Erro ao salvar experiência.');
    }
  };

  if (loading) {
    return <div className="animate-pulse h-32 bg-slate-200 rounded-xl"></div>;
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-6 border-b border-slate-200 flex justify-between items-center">
        <div>
          <h3 className="text-lg font-bold text-slate-800">Experiências Profissionais</h3>
          <p className="text-sm text-slate-500 mt-1">Gerencie seu histórico de trabalho.</p>
        </div>
        {!isEditing && (
          <button 
            onClick={() => { setCurrentExp({}); setIsEditing(true); }}
            className="px-4 py-2 bg-primary text-on-primary rounded-lg text-sm font-medium hover:bg-primary/90 flex items-center gap-2 transition-all"
          >
            <span className="material-symbols-outlined text-[18px]">add</span> Adicionar
          </button>
        )}
      </div>

      {isEditing ? (
        <form onSubmit={handleSave} className="p-6 space-y-4 bg-slate-50">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700">Empresa</label>
              <input 
                required
                value={currentExp?.empresa || ''}
                onChange={e => setCurrentExp({...currentExp, empresa: e.target.value})}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-primary focus:border-primary"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700">Cargo</label>
              <input 
                required
                value={currentExp?.cargo || ''}
                onChange={e => setCurrentExp({...currentExp, cargo: e.target.value})}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-primary focus:border-primary"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700">Data de Início</label>
              <input 
                type="month"
                required
                value={currentExp?.inicio?.substring(0, 7) || ''}
                onChange={e => setCurrentExp({...currentExp, inicio: e.target.value})}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-primary focus:border-primary"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700">Data de Fim (deixe vazio se atual)</label>
              <input 
                type="month"
                value={currentExp?.fim?.substring(0, 7) || ''}
                onChange={e => setCurrentExp({...currentExp, fim: e.target.value})}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-primary focus:border-primary"
              />
            </div>
          </div>

          <div className="space-y-1 mt-4">
            <label className="text-sm font-medium text-slate-700">Tecnologias Utilizadas</label>
            <input 
              value={currentExp?.tecnologias || ''}
              onChange={e => setCurrentExp({...currentExp, tecnologias: e.target.value})}
              placeholder="Ex: Utilizado Microsoft Visual Basic 5..."
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-primary focus:border-primary"
            />
          </div>
          
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700">Descrição (Uma tarefa por linha)</label>
            <textarea 
              rows={4}
              required
              value={Array.isArray(currentExp?.descricao) ? currentExp.descricao.join('\n') : currentExp?.descricao || ''}
              onChange={e => setCurrentExp({...currentExp, descricao: e.target.value as any})}
              placeholder="Desenvolvimento de APIs...\nOtimização de banco de dados..."
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-primary focus:border-primary resize-none"
            />
          </div>

          <div className="flex gap-3 justify-end pt-4">
            <button 
              type="button" 
              onClick={() => { setIsEditing(false); setCurrentExp(null); }}
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
          {experiences.length === 0 ? (
            <div className="p-8 text-center text-slate-500">Nenhuma experiência cadastrada.</div>
          ) : (
            experiences.map(exp => (
              <div key={exp.id} className="p-6 flex justify-between items-start hover:bg-slate-50 transition-colors">
                <div>
                  <h4 className="font-bold text-slate-800">{exp.cargo} <span className="text-slate-500 font-normal">at</span> {exp.empresa}</h4>
                  <p className="text-sm text-slate-500 mt-1">
                    {exp.inicio ? exp.inicio.split('-').slice(0, 2).reverse().join('/') : ''} - 
                    {exp.fim ? exp.fim.split('-').slice(0, 2).reverse().join('/') : ' Presente'}
                  </p>
                  {exp.tecnologias && <p className="text-xs text-slate-400 mt-1">{exp.tecnologias}</p>}
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleEdit(exp)} className="p-2 text-slate-400 hover:text-primary hover:bg-primary/10 rounded-full transition-all">
                    <span className="material-symbols-outlined text-[20px]">edit</span>
                  </button>
                  <button onClick={() => handleDelete(exp.id)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all">
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
