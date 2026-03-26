import { siteData } from '../data/mockData';

export const Projects = () => {
  const { projects } = siteData;

  return (
    <section className="py-24 px-8 bg-surface" id="projects">
      <div className="max-w-7xl mx-auto">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4">
          <div className="space-y-4">
            <h2 className="text-[1.75rem] font-bold text-on-surface tracking-tight">{projects.title}</h2>
            <p className="text-on-surface-variant max-w-xl text-lg">{projects.subtitle}</p>
          </div>
          <a className="text-primary font-bold hover:underline underline-offset-8 transition-all" href={projects.viewAllLink}>
            View All Work →
          </a>
        </div>
        
        <div className="grid md:grid-cols-2 gap-12">
          {projects.items.map((project) => (
            <div key={project.id} className="group">
              <div className="aspect-video rounded-xl overflow-hidden mb-8 shadow-md border border-outline-variant border-opacity-10 relative">
                <img 
                  alt={project.imageAlt} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                  src={project.imageSrc} 
                />
                <div className="absolute inset-0 bg-primary opacity-0 group-hover:opacity-10 transition-opacity"></div>
              </div>
              <div className="space-y-4">
                <div className="flex gap-2">
                  {project.tags.map(tag => (
                    <span key={tag} className="text-[10px] uppercase font-bold tracking-widest text-primary bg-primary-container/10 px-2 py-1 rounded">
                      {tag}
                    </span>
                  ))}
                </div>
                <h3 className="text-2xl font-bold group-hover:text-primary transition-colors">{project.title}</h3>
                <p className="text-on-surface-variant leading-relaxed">
                  {project.description}
                </p>
                <div className="flex gap-6 pt-2">
                  <a className="flex items-center gap-2 text-sm font-bold hover:text-primary transition-colors" href={project.demoLink}>
                    <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24", verticalAlign: "middle" }}>open_in_new</span> Live Demo
                  </a>
                  <a className="flex items-center gap-2 text-sm font-bold hover:text-primary transition-colors" href={project.githubLink}>
                    <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24", verticalAlign: "middle" }}>terminal</span> GitHub
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
        
      </div>
    </section>
  );
};
