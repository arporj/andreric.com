import { useSiteData } from '../contexts/SiteContext';
import { usePDF } from '@react-pdf/renderer';
import { ResumePDF } from './pdf/ResumePDF';
import { saveAs } from 'file-saver';

export const Hero = () => {
  const { siteData } = useSiteData();
  const { hero } = siteData;

  const [instance] = usePDF({ document: <ResumePDF data={siteData} /> });

  return (
    <section className="relative min-h-screen flex items-center pt-20 px-8 overflow-hidden">
      <div className="max-w-7xl mx-auto w-full grid md:grid-cols-2 gap-12 items-center">
        <div className="space-y-8">
          <div className="space-y-2">
            <span className="text-primary font-semibold tracking-widest uppercase text-xs">{hero.upperSub}</span>
            <h1 className="text-[3.5rem] md:text-[5rem] font-extrabold leading-[1.1] tracking-tight text-on-surface">
              {hero.greetingPrefix} <span className="text-primary">{hero.name}</span>
            </h1>
            <p className="text-xl md:text-2xl text-on-surface-variant font-light max-w-lg leading-relaxed">
              {hero.description}
            </p>
          </div>
          <div className="flex flex-wrap gap-4 items-center">
            <a 
              className="px-8 py-4 bg-gradient-to-br from-primary to-primary-container text-on-primary rounded-full font-medium shadow-lg hover:-translate-y-1 transition-all duration-300 inline-block" 
              href={hero.primaryCta.href}
            >
              {hero.primaryCta.label}
            </a>
            <button
              className={`px-8 py-4 border border-outline-variant border-opacity-20 text-primary rounded-full font-medium transition-all duration-300 inline-block ${instance.loading || !instance.blob ? 'opacity-50 cursor-not-allowed' : 'hover:bg-surface-container-low'}`}
              onClick={(e) => {
                e.preventDefault();
                if (instance.loading || !instance.blob) return;

                // Força o salvamento via interceptação nativa file-saver (compatibilidade extrema multiplataforma)
                saveAs(instance.blob, 'Curriculo_Andre_Ricardo.pdf');
              }}
              disabled={instance.loading || !instance.blob}
            >
              {instance.loading ? 'Gerando CV...' : hero.secondaryCta.label}
            </button>

          </div>
        </div>
        
        <div className="relative hidden md:block">
          <div className="aspect-square rounded-xl overflow-hidden shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-700">
            <img 
              alt={hero.imageAlt} 
              className="w-full h-full object-contain object-top" 
              src={hero.imageSrc} 
            />
          </div>
          <div className="absolute -bottom-6 -left-6 p-6 bg-surface-container-lowest rounded-lg shadow-xl border border-outline-variant border-opacity-10">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-secondary-container rounded-full flex items-center justify-center">
                <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24", verticalAlign: "middle" }}>code</span>
              </div>
              <div>
                <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">{hero.badge.title}</p>
                <p className="text-lg font-bold text-on-surface">{hero.badge.value}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
