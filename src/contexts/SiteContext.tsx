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
        const [profileRes, expRes, projRes, skillsRes, tagsRes] = await Promise.all([
          supabase.from('profile').select('*').limit(1).single(),
          supabase.from('experiencias').select('*').order('inicio', { ascending: false }),
          supabase.from('projetos').select('*').order('destaque', { ascending: false }).order('nome', { ascending: true }),
          supabase.from('habilidades').select('*, categorias_habilidades(*)').order('nome', { ascending: true }),
          supabase.from('tecnologias_tags').select('*').order('conhecimento', { ascending: false }).order('nome', { ascending: true })
        ]);

        const profile = profileRes.data;
        const experiences = expRes.data || [];
        const projects = projRes.data || [];
        const skillsDB = skillsRes.data || [];
        const tagsRegistry: { nome: string; categoria: string; conhecimento: number }[] = tagsRes.data || [];
        const tagsMap = new Map(tagsRegistry.map(t => [t.nome.toLowerCase(), t]));
        
        if (!profile) {
          setLoading(false); 
          return; // keep fallback if no profile is configured yet
        }

        // Mapear a data de início da experiência mais recente para cada tecnologia
        const techRecencyMap = new Map<string, string>(); // tech -> latest_date
        experiences.forEach(exp => {
          if (exp.tecnologias && exp.inicio) {
            const techs = exp.tecnologias.split(',').map((t: string) => t.trim().toLowerCase()).filter(Boolean);
            techs.forEach((t: string) => {
              const currentLatest = techRecencyMap.get(t);
              if (!currentLatest || exp.inicio > currentLatest) {
                techRecencyMap.set(t, exp.inicio);
              }
            });
          }
        });

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

        const formatarDecadas = (anos: number) => {
          const decadas = Math.floor(anos / 10);
          const resto = anos % 10;
          
          if (anos < 10) {
            return anos >= 8 ? "quase uma década" : `${anos} anos`;
          }

          const decadaStr = decadas === 1 ? "uma década" : `${decadas} décadas`;
          const proxDecadaStr = (decadas + 1) === 1 ? "uma decade" : `${decadas + 1} décadas`;

          if (resto === 0) return `${decadas} décadas`;
          if (resto >= 8) return `quase ${proxDecadaStr}`;
          return `mais de ${decadaStr}`;
        };

        const textoDecadas = formatarDecadas(anosDeExperiencia);

        // Extrair todas as tecnologias únicas das experiências + projetos
        const addUnique = (acc: string[], items: string[]) => {
          items.forEach(t => { if (t && !acc.find(x => x.toLowerCase() === t.toLowerCase())) acc.push(t); });
          return acc;
        };

        const allTechs: string[] = [];

        // Tags das experiências
        experiences.forEach((exp: any) => {
          if (exp.tecnologias) {
            const techs = exp.tecnologias.split(',').map((t: string) => t.trim()).filter(Boolean);
            addUnique(allTechs, techs);
          }
        });

        // Tags dos projetos
        projects.forEach((p: any) => {
          if (!p.tecnologias) return;
          const raw = Array.isArray(p.tecnologias) ? p.tecnologias : p.tecnologias.split(',');
          const techs = raw.map((t: string) => t.trim()).filter(Boolean);
          addUnique(allTechs, techs);
        });

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

        // Distribuir as tecnologias nas categorias
        const techByCategory: Record<string, { nome: string; conhecimento: number; lastDate: string }[]> = { frontend: [], backend: [], infrastructure: [], other: [] };
        const unclassified: string[] = [];
        allTechs.forEach(tech => {
          const techLower = tech.toLowerCase();
          const registered = tagsMap.get(techLower);
          const lastDate = techRecencyMap.get(techLower) || '1900-01-01';

          if (registered) {
            const cat = registered.categoria in techByCategory ? registered.categoria : 'other';
            techByCategory[cat].push({ nome: tech, conhecimento: registered.conhecimento, lastDate });
          } else {
            const cat = classifyTech(tech);
            if (cat) techByCategory[cat].push({ nome: tech, conhecimento: 1, lastDate });
            else unclassified.push(tech);
          }
        });

        // Categorias base
        const baseCategories = mappedCategories.length > 0
          ? mappedCategories.map(cat => ({ ...cat, tags: [] }))
          : fallbackData.skills.categories.map(cat => ({ ...cat, tags: [] }));

        const enrichedCategories: { id: string; icon: string; title: string; tags: string[] }[] = baseCategories.map(cat => ({
          ...cat,
          // Ordenar por conhecimento desc (estrelas), depois por data de recência desc, depois alfabeticamente
          tags: (techByCategory[cat.id] || [])
            .sort((a, b) => 
              (b.conhecimento - a.conhecimento) || 
              (b.lastDate.localeCompare(a.lastDate)) || 
              (a.nome.localeCompare(b.nome))
            )
            .map(t => t.nome)
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
            paragraphs: fallbackData.about.paragraphs.map((p, i) => 
              i === 1 ? p.replace(/Com (quase uma década|mais de \d+ décadas|quase \d+ décadas|\d+ décadas)/, `Com ${textoDecadas}`) : p
            ),
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
