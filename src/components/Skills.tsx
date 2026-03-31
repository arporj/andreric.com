import { useSiteData } from '../contexts/SiteContext';

export const Skills = () => {
  const { siteData } = useSiteData();
  const { skills } = siteData;

  return (
    <section className="py-24 px-8 bg-surface-container-low" id="skills">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-[1.75rem] font-bold text-on-surface tracking-tight mb-12">{skills.title}</h2>
        <div className="grid md:grid-cols-2 gap-8">
          
          {skills.categories.map((category) => (
            <div key={category.id} className="p-10 bg-surface-container-lowest rounded-xl shadow-sm">
              <div className="w-12 h-12 bg-secondary-container rounded-full flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24", verticalAlign: "middle" }}>{category.icon}</span>
              </div>
              <h3 className="text-xl font-bold mb-6">{category.title}</h3>
              <div className="flex flex-wrap gap-2">
                {category.tags.map(tag => (
                  <span key={tag} className="px-4 py-1.5 bg-secondary-container text-on-secondary-container rounded-full text-xs font-medium">{tag}</span>
                ))}
              </div>
            </div>
          ))}
          
        </div>
      </div>
    </section>
  );
};
