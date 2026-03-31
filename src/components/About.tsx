import { useSiteData } from '../contexts/SiteContext';

export const About = () => {
  const { siteData } = useSiteData();
  const { about } = siteData;

  return (
    <section className="py-24 px-8 bg-surface-container-low" id="about">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-12 gap-16">
          
          <div className="md:col-span-7 space-y-6">
            <h2 className="text-[1.75rem] font-bold text-on-surface tracking-tight">{about.title}</h2>
            <div className="space-y-4 text-on-surface-variant leading-relaxed text-lg">
              {about.paragraphs.map((p, idx) => (
                <p key={idx}>{p}</p>
              ))}
            </div>
          </div>
          
          <div className="md:col-span-5 flex flex-col gap-4">
            {about.facts.map((fact: any, idx: number) => {
              const content = (
                <>
                  <p className="text-xs font-bold text-primary uppercase mb-2">{fact.label}</p>
                  <p className="font-medium text-on-surface">{fact.value}</p>
                </>
              );
              
              const className = "p-6 bg-surface-container-lowest rounded-DEFAULT shadow-sm border border-outline-variant border-opacity-5 transition-all w-full text-left";
              
              if (fact.href) {
                return (
                  <a key={idx} href={fact.href} target="_blank" rel="noreferrer" className={`${className} hover:border-primary/30 hover:shadow-md cursor-pointer block`}>
                    {content}
                  </a>
                );
              }
              
              return (
                <div key={idx} className={className}>
                  {content}
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
};
