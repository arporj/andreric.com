import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';

type Tag = {
  id: string;
  nome: string;
  categoria: 'frontend' | 'backend' | 'infrastructure' | 'other';
  conhecimento: number;
};

const catOptions = [
  { value: 'frontend', label: 'Arquitetura Frontend' },
  { value: 'backend', label: 'Backend e Sistemas' },
  { value: 'infrastructure', label: 'Infraestrutura e Ferramentas' },
  { value: 'other', label: 'Outras' },
];

const catColor: Record<string, string> = {
  frontend: 'bg-blue-100 text-blue-700',
  backend: 'bg-green-100 text-green-700',
  infrastructure: 'bg-orange-100 text-orange-700',
  other: 'bg-slate-100 text-slate-500',
};

export function TagsList() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [newTagName, setNewTagName] = useState('');

  useEffect(() => { fetchTags(); }, []);

  const fetchTags = async () => {
    const { data } = await supabase
      .from('tecnologias_tags')
      .select('*')
      .order('conhecimento', { ascending: false })
      .order('nome', { ascending: true });
    if (data) setTags(data);
    setLoading(false);
  };

  const handleUpdate = async (id: string, updates: Partial<Tag>) => {
    setSavingId(id);
    try {
      await supabase.from('tecnologias_tags').update(updates).eq('id', id);
      setTags(tags.map(t => t.id === id ? { ...t, ...updates } : t));
    } catch (err) {
      alert('Erro ao atualizar tag.');
    } finally {
      setSavingId(null);
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTagName.trim()) return;
    
    try {
      const payload = { nome: newTagName.trim(), categoria: 'other', conhecimento: 1 };
      const { data, error } = await supabase.from('tecnologias_tags').insert([payload]).select();
      if (error) throw error;
      if (data) setTags([...tags, data[0]]);
      setNewTagName('');
    } catch (err) {
      alert('Erro ao adicionar tag.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Excluir esta tecnologia?')) return;
    await supabase.from('tecnologias_tags').delete().eq('id', id);
    setTags(tags.filter(t => t.id !== id));
  };

  const filteredTags = tags.filter(tag => {
    const matchesSearch = tag.nome.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = filterCategory === 'all' || tag.categoria === filterCategory;
    return matchesSearch && matchesCat;
  });

  if (loading) return <div className="animate-pulse h-32 bg-slate-200 rounded-xl" />;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Header & Filter Panel */}
      <div className="p-6 border-b border-slate-200 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-bold text-slate-800">Tags de Tecnologia</h3>
            <p className="text-sm text-slate-500 mt-1">Gerencie o nível de conhecimento e categoria das ferramentas.</p>
          </div>
          <form onSubmit={handleAdd} className="flex gap-2">
            <input 
              type="text" 
              placeholder="Nova tag..." 
              value={newTagName} 
              onChange={e => setNewTagName(e.target.value)}
              className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-primary focus:border-primary w-48"
            />
            <button type="submit" className="px-4 py-2 bg-primary text-on-primary rounded-lg text-sm font-medium hover:bg-primary/90 flex items-center gap-1">
              <span className="material-symbols-outlined text-[18px]">add</span>
            </button>
          </form>
        </div>

        <div className="flex flex-col md:flex-row gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
          <div className="flex-1 relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">search</span>
            <input 
              type="text" 
              placeholder="Procurar tecnologia..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
          </div>
          <select 
            value={filterCategory}
            onChange={e => setFilterCategory(e.target.value)}
            className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none min-w-[200px]"
          >
            <option value="all">Todas as Categorias</option>
            {catOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>
      </div>

      {/* Tabela de tags */}
      <div className="overflow-x-auto">
        {filteredTags.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <span className="material-symbols-outlined text-4xl mb-2 opacity-20">search_off</span>
            <p>Nenhuma tecnologia encontrada com estes filtros.</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Tecnologia</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Categoria</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Conhecimento</th>
                <th className="w-20" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredTags.map(tag => (
                <tr key={tag.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-4 font-bold text-slate-800">
                    <div className="flex items-center gap-2">
                      {tag.nome}
                      {savingId === tag.id && <div className="w-3 h-3 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={tag.categoria}
                      onChange={e => handleUpdate(tag.id, { categoria: e.target.value as Tag['categoria'] })}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold border-none focus:ring-2 focus:ring-primary/20 cursor-pointer transition-all ${catColor[tag.categoria]}`}
                    >
                      {catOptions.map(o => (
                        <option key={o.value} value={o.value}>{o.label}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map(star => (
                        <button
                          key={star}
                          onClick={() => handleUpdate(tag.id, { conhecimento: star })}
                          className={`material-symbols-outlined text-[20px] transition-all hover:scale-125 ${
                            star <= tag.conhecimento ? 'text-amber-400 fill-1' : 'text-slate-200 fill-0'
                          }`}
                          style={{ fontVariationSettings: `'FILL' ${star <= tag.conhecimento ? 1 : 0}, 'wght' 400` }}
                        >
                          star
                        </button>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleDelete(tag.id)}
                      className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all opacity-0 group-hover:opacity-100"
                    >
                      <span className="material-symbols-outlined text-[20px]">delete</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
