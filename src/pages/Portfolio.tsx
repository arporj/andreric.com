import { Header } from '../components/Header';
import { Hero } from '../components/Hero';
import { About } from '../components/About';
import { Experience } from '../components/Experience';
import { Skills } from '../components/Skills';
import { Projects } from '../components/Projects';
import { Contact } from '../components/Contact';
import { Footer } from '../components/Footer';
import { useSiteData } from '../contexts/SiteContext';

function LoadingScreen() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-surface">
      <div className="relative flex flex-col items-center gap-6">
        {/* Logo / Nome */}
        <h1 className="text-3xl md:text-4xl font-bold text-on-surface tracking-tight animate-pulse">
          Currículo André Ricardo<span className="text-primary">.</span>
        </h1>
        
        {/* Barra de progresso animada */}
        <div className="w-48 h-0.5 bg-surface-container-high rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary rounded-full"
            style={{
              animation: 'loading-bar 1.4s ease-in-out infinite',
            }}
          />
        </div>

        <p className="text-sm text-outline tracking-widest uppercase">Carregando</p>
      </div>

      <style>{`
        @keyframes loading-bar {
          0% { width: 0%; margin-left: 0; }
          50% { width: 60%; margin-left: 20%; }
          100% { width: 0%; margin-left: 100%; }
        }
      `}</style>
    </div>
  );
}

export function Portfolio() {
  const { loading } = useSiteData();

  if (loading) return <LoadingScreen />;

  return (
    <div className="bg-surface text-on-surface selection:bg-primary-container selection:text-on-primary-container">
      <Header />
      <main>
        <Hero />
        <About />
        <Experience />
        <Skills />
        <Projects />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
