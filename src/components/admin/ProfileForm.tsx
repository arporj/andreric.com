import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';

export function ProfileForm() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  
  // Table fields: bg data mapping
  const [formData, setFormData] = useState({
    id: '',
    nome: '',
    titulo: '',
    resumo: '',
    email: '',
    telefone: '',
    cidade: '',
    pais: 'Brasil',
    foto_url: '',
    linkedin_url: '',
    github_url: '',
    site_url: ''
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profile')
        .select('*')
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setFormData(data);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ text: '', type: '' });

    try {
      if (formData.id) {
        // Update existing
        const { error } = await supabase
          .from('profile')
          .update({
            ...formData,
            updated_at: new Date().toISOString()
          })
          .eq('id', formData.id);
        if (error) throw error;
      } else {
        // Insert new (if table is completely empty)
        const { id, ...insertData } = formData;
        const { data, error } = await supabase
          .from('profile')
          .insert([insertData])
          .select()
          .single();
        if (error) throw error;
        if (data) setFormData(data);
      }
      
      setMessage({ text: 'Perfil salvo com sucesso!', type: 'success' });
    } catch (error: any) {
      console.error('Error saving profile:', error);
      setMessage({ text: `Erro ao salvar: ${error.message}`, type: 'error' });
    } finally {
      setSaving(false);
      setTimeout(() => setMessage({ text: '', type: '' }), 5000);
    }
  };

  if (loading) {
    return <div className="animate-pulse flex space-x-4"><div className="h-4 bg-slate-200 rounded w-1/4"></div></div>;
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-6 border-b border-slate-200">
        <h3 className="text-lg font-bold text-slate-800">Informações Pessoais</h3>
        <p className="text-sm text-slate-500 mt-1">Esses dados aparecerão no Hero e no rodapé do seu site.</p>
      </div>
      
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        
        {message.text && (
          <div className={`p-4 rounded-lg text-sm font-medium ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
            {message.text}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Nome Completo</label>
            <input 
              required
              name="nome"
              value={formData.nome || ''}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all" 
              placeholder="Ex: André Ric"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Título / Cargo Principal</label>
            <input 
              name="titulo"
              value={formData.titulo || ''}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all" 
              placeholder="Ex: Senior Systems Architect"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700">Resumo (Biografia do Hero)</label>
          <textarea 
            name="resumo"
            value={formData.resumo || ''}
            onChange={handleChange}
            rows={4}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all resize-none" 
            placeholder="Um breve texto apresentando você e seu trabalho..."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">E-mail de Contato</label>
            <input 
              type="email"
              name="email"
              value={formData.email || ''}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all" 
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Celular / Telefone</label>
            <input 
              name="telefone"
              value={formData.telefone || ''}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all" 
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Cidade</label>
            <input 
              name="cidade"
              value={formData.cidade || ''}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all" 
            />
          </div>
        </div>

        <div className="space-y-4 pt-4 border-t border-slate-100">
          <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Links e Redes Sociais</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 text-slate-700">Foto URL (Avatar Hero)</label>
              <input 
                name="foto_url"
                value={formData.foto_url || ''}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all" 
                placeholder="https://"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 text-slate-700">LinkedIn URL</label>
              <input 
                name="linkedin_url"
                value={formData.linkedin_url || ''}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all" 
                placeholder="https://linkedin.com/in/..."
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 text-slate-700">GitHub URL</label>
              <input 
                name="github_url"
                value={formData.github_url || ''}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all" 
                placeholder="https://github.com/..."
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-6 border-t border-slate-200">
          <button 
            type="submit" 
            disabled={saving}
            className="px-6 py-2.5 bg-primary text-on-primary font-medium rounded-lg shadow-sm hover:shadow-md hover:translate-y-[-1px] transition-all disabled:opacity-70 disabled:pointer-events-none flex items-center gap-2"
          >
            {saving ? (
               <><span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin"></span> Salvando...</>
            ) : (
               <><span className="material-symbols-outlined text-[20px]">save</span> Salvar Alterações</>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
