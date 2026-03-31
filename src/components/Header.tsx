import { siteData } from '../data/mockData';

export const Header = () => {
  return (
    <nav className="fixed top-0 w-full z-50 bg-white/70 backdrop-blur-md border-b border-slate-200/10 shadow-sm transition-all duration-300">
      <div className="flex justify-between items-center px-8 py-4 max-w-7xl mx-auto">
        <div className="text-xl font-bold tracking-tighter text-slate-900">{siteData.header.logoText}</div>
        
        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8 font-medium text-sm tracking-wide">
          {siteData.header.navLinks.map((link) => (
            <a 
              key={link.label} 
              className="text-slate-600 hover:text-slate-900 transition-colors" 
              href={link.href}
            >
              {link.label}
            </a>
          ))}
          <a href="/login" className="px-5 py-2 bg-primary text-on-primary rounded-full hover:bg-primary/90 transition-colors">
            Login
          </a>
        </div>
        
        {/* Mobile Menu Button */}
        <div className="flex md:hidden items-center gap-4">
          <a href="/login" className="px-4 py-1.5 bg-primary text-on-primary rounded-full text-sm font-medium hover:bg-primary/90 transition-colors">
            Login
          </a>
          <button className="p-2 text-on-surface-variant">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24", verticalAlign: "middle" }}>menu</span>
          </button>
        </div>
      </div>
    </nav>
  );
};
