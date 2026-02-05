import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, Mail, Linkedin, FileText, Menu, X, ExternalLink, Lock, Eye } from 'lucide-react';
import { TEMPLATE_DATA } from '@/react-app/content/templateData';

/**
 * --- CONFIGURATION & TOKENS ---
 */

const NAV_HEIGHT_PX = 80;
const FOCUS_RING = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)]";
const TRANSITION_MICRO = "transition-all duration-200 ease-in-out";
const TRANSITION_LAYOUT = "transition-all duration-300 ease-in-out";

const slugify = (text: string): string => {
  return text
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '');
};

/**
 * --- HOOKS ---
 */

const useScrollSpy = (ids: string[]) => {
  const [activeId, setActiveId] = useState('home');
  const activeIdRef = useRef('home');

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY < NAV_HEIGHT_PX) {
        if (activeIdRef.current !== 'home') {
          activeIdRef.current = 'home';
          setActiveId('home');
        }
      }
    };
    window.addEventListener('scroll', handleScroll);

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries.filter((entry) => entry.isIntersecting);
        
        if (visibleEntries.length > 0) {
          const winner = visibleEntries.reduce((prev, current) => {
            if (current.intersectionRatio > prev.intersectionRatio) return current;
            if (current.intersectionRatio < prev.intersectionRatio) return prev;
            return current.boundingClientRect.top < prev.boundingClientRect.top ? current : prev;
          });

          if (winner && winner.target.id !== activeIdRef.current) {
            if (window.scrollY >= NAV_HEIGHT_PX) {
              activeIdRef.current = winner.target.id;
              setActiveId(winner.target.id);
            }
          }
        }
      },
      { 
        rootMargin: `-${NAV_HEIGHT_PX}px 0px -20% 0px`,
        threshold: [0.1, 0.3, 0.5, 0.7] 
      }
    );

    ids.forEach((id) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', handleScroll);
    };
  }, [ids]);

  return activeId;
};

const useScrollLock = (isLocked: boolean) => {
  useEffect(() => {
    if (typeof document === 'undefined') return;

    if (isLocked) {
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.paddingRight = `${scrollbarWidth}px`;
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.paddingRight = '';
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.paddingRight = '';
      document.body.style.overflow = '';
    };
  }, [isLocked]);
};

/**
 * --- COMPONENTS ---
 */

const SectionHeading = ({ children }: { children: React.ReactNode }) => (
  <h3 className="text-sm font-bold uppercase tracking-widest text-[var(--muted-2)] mb-4 md:mb-0">
    {children}
  </h3>
);

interface NavbarProps {
  brand: string;
  menuItems: string[];
  activeSection: string;
  onNavigate: (id: string) => void;
  isMenuOpen: boolean;
  onMenuOpenChange: (open: boolean) => void;
}

const Navbar = ({ brand, menuItems, activeSection, onNavigate, isMenuOpen, onMenuOpenChange }: NavbarProps) => {
  const [scrolled, setScrolled] = useState(false);
  
  const menuContainerRef = useRef<HTMLDivElement>(null);
  const triggerButtonRef = useRef<HTMLButtonElement>(null);
  const firstFocusableRef = useRef<HTMLButtonElement>(null);

  useScrollLock(isMenuOpen);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!isMenuOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onMenuOpenChange(false);
        triggerButtonRef.current?.focus();
      }
      if (e.key === 'Tab') {
        const focusableElements = menuContainerRef.current?.querySelectorAll('button, [href]');
        if (focusableElements && focusableElements.length > 0) {
          const firstElement = focusableElements[0] as HTMLElement;
          const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

          if (e.shiftKey) {
            if (document.activeElement === firstElement) {
              e.preventDefault();
              lastElement.focus();
            }
          } else {
            if (document.activeElement === lastElement) {
              e.preventDefault();
              firstElement.focus();
            }
          }
        }
      }
    };

    const handleClickOutside = (e: PointerEvent) => {
      if (menuContainerRef.current && !menuContainerRef.current.contains(e.target as Node) && !triggerButtonRef.current?.contains(e.target as Node)) {
        onMenuOpenChange(false);
        triggerButtonRef.current?.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('pointerdown', handleClickOutside);
    
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        firstFocusableRef.current?.focus();
      });
    });

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('pointerdown', handleClickOutside);
    };
  }, [isMenuOpen, onMenuOpenChange]);

  const handleNavClick = (id: string) => {
    onMenuOpenChange(false);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        onNavigate(id);
        triggerButtonRef.current?.focus();
      });
    });
  };

  return (
    <nav
      style={{ height: 'var(--nav-h)' }}
      className={`fixed w-full z-50 ${TRANSITION_LAYOUT} border-b border-[var(--border)] ${
        scrolled ? 'bg-[var(--bg)]/95 backdrop-blur-sm shadow-sm' : 'bg-[var(--bg)]'
      }`}
    >
      <div className="max-w-5xl mx-auto px-6 h-full flex justify-between items-center relative z-50">
        <button
          onClick={() => handleNavClick('home')}
          className={`text-lg font-semibold tracking-tight hover:opacity-70 text-[var(--text)] rounded-md ${TRANSITION_MICRO} ${FOCUS_RING}`}
        >
          {brand}
        </button>

        <div className="hidden md:flex space-x-8 text-sm font-medium">
          {menuItems.map((item) => {
            const id = slugify(item);
            const isActive = activeSection === id;
            return (
              <button
                key={item}
                onClick={() => handleNavClick(id)}
                className={`relative py-1 rounded-md ${FOCUS_RING} ${TRANSITION_MICRO} ${
                  isActive ? 'text-[var(--text)]' : 'text-[var(--muted)] hover:text-[var(--accent)]'
                }`}
              >
                {item}
                {isActive && (
                  <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[var(--accent)] rounded-full" />
                )}
              </button>
            );
          })}
        </div>

        <div className="md:hidden">
          <button
            ref={triggerButtonRef}
            onClick={() => onMenuOpenChange(!isMenuOpen)}
            aria-label={isMenuOpen ? "Fechar menu" : "Abrir menu"}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
            className={`p-2 text-[var(--text)] rounded-md ${FOCUS_RING} ${TRANSITION_MICRO}`}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="fixed inset-0 top-[var(--nav-h)] bg-[var(--bg)]/50 backdrop-blur-sm z-40 md:hidden">
            <div 
              ref={menuContainerRef}
              id="mobile-menu"
              role="dialog"
              aria-modal="true"
              aria-labelledby="mobile-menu-title"
              className="bg-[var(--bg)] border-b border-[var(--border)] px-6 py-6 flex flex-col space-y-2 shadow-lg"
            >
              <h2 id="mobile-menu-title" className="sr-only">Navigation Menu</h2>
              {menuItems.map((item, index) => {
                const id = slugify(item);
                const isActive = activeSection === id;
                return (
                  <button
                    key={item}
                    ref={index === 0 ? firstFocusableRef : null}
                    onClick={() => handleNavClick(id)}
                    className={`text-left text-lg py-3 px-2 border-b border-[var(--border)] last:border-0 rounded-md ${FOCUS_RING} ${TRANSITION_MICRO} ${
                      isActive ? 'text-[var(--text)] font-semibold' : 'text-[var(--muted)] hover:text-[var(--accent)]'
                    }`}
                  >
                    {item}
                  </button>
                );
              })}
            </div>
        </div>
      )}
    </nav>
  );
};

interface HeroProps {
  onNavigate: (id: string) => void;
  data: typeof TEMPLATE_DATA.hero;
}

const Hero = ({ onNavigate, data }: HeroProps) => (
  <section id="home" className="pt-32 md:pt-48 pb-24 md:pb-32 px-6 scroll-mt-[var(--nav-h)]">
    <div className="max-w-5xl mx-auto">
      <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 text-[var(--text)] animate-fade-in">
        {data.name}
      </h1>
      <h2 className="text-2xl md:text-3xl text-[var(--muted)] font-light mb-8 max-w-[65ch] leading-relaxed animate-fade-in-delay-1">
        {data.subtitle}
      </h2>
      
      <div className="max-w-[65ch] mb-12 animate-fade-in-delay-2">
        <p className="text-lg text-[var(--muted)] leading-relaxed mb-6">
          {data.intro}
        </p>
        
        {data.focusAreas && data.focusAreas.length > 0 && (
          <div className="flex flex-wrap gap-2 text-sm text-[var(--muted-2)] font-mono uppercase tracking-wide">
            {data.focusAreas.map((area, index) => (
              <span key={index} className="flex items-center">
                {area}
                {index < data.focusAreas.length - 1 && <span className="mx-2 opacity-50">·</span>}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-delay-3">
        <button
          onClick={() => onNavigate('experiencia')}
          className={`group flex items-center justify-center sm:justify-start px-8 py-3 bg-[var(--accent)] text-white text-sm font-medium hover:bg-[var(--accent-hover)] hover:shadow-lg hover:scale-[1.02] rounded-md ${TRANSITION_MICRO} ${FOCUS_RING}`}
        >
          Ver experiência
          <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
        <button
          onClick={() => onNavigate('contato')}
          className={`flex items-center justify-center sm:justify-start px-8 py-3 border border-[var(--border)] text-[var(--text)] text-sm font-medium hover:bg-[var(--surface)] hover:border-[var(--accent)] hover:scale-[1.02] rounded-md ${TRANSITION_MICRO} ${FOCUS_RING}`}
        >
          Entrar em contato
        </button>
      </div>
    </div>
  </section>
);

const About = ({ data }: { data: typeof TEMPLATE_DATA.about }) => (
  <section id="sobre" className="py-24 px-6 scroll-mt-[var(--nav-h)]">
    <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12">
      <div className="md:col-span-4">
        <SectionHeading>Sobre</SectionHeading>
      </div>
      <div className="md:col-span-8 space-y-8 text-lg text-[var(--text)] leading-relaxed">
        {data.paragraphs.map((paragraph, idx) => (
          <p key={idx} className="max-w-[65ch]">{paragraph}</p>
        ))}
        
        {data.pullQuote && (
          <div className="my-10 pl-6 border-l-2 border-[var(--accent)]">
            <p className="text-[var(--text)] text-xl font-normal max-w-[55ch] leading-relaxed italic">
              {data.pullQuote}
            </p>
          </div>
        )}
      </div>
    </div>
  </section>
);

const ExperienceTimeline = ({ experiences }: { experiences: typeof TEMPLATE_DATA.experiences }) => (
  <section id="experiencia" className="py-24 px-6 scroll-mt-[var(--nav-h)]">
    <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12">
      <div className="md:col-span-4">
        <SectionHeading>Experiência</SectionHeading>
      </div>
      <div className="md:col-span-8 space-y-12">
        {experiences.map((exp, index) => (
          <div key={index} className="relative pl-8 border-l border-[var(--border)] hover:border-[var(--accent)] transition-colors duration-300">
            <div className="absolute -left-[5px] top-2 w-[9px] h-[9px] bg-[var(--accent)] rounded-full ring-4 ring-[var(--bg)] transition-all duration-300 hover:scale-125"></div>
            <h4 className="text-xl font-semibold text-[var(--text)] mb-1">{exp.institution}</h4>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3">
              <span className="text-base font-medium text-[var(--muted)]">{exp.role}</span>
              <span className="text-sm text-[var(--muted-2)] mt-1 sm:mt-0 font-mono">{exp.period}</span>
            </div>
            
            {exp.highlights && exp.highlights.length > 0 ? (
              <ul className="list-disc ml-4 space-y-2 text-[var(--muted)] text-base leading-relaxed max-w-[65ch]">
                {exp.highlights.map((item, idx) => (
                  <li key={idx} className="pl-1">{item}</li>
                ))}
              </ul>
            ) : (
              <p className="text-[var(--muted)] leading-relaxed text-base max-w-[65ch]">
                {exp.summary}
              </p>
            )}
          </div>
        ))}
        
        <a 
          href="https://drive.google.com/file/d/1yIaEujJh4ibGYHvIoU4K54mXM6A6UF30/view?usp=sharing" 
          target="_blank" 
          rel="noopener noreferrer"
          aria-label="Baixar Currículo Completo em PDF (nova aba)"
          className={`inline-flex items-center text-sm font-medium text-[var(--accent)] hover:underline mt-4 group rounded-md p-1 -ml-1 ${FOCUS_RING}`}
        >
          <FileText className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
          Ver Currículo Completo (PDF)
        </a>
      </div>
    </div>
  </section>
);

interface Project {
  title: string;
  type: string;
  description: string;
  link?: string | null;
  onOpen?: () => void;
  metadata?: {
    year?: string;
    methods?: string;
    output?: string;
  };
}

const ProjectCard = ({ project }: { project: Project }) => {
  const commonClasses = `flex flex-col justify-between h-full min-h-[260px] p-8 bg-[var(--surface)] border border-[var(--border)] rounded-md ${TRANSITION_MICRO}`;
  const interactiveClasses = `hover:border-[var(--accent)] hover:shadow-lg hover:scale-[1.02] cursor-pointer group ${FOCUS_RING}`;
  
  const renderMetadata = () => (
    project.metadata && (
      <div className="text-xs text-[var(--muted-2)] font-mono mb-4 border-l-2 border-[var(--border)] pl-3 py-1">
        {[project.metadata.year, project.metadata.methods, project.metadata.output].filter(Boolean).join(' • ')}
      </div>
    )
  );

  if (project.link) {
    return (
      <a 
        href={project.link} 
        target="_blank" 
        rel="noopener noreferrer"
        aria-label={`Ver projeto ${project.title} (abre em nova aba)`}
        className={`${commonClasses} ${interactiveClasses}`}
      >
        <div>
          <div className="flex justify-between items-start mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--muted-2)] block">{project.type}</span>
            <ExternalLink size={14} className="text-[var(--muted-2)] group-hover:text-[var(--accent)] transition-colors" aria-hidden="true" />
          </div>
          <h4 className="text-lg font-semibold text-[var(--text)] mb-4 group-hover:text-[var(--accent)] transition-colors">{project.title}</h4>
          {renderMetadata()}
          <p className="text-sm text-[var(--muted)] leading-relaxed mb-6">{project.description}</p>
        </div>
        <div className="flex items-center text-[var(--accent)] transition-all duration-300 transform group-hover:translate-x-1">
          <span className="text-sm font-medium mr-2">Ver detalhes</span>
          <ArrowRight size={16} aria-hidden="true" />
        </div>
      </a>
    );
  }

  if (project.onOpen) {
    return (
      <button 
        type="button"
        onClick={project.onOpen}
        aria-label={`Abrir detalhes do projeto ${project.title}`}
        className={`${commonClasses} ${interactiveClasses} text-left w-full`}
      >
        <div>
          <div className="flex justify-between items-start mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--muted-2)] block">{project.type}</span>
            <Eye size={14} className="text-[var(--muted-2)] group-hover:text-[var(--accent)] transition-colors" aria-hidden="true" />
          </div>
          <h4 className="text-lg font-semibold text-[var(--text)] mb-4 group-hover:text-[var(--accent)] transition-colors">{project.title}</h4>
          {renderMetadata()}
          <p className="text-sm text-[var(--muted)] leading-relaxed mb-6">{project.description}</p>
        </div>
        <div className="flex items-center text-[var(--accent)] transition-all duration-300 transform group-hover:translate-x-1">
          <span className="text-sm font-medium mr-2">Visualizar</span>
          <ArrowRight size={16} aria-hidden="true" />
        </div>
      </button>
    );
  }

  return (
    <article className={`${commonClasses}`}>
      <div>
        <div className="flex justify-between items-start mb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-[var(--muted-2)] block">{project.type}</span>
          <Lock size={14} className="text-[var(--border)]" aria-hidden="true" />
        </div>
        <h4 className="text-lg font-semibold text-[var(--text)] mb-4">{project.title}</h4>
        {renderMetadata()}
        <p className="text-sm text-[var(--muted)] leading-relaxed mb-6">{project.description}</p>
      </div>
      <div className="flex items-center text-[var(--muted-2)] select-none">
        <span className="text-xs font-medium uppercase tracking-wide">Em breve / Confidencial</span>
      </div>
    </article>
  );
};

const ProjectsGrid = ({ projects }: { projects: typeof TEMPLATE_DATA.projects }) => (
  <section id="projetos" className="py-24 px-6 bg-[var(--bg)] scroll-mt-[var(--nav-h)]">
    <div className="max-w-5xl mx-auto">
      <SectionHeading>Projetos & Pesquisa</SectionHeading>
      <div className="h-8"></div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((proj, index) => (
          <ProjectCard key={index} project={proj} />
        ))}
      </div>
    </div>
  </section>
);

const Contact = () => (
  <section id="contato" className="py-24 px-6 bg-[var(--surface)] border-t border-[var(--border)] scroll-mt-[var(--nav-h)]">
    <div className="max-w-5xl mx-auto text-center">
      <h2 className="text-3xl font-bold text-[var(--text)] mb-6">Contato</h2>
      <p className="text-[var(--muted)] mb-10 max-w-xl mx-auto text-lg">
        Para contatos acadêmicos, institucionais ou profissionais, fico à disposição.
      </p>
      
      <div className="flex flex-col sm:flex-row justify-center gap-6">
        <a 
          href="https://mail.google.com/mail/?view=cm&fs=1&to=pedrocampelo.fgv@gmail.com"
          className={`flex items-center justify-center px-8 py-4 bg-[var(--surface)] border border-[var(--border)] text-[var(--text)] hover:border-[var(--accent)] hover:text-[var(--accent)] hover:scale-[1.02] rounded-md w-full sm:w-auto min-w-[200px] ${TRANSITION_MICRO} ${FOCUS_RING}`}
        >
          <Mail className="w-5 h-5 mr-3" aria-hidden="true" />
          <span className="font-medium">Enviar Email</span>
        </a>
        
        <a 
          href="https://www.linkedin.com/in/peedrocampelo/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Visitar perfil no LinkedIn (nova aba)"
          className={`flex items-center justify-center px-8 py-4 bg-[var(--surface)] border border-[var(--border)] text-[var(--text)] hover:border-[var(--accent)] hover:text-[var(--accent)] hover:scale-[1.02] rounded-md w-full sm:w-auto min-w-[200px] group ${TRANSITION_MICRO} ${FOCUS_RING}`}
        >
          <Linkedin className="w-5 h-5 mr-3 group-hover:fill-current" aria-hidden="true" />
          <span className="font-medium">LinkedIn</span>
        </a>
      </div>
    </div>
  </section>
);

const Footer = ({ brandName }: { brandName: string }) => (
  <footer className="py-12 px-6 border-t border-[var(--border)] bg-[var(--bg)]">
    <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center text-sm text-[var(--muted-2)]">
      <p>&copy; {new Date().getFullYear()} {brandName}. Todos os direitos reservados.</p>
      <p className="mt-2 md:mt-0 font-mono text-xs opacity-70">Projetado & Construído por Pedro Campelo</p>
    </div>
  </footer>
);

const Separator = () => (
  <div className="max-w-5xl mx-auto px-6"><hr className="border-[var(--border)]" /></div>
);

/**
 * --- MAIN COMPONENT ---
 */
export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const mainContentRef = useRef<HTMLElement>(null);

  const themeStyles = {
    "--bg": "#F7F7F7",
    "--surface": "#FFFFFF",
    "--text": "#0E0E0E",
    "--muted": "#4A4A4A",
    "--muted-2": "#8A8A8A",
    "--border": "#E5E5E5",
    "--accent": "#1E2A38",
    "--accent-hover": "#2C3B4D",
    "--selection-bg": "#1E2A38",
    "--selection-text": "#FFFFFF",
    "--nav-h": `${NAV_HEIGHT_PX}px`,
  } as React.CSSProperties;
  
  const activeSection = useScrollSpy(TEMPLATE_DATA.menuItems.map(slugify));

  useEffect(() => {
    const mainContent = mainContentRef.current;
    if (!mainContent) return;

    if (isMenuOpen) {
      mainContent.setAttribute('inert', '');
      mainContent.setAttribute('aria-hidden', 'true');
    } else {
      mainContent.removeAttribute('inert');
      mainContent.removeAttribute('aria-hidden');
    }
  }, [isMenuOpen]);

  const handleNavigate = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        });
      });
    }
  };

  return (
    <div 
      className="min-h-screen font-sans selection:bg-[var(--selection-bg)] selection:text-[var(--selection-text)] bg-[var(--bg)]"
      style={themeStyles}
    >
      <Navbar 
        brand={TEMPLATE_DATA.hero.name}
        menuItems={TEMPLATE_DATA.menuItems} 
        activeSection={activeSection} 
        onNavigate={handleNavigate}
        isMenuOpen={isMenuOpen}
        onMenuOpenChange={setIsMenuOpen}
      />

      <main id="main-content" ref={mainContentRef}>
        <Hero 
          onNavigate={handleNavigate} 
          data={TEMPLATE_DATA.hero}
        />
        
        <Separator />
        
        <About 
          data={TEMPLATE_DATA.about}
        />
        
        <Separator />
        
        <ExperienceTimeline 
          experiences={TEMPLATE_DATA.experiences} 
        />
        
        <Separator />
        
        <ProjectsGrid 
          projects={TEMPLATE_DATA.projects} 
        />
        
        <Contact />
        
        <Footer brandName={TEMPLATE_DATA.hero.name} />
      </main>
    </div>
  );
}
