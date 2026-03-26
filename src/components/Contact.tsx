import { siteData } from '../data/mockData';

export const Contact = () => {
  const { contact } = siteData;

  return (
    <section className="py-24 px-8 bg-surface-container-high" id="contact">
      <div className="max-w-4xl mx-auto text-center space-y-8">
        <h2 className="text-[3rem] font-extrabold tracking-tight text-on-surface">
          {contact.titlePrefix} <span className="text-primary italic">{contact.titleHighlight}</span>
        </h2>
        <p className="text-xl text-on-surface-variant max-w-2xl mx-auto font-light">
          {contact.description}
        </p>
        <div className="pt-8">
          <a 
            className="inline-flex items-center gap-3 px-10 py-5 bg-on-surface text-surface rounded-full text-lg font-bold hover:scale-105 transition-all shadow-xl" 
            href={`mailto:${contact.email}`}
          >
            {contact.ctaLabel}
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24", verticalAlign: "middle" }}>arrow_forward</span>
          </a>
        </div>
      </div>
    </section>
  );
};
