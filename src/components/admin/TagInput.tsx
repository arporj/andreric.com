import { useEffect, useRef, useState } from 'react';
import { supabase } from '../../lib/supabase';

type Tag = {
  id: string;
  nome: string;
  categoria: string;
  importancia: number;
};

type Props = {
  value: string;           // CSV string ex: "React, Node.js"
  onChange: (csv: string) => void;
  placeholder?: string;
  label?: string;
};

export function TagInput({ value, onChange, placeholder = 'Adicione tecnologias...', label }: Props) {
  const [allTags, setAllTags] = useState<Tag[]>([]);
  const [inputText, setInputText] = useState('');
  const [suggestions, setSuggestions] = useState<Tag[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Parse CSV value into selected array on mount/change
  useEffect(() => {
    const parsed = value
      ? value.split(',').map(t => t.trim()).filter(Boolean)
      : [];
    setSelected(parsed);
  }, []);

  // Fetch all tags from DB
  useEffect(() => {
    supabase
      .from('tecnologias_tags')
      .select('*')
      .order('importancia', { ascending: false })
      .order('nome', { ascending: true })
      .then(({ data }) => {
        if (data) setAllTags(data);
      });
  }, []);

  // Filter suggestions based on input
  useEffect(() => {
    if (!inputText.trim()) {
      setSuggestions([]);
      setShowDropdown(false);
      return;
    }
    const lower = inputText.toLowerCase();
    const filtered = allTags.filter(
      t => t.nome.toLowerCase().includes(lower) && !selected.includes(t.nome)
    );
    setSuggestions(filtered);
    setShowDropdown(true);
  }, [inputText, allTags, selected]);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        dropdownRef.current && !dropdownRef.current.contains(e.target as Node) &&
        inputRef.current && !inputRef.current.contains(e.target as Node)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const emitChange = (tags: string[]) => {
    onChange(tags.join(', '));
  };

  const addTag = async (nome: string) => {
    const trimmed = nome.trim();
    if (!trimmed || selected.includes(trimmed)) return;

    // Check if it doesn't exist in DB → create it without classification
    const exists = allTags.find(t => t.nome.toLowerCase() === trimmed.toLowerCase());
    if (!exists) {
      const { data } = await supabase
        .from('tecnologias_tags')
        .insert([{ nome: trimmed, categoria: 'other', importancia: 0 }])
        .select()
        .single();
      if (data) setAllTags(prev => [...prev, data]);
    }

    const newSelected = [...selected, exists ? exists.nome : trimmed];
    setSelected(newSelected);
    emitChange(newSelected);
    setInputText('');
    setSuggestions([]);
    setShowDropdown(false);
    inputRef.current?.focus();
  };

  const removeTag = (nome: string) => {
    const newSelected = selected.filter(t => t !== nome);
    setSelected(newSelected);
    emitChange(newSelected);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === 'Enter' || e.key === ',') && inputText.trim()) {
      e.preventDefault();
      addTag(inputText.replace(',', '').trim());
    }
    if (e.key === 'Backspace' && !inputText && selected.length > 0) {
      removeTag(selected[selected.length - 1]);
    }
  };

  const catLabel: Record<string, string> = {
    frontend: 'Frontend',
    backend: 'Backend',
    infrastructure: 'Infra',
    other: 'Outro',
  };
  const catColor: Record<string, string> = {
    frontend: 'text-blue-600',
    backend: 'text-green-600',
    infrastructure: 'text-orange-600',
    other: 'text-slate-400',
  };

  return (
    <div className="space-y-1">
      {label && <label className="text-sm font-medium text-slate-700">{label}</label>}

      <div
        className="min-h-[42px] flex flex-wrap gap-1.5 p-2 border border-slate-300 rounded-md bg-white cursor-text focus-within:ring-2 focus-within:ring-primary/30 focus-within:border-primary transition-all"
        onClick={() => inputRef.current?.focus()}
      >
        {selected.map(tag => (
          <span
            key={tag}
            className="flex items-center gap-1 px-2 py-0.5 bg-primary/10 text-primary text-xs font-semibold rounded-md"
          >
            {tag}
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); removeTag(tag); }}
              className="hover:text-red-500 transition-colors leading-none"
            >
              <span className="material-symbols-outlined text-[14px]" style={{ verticalAlign: 'middle' }}>close</span>
            </button>
          </span>
        ))}
        <input
          ref={inputRef}
          value={inputText}
          onChange={e => setInputText(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => inputText && setShowDropdown(true)}
          placeholder={selected.length === 0 ? placeholder : ''}
          className="flex-1 min-w-[120px] outline-none text-sm text-slate-700 bg-transparent placeholder:text-slate-400"
        />
      </div>

      {/* Dropdown */}
      {showDropdown && (
        <div
          ref={dropdownRef}
          className="relative z-50"
        >
          <div className="absolute top-0 left-0 right-0 bg-white border border-slate-200 rounded-lg shadow-xl max-h-52 overflow-y-auto">
            {suggestions.length > 0 ? (
              suggestions.map(tag => (
                <button
                  key={tag.id}
                  type="button"
                  onMouseDown={() => addTag(tag.nome)}
                  className="w-full flex items-center justify-between px-3 py-2 hover:bg-slate-50 transition-colors text-left"
                >
                  <span className="text-sm font-medium text-slate-800">{tag.nome}</span>
                  <span className={`text-[10px] font-bold uppercase ${catColor[tag.categoria] || 'text-slate-400'}`}>
                    {catLabel[tag.categoria] || tag.categoria}
                  </span>
                </button>
              ))
            ) : (
              <button
                type="button"
                onMouseDown={() => addTag(inputText)}
                className="w-full flex items-center gap-2 px-3 py-2 hover:bg-slate-50 text-left text-sm text-slate-600"
              >
                <span className="material-symbols-outlined text-[16px] text-primary">add_circle</span>
                Adicionar <strong className="text-slate-800">"{inputText.trim()}"</strong> como nova tecnologia
              </button>
            )}
          </div>
        </div>
      )}

      <p className="text-xs text-slate-400">Digite e pressione Enter ou vírgula para adicionar. Novas tecnologias são criadas automaticamente.</p>
    </div>
  );
}
