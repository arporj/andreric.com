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

        const formatarMesAno = (data: string | null) => {
          if (!data) return 'Presente';
          const [year, month] = data.split('-');
          return `${month}/${year}`;
        };

        const anosDeExperiencia = experiences.length > 0 
          ? new Date().getFullYear() - new Date(experiences[experiences.length - 1].inicio).getFullYear() 
          : 0;

        // Extrair todas as tecnologias únicas das experiências
        const allTechs: string[] = experiences.reduce((acc: string[], exp: any) => {
          if (exp.tecnologias) {
            const techs = exp.tecnologias.split(',').map((t: string) => t.trim()).filter(Boolean);
            techs.forEach((t: string) => { if (!acc.includes(t)) acc.push(t); });
          }
          return acc;
        }, []);

        // Classificador de tecnologias por categoria
        const frontendKeywords = [
          'react', 'next', 'vue', 'angular', 'svelte', 'typescript', 'javascript', 'html', 'css',
          'tailwind', 'sass', 'styled', 'framer', 'three.js', 'webpack', 'vite', 'figma',
          'bootstrap', 'material', 'jquery', 'redux', 'zustand', 'graphql client', 'flutter',
          'ionic', 'expo', 'gatsby', 'nuxt', 'remix', 'astro', 'delphi', 'visual basic', 'vb',
          'asp.net', 'blazor', 'wpf', 'winforms', 'swing', 'javafx'
        ];
        const backendKeywords = [
          'node', 'python', 'java', 'php', 'ruby', 'go', 'rust', 'c#', '.net', 'laravel',
          'django', 'flask', 'fastapi', 'spring', 'express', 'nestjs', 'graphql', 'rest',
          'postgres', 'mysql', 'sql', 'mongodb', 'redis', 'supabase', 'firebase', 'prisma',
          'sequelize', 'typeorm', 'api', 'backend', 'microservice', 'rabbitmq', 'kafka',
          'socket', 'websocket', 'auth', 'jwt', 'oauth', 'stripe', 'access', 'oracle', 'sql server'
        ];
        const infraKeywords = [
          'docker', 'kubernetes', 'aws', 'gcp', 'azure', 'terraform', 'ci/cd', 'github actions',
          'jenkins', 'ansible', 'nginx', 'linux', 'bash', 'git', 'vercel', 'netlify', 'heroku',
          'cloudflare', 'monitoring', 'datadog', 'prometheus', 'grafana', 'elk', 'devops',
          'k8s', 'helm', 'pulumi', 'cloud', 'deploy', 'pipeline', 'agile', 'scrum'
        ];

        const classifyTech = (tech: string): 'frontend' | 'backend' | 'infrastructure' | null => {
          const lower = tech.toLowerCase();
          if (frontendKeywords.some(k => lower.includes(k))) return 'frontend';
          if (backendKeywords.some(k => lower.includes(k))) return 'backend';
          if (infraKeywords.some(k => lower.includes(k))) return 'infrastructure';
          return null;
        };

        // Distribuir as tecnologias nas categorias existentes
        const techByCategory: Record<string, string[]> = { frontend: [], backend: [], infrastructure: [] };
        const unclassified: string[] = [];
        allTechs.forEach(tech => {
          const cat = classifyTech(tech);
          if (cat) techByCategory[cat].push(tech);
          else unclassified.push(tech);
        });

        // Enriquecer as categorias base com as tecnologias classificadas
        const baseCategories = mappedCategories.length > 0 ? mappedCategories : fallbackData.skills.categories;
        const enrichedCategories = baseCategories.map(cat => ({
          ...cat,
          tags: [...new Set([...cat.tags, ...(techByCategory[cat.id] || [])])]
        }));

        // Se houver tecnologias não classificadas, adicionar numa categoria extra
        if (unclassified.length > 0) {
          enrichedCategories.push({
            id: 'other-tech',
            icon: 'devices',
            title: 'Outras Ferramentas',
            tags: unclassified
          });
        }

        // Map everything to match exactly the mockData.ts interface
        const mappedData = {
          header: { ...fallbackData.header },
          hero: {
            ...fallbackData.hero,
            name: profile.nome || fallbackData.hero.name,
            upperSub: profile.titulo || fallbackData.hero.upperSub,
            description: profile.resumo || fallbackData.hero.description,
            imageSrc: profile.foto_url || fallbackData.hero.imageSrc,
            badge: {
              ...fallbackData.hero.badge,
              value: `${anosDeExperiencia}+ Anos`
            }
          },
          about: {
            ...fallbackData.about,
            facts: [
              { label: 'Localização', value: profile.cidade ? `${profile.cidade}, ${profile.pais}` : fallbackData.about.facts[0].value },
              { label: 'E-mail', value: profile.email || 'Não informado', href: profile.email ? `mailto:${profile.email}` : undefined },
              { label: 'Telefone', value: profile.telefone || 'Não informado', href: profile.telefone ? `https://wa.me/${profile.telefone.replace(/\D/g, '')}` : undefined }
            ]
          },
          experience: {
            ...fallbackData.experience,
            items: experiences.length > 0 ? experiences.map((exp: any, i: number) => ({
              id: exp.id,
              period: `De ${formatarMesAno(exp.inicio)} até ${formatarMesAno(exp.fim)}`,
              role: exp.cargo,
              company: exp.empresa,
              details: exp.descricao || [],
              tecnologias: exp.tecnologias || null,
              align: i % 2 === 0 ? 'right' : 'left'
            })) : fallbackData.experience.items
          },
          skills: {
            ...fallbackData.skills,
            categories: enrichedCategories
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
