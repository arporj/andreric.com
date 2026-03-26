import { siteData } from '../data/mockData';

export const About = () => {
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
          
          <div className="md:col-span-5 grid grid-cols-2 gap-4">
            {about.facts.map((fact, idx) => (
              <div key={idx} className="p-6 bg-surface-container-lowest rounded-DEFAULT shadow-sm border border-outline-variant border-opacity-5">
                <p className="text-xs font-bold text-primary uppercase mb-2">{fact.label}</p>
                <p className="font-medium">{fact.value}</p>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
};
