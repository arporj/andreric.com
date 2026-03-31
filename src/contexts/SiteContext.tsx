import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { siteData as fallbackData } from '../data/mockData';

type SiteDataContextType = {
  siteData: typeof fallbackData;
  loading: boolean;
};

const SiteDataContext = createContext<SiteDataContextType>({
  siteData: fallbackData,
  loading: true
});

export const useSiteData = () => useContext(SiteDataContext);

export const SiteDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState(fallbackData);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileRes, expRes, projRes, skillsRes] = await Promise.all([
          supabase.from('profile').select('*').limit(1).single(),
          supabase.from('experiencias').select('*').order('inicio', { ascending: false }),
          supabase.from('projetos').select('*').order('destaque', { ascending: false }).order('nome', { ascending: true }),
          supabase.from('habilidades').select('*, categorias_habilidades(*)').order('nome', { ascending: true })
        ]);

        const profile = profileRes.data;
        const experiences = expRes.data || [];
        const projects = projRes.data || [];
        const skillsDB = skillsRes.data || [];
        
        if (!profile) {
          setLoading(false); 
          return; // keep fallback if no profile is configured yet
        }

        // Map DB skills to mockData categories format
        const catsMap = new Map();
        skillsDB.forEach((s: any) => {
          if (!s.categorias_habilidades) return;
          const catId = s.categorias_habilidades.id;
          if (!catsMap.has(catId)) {
            catsMap.set(catId, {
              id: catId,
              icon: s.categorias_habilidades.icone,
              title: s.categorias_habilidades.nome,
              tags: []
            });
          }
          catsMap.get(catId).tags.push(s.nome);
        });
        
        const mappedCategories = Array.from(catsMap.values());

        // Map everything to match exactly the mockData.ts interface
        const mappedData = {
          header: { ...fallbackData.header },
          hero: {
            ...fallbackData.hero,
            name: profile.nome || fallbackData.hero.name,
            upperSub: profile.titulo || fallbackData.hero.upperSub,
            description: profile.resumo || fallbackData.hero.description,
            imageSrc: profile.foto_url || fallbackData.hero.imageSrc,
          },
          about: {
            ...fallbackData.about,
            facts: [
              { label: 'Localização', value: profile.cidade ? `${profile.cidade}, ${profile.pais}` : fallbackData.about.facts[0].value },
              { label: 'E-mail', value: profile.email || 'Não informado' },
              { label: 'Telefone', value: profile.telefone || 'Não informado' },
              { label: 'Site URL', value: profile.site_url || 'Disponível' }
            ]
          },
          experience: {
            ...fallbackData.experience,
            items: experiences.length > 0 ? experiences.map((exp: any, i: number) => ({
              id: exp.id,
              period: `${new Date(exp.inicio).getFullYear()} — ${exp.fim ? new Date(exp.fim).getFullYear() : 'Presente'}`,
              role: exp.cargo,
              company: exp.empresa,
              details: exp.descricao || [],
              align: i % 2 === 0 ? 'right' : 'left'
            })) : fallbackData.experience.items
          },
          skills: {
            ...fallbackData.skills,
            categories: mappedCategories.length > 0 ? mappedCategories : fallbackData.skills.categories
          },
          projects: {
            ...fallbackData.projects,
            items: projects.length > 0 ? projects.map((p: any) => ({
              id: p.id,
              imageSrc: p.imagem_url,
              imageAlt: p.nome,
              tags: p.tecnologias || [],
              title: p.nome,
              description: p.descricao,
              demoLink: p.url || '#',
              githubLink: p.repo_url || '#'
            })) : fallbackData.projects.items
          },
          contact: {
            ...fallbackData.contact,
            email: profile.email || fallbackData.contact.email
          },
          footer: {
            ...fallbackData.footer,
            links: {
              linkedin: profile.linkedin_url || fallbackData.footer.links.linkedin,
              github: profile.github_url || fallbackData.footer.links.github,
              email: profile.email ? `mailto:${profile.email}` : fallbackData.footer.links.email
            }
          }
        };

        setData(mappedData);
      } catch (err) {
        console.error('Failed to fetch site data from Supabase', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  return (
    <SiteDataContext.Provider value={{ siteData: data, loading }}>
      {children}
    </SiteDataContext.Provider>
  );
};
