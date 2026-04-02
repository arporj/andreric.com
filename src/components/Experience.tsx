import { useState } from 'react';
import { useSiteData } from '../contexts/SiteContext';

const INITIAL_VISIBLE = 3;

/**
 * Parser inteligente de detalhes de experiência.
 * Detecta três níveis:
 * 1. Grupo (sem "-" = título de projeto/cliente)
 * 2. Atividade ("-" = bullet principal)
 * 3. Sub-atividade ("--" = bullet aninhado)
 */
type Activity = { text: string; subActivities: string[] };
type ParsedGroup = { title: string | null; activities: Activity[] };

const parseDetails = (details: string[]): ParsedGroup[] => {
  const groups: ParsedGroup[] = [];
  let currentGroup: ParsedGroup | null = null;
  let lastActivity: Activity | null = null;

  for (const line of details) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    const isSubActivity = trimmed.startsWith('--');
    const isActivity = !isSubActivity && (trimmed.startsWith('-') || trimmed.startsWith('•'));

    if (isSubActivity) {
      const cleanSub = trimmed.replace(/^--\s*/, '');
      if (lastActivity) {
        lastActivity.subActivities.push(cleanSub);
      } else {
        // Fallback caso comece com -- sem ter um item pai
        if (!currentGroup) {
          currentGroup = { title: null, activities: [] };
          groups.push(currentGroup);
        }
        const orphanedActivity = { text: cleanSub, subActivities: [] };
        currentGroup.activities.push(orphanedActivity);
        lastActivity = orphanedActivity;
      }
    } else if (isActivity) {
      const cleanActivity = trimmed.replace(/^[-•]\s*/, '');
      if (!currentGroup) {
        currentGroup = { title: null, activities: [] };
        groups.push(currentGroup);
      }
      lastActivity = { text: cleanActivity, subActivities: [] };
      currentGroup.activities.push(lastActivity);
    } else {
      currentGroup = { title: trimmed, activities: [] };
      groups.push(currentGroup);
      lastActivity = null;
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
      <div className="max-w-3xl mx-auto">
        
        {/* Section Header */}
        <div className="mb-16 text-center">
          <h2 className="text-[1.75rem] font-bold text-on-surface tracking-tight">{experience.title}</h2>
          <div className="h-1 w-20 bg-primary mx-auto mt-4 rounded-full"></div>
        </div>
        
        {/* Timeline */}
        <div className="relative pl-8">
          {/* Linha vertical da timeline */}
          <div className="absolute left-[11px] top-2 bottom-2 w-px bg-outline-variant/30" />

          <div className="space-y-10">
            {visibleItems.map((item) => {
              const parsedGroups = parseDetails(item.details);
              const isGrouped = hasProjectHeaders(parsedGroups);

              return (
                <div key={item.id} className="relative group">
                  
                  {/* Dot marker */}
                  <div className="absolute -left-8 top-8 flex items-center justify-center">
                    <div className="w-[10px] h-[10px] rounded-full bg-primary ring-4 ring-surface transition-transform duration-300 group-hover:scale-150" />
                  </div>

                  {/* Card */}
                  <div className="p-6 md:p-8 bg-surface-container-lowest rounded-DEFAULT shadow-sm hover:shadow-lg transition-all duration-300" style={{ boxShadow: '0 1px 3px rgba(15, 23, 42, 0.04)' }}>
                    
                    {/* Period */}
                    <span className="text-[0.6875rem] font-bold text-on-surface-variant uppercase tracking-[0.05em] block mb-3">
                      {item.period}
                    </span>

                    {/* Company & Role */}
                    <h3 className="text-lg font-bold text-primary leading-tight">{item.company}</h3>
                    <p className="text-on-surface font-medium mt-1 mb-5">{item.role}</p>

                    {/* Content */}
                    {isGrouped ? (
                      <div className="space-y-5">
                        {parsedGroups.map((group, gIdx) => (
                          <div key={gIdx}>
                            {group.title && (
                              <div className="flex items-center gap-2 mb-2">
                                <span
                                  className="material-symbols-outlined text-primary text-base"
                                  style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 20" }}
                                >
                                  folder_open
                                </span>
                                <span className="text-sm font-semibold text-on-surface">{group.title}</span>
                              </div>
                            )}
                            {group.activities.length > 0 && (
                              <ul className="space-y-3 text-on-surface-variant text-sm leading-relaxed ml-6">
                                {group.activities.map((act, aIdx) => (
                                  <li key={aIdx} className="space-y-2">
                                    <div className="flex items-start gap-2">
                                      <span className="text-primary mt-[7px] shrink-0 block w-1.5 h-1.5 rounded-full bg-primary/60" />
                                      <span>{act.text}</span>
                                    </div>
                                    {act.subActivities.length > 0 && (
                                      <ul className="space-y-1.5 ml-6 border-l border-outline-variant/20 pl-4">
                                        {act.subActivities.map((sub, sIdx) => (
                                          <li key={sIdx} className="flex items-start gap-2 text-on-surface-variant/80 text-[0.85rem]">
                                            <span className="mt-[6px] shrink-0 block w-1 h-px bg-on-surface-variant/30" />
                                            <span>{sub}</span>
                                          </li>
                                        ))}
                                      </ul>
                                    )}
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <ul className="space-y-4 text-on-surface-variant text-sm leading-relaxed">
                        {parsedGroups.flatMap(g => g.activities).map((act, idx) => (
                          <li key={idx} className="space-y-2">
                            <div className="flex items-start gap-2">
                              <span className="mt-[7px] shrink-0 block w-1.5 h-1.5 rounded-full bg-primary/60" />
                              <span>{act.text}</span>
                            </div>
                            {act.subActivities.length > 0 && (
                              <ul className="space-y-1.5 ml-6 border-l border-outline-variant/20 pl-4">
                                {act.subActivities.map((sub, sIdx) => (
                                  <li key={sIdx} className="flex items-start gap-2 text-on-surface-variant/80 text-[0.85rem]">
                                    <span className="mt-[6px] shrink-0 block w-1 h-px bg-on-surface-variant/30" />
                                    <span>{sub}</span>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </li>
                        ))}
                      </ul>
                    )}

                    {/* Tech Tags */}
                    {item.tecnologias && (
                      <div className="mt-5 pt-5 border-t border-outline-variant/10">
                        <div className="flex flex-wrap gap-2">
                          {item.tecnologias.split(',').map((tech: string, i: number) => {
                            const trimmed = tech.trim();
                            if (!trimmed) return null;
                            return (
                              <span
                                key={i}
                                className="px-3 py-1 bg-secondary-container text-on-secondary-container text-xs font-medium rounded-full transition-colors hover:bg-primary-fixed-dim hover:text-on-primary-fixed cursor-default"
                              >
                                {trimmed}
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    )}
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
