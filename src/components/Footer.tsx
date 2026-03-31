import { useSiteData } from '../contexts/SiteContext';

export const Footer = () => {
  const { siteData } = useSiteData();
  const { footer } = siteData;

  return (
    <footer className="bg-slate-50 border-t border-outline-variant border-opacity-10 py-12 px-8">
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 max-w-7xl mx-auto">
        <div className="text-xs font-['Inter'] uppercase tracking-widest text-slate-500">
          {footer.copyright}
        </div>
        <div className="flex items-center gap-8">
          <a className="text-slate-400 hover:text-blue-500 transition-colors hover:-translate-y-1 transition-transform duration-300" href={footer.links.linkedin}>
            <span className="sr-only">LinkedIn</span>
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24", verticalAlign: "middle" }}>link</span>
          </a>
          <a className="text-slate-400 hover:text-blue-500 transition-colors hover:-translate-y-1 transition-transform duration-300" href={footer.links.github}>
            <span className="sr-only">GitHub</span>
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24", verticalAlign: "middle" }}>terminal</span>
          </a>
          <a className="text-slate-400 hover:text-blue-500 transition-colors hover:-translate-y-1 transition-transform duration-300" href={footer.links.email}>
            <span className="sr-only">Email</span>
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24", verticalAlign: "middle" }}>mail</span>
          </a>
          {/* Admin Area Access using anchor for hard navigation initially */}
          <a className="text-slate-400 hover:text-blue-500 transition-colors hover:-translate-y-1 transition-transform duration-300 ml-4 border-l border-slate-300 pl-4" href="/admin" title="Log in to Admin Area">
            <span className="sr-only">Admin</span>
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24", verticalAlign: "middle" }}>lock</span>
          </a>
        </div>
        <div className="md:hidden text-xs text-slate-400 italic">
          {footer.tagline}
        </div>
      </div>
    </footer>
  );
};
