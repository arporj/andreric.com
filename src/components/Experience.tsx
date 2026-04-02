import { useState } from 'react';
import { useSiteData } from '../contexts/SiteContext';

const INITIAL_VISIBLE = 3;

/**
 * Parser inteligente de detalhes de experiência.
 * Detecta dois formatos:
 * 1. Lista simples (todas as linhas são atividades)
 * 2. Lista agrupada (linhas sem "-" no início = título de projeto/cliente,
 *    linhas com "-" = atividades daquele projeto)
 */
type ParsedGroup = { title: string | null; activities: string[] };

const parseDetails = (details: string[]): ParsedGroup[] => {
  const groups: ParsedGroup[] = [];
  let currentGroup: ParsedGroup | null = null;

  for (const line of details) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    const isActivity = trimmed.startsWith('-') || trimmed.startsWith('•');

    if (isActivity) {
      // Remove o marcador "-" ou "•" do início
      const cleanActivity = trimmed.replace(/^[-•]\s*/, '');
      if (!currentGroup) {
        // Atividades sem título — formato lista simples
        currentGroup = { title: null, activities: [] };
        groups.push(currentGroup);
      }
      currentGroup.activities.push(cleanActivity);
    } else {
      // É um título de projeto/cliente
      currentGroup = { title: trimmed, activities: [] };
      groups.push(currentGroup);
    }
  }

  return groups;
};

const hasProjectHeaders = (groups: ParsedGroup[]): boolean =>
  groups.some(g => g.title !== null);

export const Experience = () => {
  const { siteData } = useSiteData();
  const { experience } = siteData;
  const [expanded, setExpanded] = useState(false);

  const visibleItems = expanded ? experience.items : experience.items.slice(0, INITIAL_VISIBLE);
  const hasMore = experience.items.length > INITIAL_VISIBLE;

  return (
    <section className="py-24 px-8 bg-surface" id="experience">
      <div className="max-w-4xl mx-auto">
        
        <div className="mb-16 text-center">
          <h2 className="text-[1.75rem] font-bold text-on-surface tracking-tight">{experience.title}</h2>
          <div className="h-1 w-20 bg-primary mx-auto mt-4 rounded-full"></div>
        </div>
        
        <div className="relative">
          {/* Linha vertical da timeline */}
          <div className="absolute left-0 md:left-1/2 w-px bg-outline-variant opacity-20 top-0 bottom-0 pointer-events-none" />

          <div className="space-y-12">
            {visibleItems.map((item) => {
              const isLeft = item.align === 'left';
              const parsedGroups = parseDetails(item.details);
              const isGrouped = hasProjectHeaders(parsedGroups);

              return (
                <div key={item.id} className="relative pl-8 md:pl-0 md:flex items-center justify-between group">
                  
                  {/* Desktop timeline date wrapper */}
                  <div className={`hidden md:block md:w-[45%] ${isLeft ? 'md:pl-12 order-3' : 'text-right pr-12 order-1'}`}>
                    <span className="text-sm font-bold text-on-surface-variant uppercase tracking-widest">{item.period}</span>
                  </div>
                  
                  <div className="absolute left-[-4px] md:left-1/2 md:-ml-1 w-2 h-2 rounded-full bg-primary ring-4 ring-primary-container ring-opacity-20 z-10 transition-transform group-hover:scale-150 order-1 md:order-2"></div>
                  
                  <div className={`md:w-[45%] ${isLeft ? 'md:pr-12 md:order-1 order-2' : 'md:pl-12 order-3 md:order-3'}`}>
                    <div className={`p-8 bg-surface-container-lowest rounded-DEFAULT shadow-sm border border-outline-variant border-opacity-10 group-hover:shadow-lg transition-all duration-300 text-left ${isLeft ? 'md:text-right' : ''}`}>
                      <span className="md:hidden text-xs font-bold text-primary uppercase block mb-2">{item.period}</span>
                      <h3 className="font-bold text-primary">{item.company}</h3>
                      <p className="text-on-surface font-medium mb-4">{item.role}</p>

                      {isGrouped ? (
                        /* Formato agrupado: múltiplos projetos/clientes */
                        <div className="space-y-4">
                          {parsedGroups.map((group, gIdx) => (
                            <div key={gIdx}>
                              {group.title && (
                                <div className={`flex items-center gap-2 mb-2 ${isLeft ? 'md:justify-end' : ''}`}>
                                  <span
                                    className="material-symbols-outlined text-primary text-sm"
                                    style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 20" }}
                                  >
                                    folder_open
                                  </span>
                                  <span className="text-sm font-semibold text-on-surface">{group.title}</span>
                                </div>
                              )}
                              {group.activities.length > 0 && (
                                <ul className={`space-y-1 text-on-surface-variant text-sm ${isLeft ? 'md:list-none md:pr-5' : 'list-disc list-inside pl-5'}`}>
                                  {group.activities.map((act, aIdx) => (
                                    <li key={aIdx}>{act}</li>
                                  ))}
                                </ul>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        /* Formato simples: lista plana de atividades */
                        <ul className={`space-y-2 text-on-surface-variant text-sm ${isLeft ? 'md:list-none space-y-2' : 'list-disc list-inside'}`}>
                          {parsedGroups.flatMap(g => g.activities).map((activity, idx) => (
                            <li key={idx}>{activity}</li>
                          ))}
                        </ul>
                      )}

                      {item.tecnologias && (
                        <div className={`mt-4 pt-4 border-t border-outline-variant/10 ${isLeft ? 'md:pr-2' : 'pl-2'}`}>
                          <span className="text-xs font-bold text-on-surface-variant uppercase tracking-widest block mb-3">Tecnologias Utilizadas</span>
                          <div className={`flex flex-wrap gap-2 ${isLeft ? 'md:justify-end' : ''}`}>
                            {item.tecnologias.split(',').map((tech: string, i: number) => {
                              const trimmed = tech.trim();
                              if (!trimmed) return null;
                              return (
                                <span key={i} className="px-3 py-1 bg-surface-container-highest text-on-surface text-xs font-semibold rounded-full border border-outline-variant/20 hover:border-primary/50 transition-colors cursor-default">
                                  {trimmed}
                                </span>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        </div>

        {/* Botão mostrar mais / menos */}
        {hasMore && (
          <div className="mt-16 flex flex-col items-center gap-3">
            <button
              onClick={() => setExpanded(prev => !prev)}
              className="group flex items-center gap-2 px-8 py-3 border border-outline-variant/30 rounded-full text-sm font-semibold text-primary hover:bg-primary hover:text-on-primary hover:border-primary transition-all duration-300 shadow-sm hover:shadow-md"
            >
              <span>{expanded ? 'Recolher histórico' : `Ver toda a jornada (${experience.items.length - INITIAL_VISIBLE} item${experience.items.length - INITIAL_VISIBLE > 1 ? 's' : ''} ocult${experience.items.length - INITIAL_VISIBLE > 1 ? 'os' : 'o'})`}</span>
              <span
                className="material-symbols-outlined text-base transition-transform duration-300"
                style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 20", verticalAlign: 'middle', transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)' }}
              >
                expand_more
              </span>
            </button>
            {!expanded && (
              <p className="text-xs text-on-surface-variant opacity-60">
                Exibindo as 3 experiências mais recentes
              </p>
            )}
          </div>
        )}

      </div>
    </section>
  );
};
