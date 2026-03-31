import { useSiteData } from '../contexts/SiteContext';

export const Experience = () => {
  const { siteData } = useSiteData();
  const { experience } = siteData;

  return (
    <section className="py-24 px-8 bg-surface" id="experience">
      <div className="max-w-4xl mx-auto">
        
        <div className="mb-16 text-center">
          <h2 className="text-[1.75rem] font-bold text-on-surface tracking-tight">{experience.title}</h2>
          <div className="h-1 w-20 bg-primary mx-auto mt-4 rounded-full"></div>
        </div>
        
        <div className="space-y-12 relative before:content-[''] before:absolute before:left-0 md:before:left-1/2 before:w-px before:h-full before:bg-outline-variant before:opacity-20">
          
          {experience.items.map((item) => {
            const isLeft = item.align === 'left';
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
                    <ul className={`space-y-2 text-on-surface-variant text-sm ${isLeft ? 'md:list-none space-y-2' : 'list-disc list-inside'}`}>
                      {item.details.map((detail, idx) => (
                        <li key={idx}>{detail}</li>
                      ))}
                    </ul>
                    {item.tecnologias && (
                      <div className={`mt-4 pt-4 border-t border-outline-variant/10 ${isLeft ? 'md:pr-2' : 'pl-2'}`}>
                        <span className="text-xs font-bold text-on-surface-variant uppercase tracking-widest block mb-1">Tecnologias Utilizadas</span>
                        <p className="text-sm text-on-surface leading-relaxed">{item.tecnologias}</p>
                      </div>
                    )}
                  </div>
                </div>

              </div>
            );
          })}
          
        </div>
      </div>
    </section>
  );
};
