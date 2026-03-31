import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';

type Category = {
  id: string;
  nome: string;
  icone: string;
};

type Skill = {
  id: string;
  categoria_id: string;
  nome: string;
  nivel: number;
  categorias_habilidades?: Category;
};

export function SkillsList() {
  const [loading, setLoading] = useState(true);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentSkill, setCurrentSkill] = useState<Partial<Skill> | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch categories
      const { data: catData, error: catError } = await supabase
        .from('categorias_habilidades')
        .select('*')
        .order('ordem', { ascending: true });
        
      if (catError) throw catError;
      if (catData) setCategories(catData);

      // Fetch skills with category join
      const { data: skillData, error: skillError } = await supabase
        .from('habilidades')
        .select(`
          *,
          categorias_habilidades ( id, nome, icone )
        `)
        .order('nome', { ascending: true });

      if (skillError) throw skillError;
      if (skillData) setSkills(skillData);
    } catch (error) {
      console.error('Error fetching skills:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (skill: Skill) => {
    setCurrentSkill(skill);
    setIsEditing(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Tem certeza que deseja remover esta habilidade?')) return;
    
    try {
      const { error } = await supabase.from('habilidades').delete().eq('id', id);
      if (error) throw error;
      setSkills(skills.filter(s => s.id !== id));
    } catch (error) {
      console.error('Error deleting:', error);
      alert('Erro ao excluir.');
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentSkill) return;

    const payload = {
      nome: currentSkill.nome,
      categoria_id: currentSkill.categoria_id,
      nivel: currentSkill.nivel ? Number(currentSkill.nivel) : 1,
    };

    try {
      if (currentSkill.id) {
        // Update
        const { error } = await supabase
          .from('habilidades')
          .update(payload)
          .eq('id', currentSkill.id);
        if (error) throw error;
      } else {
        // Insert
        const { error } = await supabase
          .from('habilidades')
          .insert([payload]);
        if (error) throw error;
      }
      setIsEditing(false);
      setCurrentSkill(null);
      fetchData();
    } catch (error) {
      console.error('Error saving:', error);
      alert('Erro ao salvar habilidade.');
    }
  };

  if (loading) {
    return <div className="animate-pulse h-32 bg-slate-200 rounded-xl"></div>;
  }

  // Group skills by category for better visualization
  const skillsByCategory = categories.map(cat => ({
    ...cat,
    skills: skills.filter(s => s.categoria_id === cat.id)
  }));

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-6 border-b border-slate-200 flex justify-between items-center">
        <div>
          <h3 className="text-lg font-bold text-slate-800">Habilidades Técnicas e Soft Skills</h3>
          <p className="text-sm text-slate-500 mt-1">Gerencie suas competências organizadas por categorias.</p>
        </div>
        {!isEditing && (
          <button 
            onClick={() => { setCurrentSkill({ nivel: 1, categoria_id: categories[0]?.id }); setIsEditing(true); }}
            className="px-4 py-2 bg-primary text-on-primary rounded-lg text-sm font-medium hover:bg-primary/90 flex items-center gap-2 transition-all"
          >
            <span className="material-symbols-outlined text-[18px]">add</span> Adicionar Habilidade
          </button>
        )}
      </div>

      {isEditing ? (
        <form onSubmit={handleSave} className="p-6 space-y-4 bg-slate-50">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700">Nome da Habilidade</label>
              <input 
                required
                value={currentSkill?.nome || ''}
                onChange={e => setCurrentSkill({...currentSkill, nome: e.target.value})}
                placeholder="Ex: React.js"
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-primary focus:border-primary"
              />
            </div>
            
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700">Categoria</label>
              <select 
                required
                value={currentSkill?.categoria_id || ''}
                onChange={e => setCurrentSkill({...currentSkill, categoria_id: e.target.value})}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-primary focus:border-primary bg-white"
              >
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>
                    {cat.nome}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700 flex justify-between">
              <span>Nível de Proficiência (1 a 5)</span>
              <span className="text-primary font-bold">{currentSkill?.nivel || 1}/5</span>
            </label>
            <input 
              type="range"
              min="1"
              max="5"
              step="1"
              required
              value={currentSkill?.nivel || 1}
              onChange={e => setCurrentSkill({...currentSkill, nivel: Number(e.target.value)})}
              className="w-full accent-primary"
            />
            <div className="flex justify-between text-xs text-slate-400 px-1">
              <span>(Básico)</span>
              <span>(Avançado)</span>
            </div>
          </div>

          <div className="flex gap-3 justify-end pt-4">
            <button 
              type="button" 
              onClick={() => { setIsEditing(false); setCurrentSkill(null); }}
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
        <div className="p-6 space-y-8">
          {skillsByCategory.map(category => (
            <div key={category.id} className="space-y-4">
              <h4 className="flex items-center gap-2 font-bold text-slate-800 border-b border-slate-200 pb-2">
                <span className="material-symbols-outlined text-primary">{category.icone}</span>
                {category.nome}
              </h4>
              
              {category.skills.length === 0 ? (
                <p className="text-sm text-slate-400 italic">Nenhuma habilidade nesta categoria.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {category.skills.map(skill => (
                    <div key={skill.id} className="flex items-center justify-between p-3 bg-slate-50 border border-slate-100 rounded-lg hover:border-slate-300 transition-colors">
                      <div className="flex-1">
                        <span className="font-semibold text-slate-700">{skill.nome}</span>
                        <div className="flex gap-1 mt-1">
                          {[1,2,3,4,5].map(star => (
                            <div key={star} className={`flex-1 h-1.5 rounded-full ${star <= skill.nivel ? 'bg-primary' : 'bg-slate-200'}`}></div>
                          ))}
                        </div>
                      </div>
                      <div className="flex gap-1 ml-4">
                        <button onClick={() => handleEdit(skill)} className="p-1.5 text-slate-400 hover:text-primary hover:bg-primary/10 rounded-md transition-all">
                          <span className="material-symbols-outlined text-[18px]">edit</span>
                        </button>
                        <button onClick={() => handleDelete(skill.id)} className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-all">
                          <span className="material-symbols-outlined text-[18px]">delete</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
