import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';

type Tag = {
  id: string;
  nome: string;
  categoria: 'frontend' | 'backend' | 'infrastructure' | 'other';
  importancia: number;
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
  const [isEditing, setIsEditing] = useState(false);
  const [currentTag, setCurrentTag] = useState<Partial<Tag>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetchTags(); }, []);

  const fetchTags = async () => {
    const { data } = await supabase
      .from('tecnologias_tags')
      .select('*')
      .order('importancia', { ascending: false })
      .order('nome', { ascending: true });
    if (data) setTags(data);
    setLoading(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentTag.nome?.trim()) return;
    setSaving(true);

    const payload = {
      nome: currentTag.nome.trim(),
      categoria: currentTag.categoria || 'other',
      importancia: Number(currentTag.importancia) || 0,
    };

    try {
      if (currentTag.id) {
        await supabase.from('tecnologias_tags').update(payload).eq('id', currentTag.id);
      } else {
        await supabase.from('tecnologias_tags').insert([payload]);
      }
      setIsEditing(false);
      setCurrentTag({});
      fetchTags();
    } catch (err) {
      alert('Erro ao salvar tag.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Excluir esta tecnologia?')) return;
    await supabase.from('tecnologias_tags').delete().eq('id', id);
    setTags(tags.filter(t => t.id !== id));
  };

  if (loading) return <div className="animate-pulse h-32 bg-slate-200 rounded-xl" />;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-6 border-b border-slate-200 flex justify-between items-start">
        <div>
          <h3 className="text-lg font-bold text-slate-800">Tags de Tecnologia</h3>
          <p className="text-sm text-slate-500 mt-1">
            Cadastre tecnologias com categoria e importância para ordenar a seção de Ferramentas Técnicas.
          </p>
        </div>
        {!isEditing && (
          <button
            onClick={() => { setCurrentTag({ categoria: 'other', importancia: 0 }); setIsEditing(true); }}
            className="px-4 py-2 bg-primary text-on-primary rounded-lg text-sm font-medium hover:bg-primary/90 flex items-center gap-2 transition-all shrink-0"
          >
            <span className="material-symbols-outlined text-[18px]">add</span> Nova Tag
          </button>
        )}
      </div>

      {isEditing && (
        <form onSubmit={handleSave} className="p-6 bg-slate-50 border-b border-slate-200 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1 md:col-span-1">
              <label className="text-sm font-medium text-slate-700">Nome da Tecnologia *</label>
              <input
                required
                value={currentTag.nome || ''}
                onChange={e => setCurrentTag({ ...currentTag, nome: e.target.value })}
                placeholder="Ex: React, Docker, Python..."
                className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:ring-primary focus:border-primary"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700">Categoria</label>
              <select
                value={currentTag.categoria || 'other'}
                onChange={e => setCurrentTag({ ...currentTag, categoria: e.target.value as Tag['categoria'] })}
                className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:ring-primary focus:border-primary bg-white"
              >
                {catOptions.map(o => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700">
                Importância <span className="text-slate-400 font-normal">(maior = primeiro)</span>
              </label>
              <input
                type="number"
                min={0}
                max={100}
                value={currentTag.importancia ?? 0}
                onChange={e => setCurrentTag({ ...currentTag, importancia: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:ring-primary focus:border-primary"
              />
            </div>
          </div>
          <div className="flex gap-3 justify-end">
            <button type="button" onClick={() => { setIsEditing(false); setCurrentTag({}); }} className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-200 rounded-md transition-colors">
              Cancelar
            </button>
            <button type="submit" disabled={saving} className="px-4 py-2 bg-primary text-on-primary rounded-md text-sm font-medium hover:bg-primary/90 transition-colors flex items-center gap-1 disabled:opacity-60">
              <span className="material-symbols-outlined text-[18px]">check</span>
              {saving ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </form>
      )}

      {/* Tabela de tags */}
      <div>
        {tags.length === 0 ? (
          <div className="p-8 text-center text-slate-400">
            Nenhuma tecnologia cadastrada ainda. Adicione a primeira!
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Tecnologia</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Categoria</th>
                <th className="text-center px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Importância</th>
                <th className="w-20" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {tags.map(tag => (
                <tr key={tag.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-3 font-medium text-slate-800">{tag.nome}</td>
                  <td className="px-6 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${catColor[tag.categoria]}`}>
                      {catOptions.find(o => o.value === tag.categoria)?.label || tag.categoria}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-center text-slate-500 font-mono">{tag.importancia}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => { setCurrentTag(tag); setIsEditing(true); }}
                        className="p-1.5 text-slate-400 hover:text-primary hover:bg-primary/10 rounded-full transition-all"
                      >
                        <span className="material-symbols-outlined text-[18px]">edit</span>
                      </button>
                      <button
                        onClick={() => handleDelete(tag.id)}
                        className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
                      >
                        <span className="material-symbols-outlined text-[18px]">delete</span>
                      </button>
                    </div>
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
