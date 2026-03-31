export const siteData = {
  header: {
    logoText: "André Ric",
    navLinks: [
      { label: "Sobre", href: "#about" },
      { label: "Experiência", href: "#experience" },
      { label: "Habilidades", href: "#skills" },
      { label: "Projetos", href: "#projects" },
      { label: "Contato", href: "#contact" }
    ]
  },
  hero: {
    upperSub: "Arquitetando Experiências Digitais",
    greetingPrefix: "Olá, sou",
    name: "André Ric.",
    description: "Engenheiro de Software dedicado à precisão, performance e código limpo.",
    primaryCta: { label: "Ver Projetos", href: "#projects" },
    secondaryCta: { label: "Baixar CV", href: "#" },
    imageSrc: "https://lh3.googleusercontent.com/aida-public/AB6AXuDmtTPlURA3p-Uya3sv-2_PawK1R8weFfA6r5U5vOfpXznovdQ4MtcxITsrl2mEbFlr0kagJxy2jHLRbRMxlvVuazrJV1I_khsL4yz5yB0Fgd-zkphSTBsRmnK51D-t3Ih8pObb21L7GlpuHq_8I2tbDLr7dODo9DW_ZHGc3yUBj-S5yPNGRQgFcNwvEv-IS7wE7OJnUVzmLmisCkjb0s16NeNVheKijWWVrmbuuMwpkl4fLzj8qIIZQYShi-vih4om2gfA3dyuHETa",
    imageAlt: "André Ric Perfil",
    badge: {
      title: "Experiência",
      value: "8+ Anos"
    }
  },
  about: {
    title: "Filosofia Técnica",
    paragraphs: [
      "Eu encaro o desenvolvimento de software como uma forma de arquitetura digital. Cada linha de código deve ter um propósito, e cada interface deve ser intuitiva e fluida.",
      "Com quase uma década de experiência em toda a stack, sou especialista em construir aplicações web escaláveis que não apenas funcionam, mas se destacam. Meu foco é na intersecção entre uma lógica de backend robusta e uma apresentação de frontend elegante."
    ],
    facts: [
      { label: "Localização", value: "São Paulo, SP" },
      { label: "Formação", value: "Bacharelado em Ciência da Computação" },
      { label: "Especialidade", value: "Arquitetura Full-Stack" },
      { label: "Disponibilidade", value: "Aberto a Projetos" }
    ]
  },
  experience: {
    title: "Jornada Profissional",
    items: [
      {
        id: 1,
        period: "2021 — Presente",
        role: "Arquiteto de Sistemas Sênior",
        company: "Tech Solutions",
        details: [
          "Liderei uma equipe de 12 engenheiros na migração da infraestrutura legada para microsserviços.",
          "Reduzi os custos operacionais em nuvem em 35% através da otimização de contêineres.",
          "Implementei pipelines de CI/CD que reduziram o tempo de deploy em 60%."
        ],
        align: "right"
      },
      {
        id: 2,
        period: "2018 — 2021",
        role: "Desenvolvedor Full-Stack Líder",
        company: "Creative Flow Agency",
        details: [
          "Liderei o desenvolvimento de mais de 50 aplicações web para clientes.",
          "Integrei recursos avançados em tempo real usando WebSockets e Node.js.",
          "Fui mentor de desenvolvedores juniores e estabeleci padrões internos de codificação."
        ],
        align: "left"
      }
    ]
  },
  skills: {
    title: "Ferramentas Técnicas",
    categories: [
      {
        id: "frontend",
        icon: "brush",
        title: "Arquitetura Frontend",
        tags: ["React / Next.js", "TypeScript", "Tailwind CSS", "Framer Motion", "Three.js"]
      },
      {
        id: "backend",
        icon: "database",
        title: "Backend e Sistemas",
        tags: ["Node.js", "PostgreSQL", "Redis", "GraphQL", "Python / FastAPI"]
      },
      {
        id: "infrastructure",
        icon: "terminal",
        title: "Infraestrutura e Ferramentas",
        tags: ["Docker / K8s", "AWS / GCP", "Terraform", "CI/CD", "Git / GitHub"]
      }
    ]
  },
  projects: {
    title: "Projetos em Destaque",
    subtitle: "Uma seleção do meu trabalho recente com foco em sistemas complexos e interfaces de usuário de alta fidelidade.",
    viewAllLink: "#",
    items: [
      {
        id: 1,
        imageSrc: "https://lh3.googleusercontent.com/aida-public/AB6AXuC-KAg-8IorkDL9leTYCQQ_FJEpXnBIZDOQhkjGLNQPYkQek2lB2h6W566IDEuaaawWPwpa5ttCAT1YLAyAriI7o6SQjDHfQTQYlzHwFBPGmmcQ4qeJT1kVhhz1R4G_JRRxeziebT6h20e8gX2T5eq1zfaCqdzCPxgoH3u7d3NA5yMPf5JDelvVFyL__2okiDDcIJCNssLk8wsiUpLp-YqL_Bsrzg5knlasUbYh9HSjptVWmrQB9IQoWfyvA8U4-71VrC2Ie-YXOIzK",
        imageAlt: "Dashboard de Análise de Dados",
        tags: ["SaaS", "Analytics"],
        title: "Plataforma Vortex Insight",
        description: "Um motor de analytics em tempo real que processa mais de 10M de eventos diários com latência de sub-segundos e um dashboard intuitivo em React.",
        demoLink: "#",
        githubLink: "#"
      },
      {
        id: 2,
        imageSrc: "https://lh3.googleusercontent.com/aida-public/AB6AXuDgDrKrhmLfI_Tf3rfAzhRY7tSYHY7AKssgF4FBCwNfGsBoRr9qTMEQGopRabySMu46W2WczUFwVd_ZYHmQZGv5Wu-MAv-AYWEGuWWoM0kpNpRwls-1PaNHgzKH9ErbRGrZUZIq2tTRXUsFRC2cgGu6BEamMZJlft-FSXGVogs468h6Kl5Y-pLi8SrVfoobiDEch8l6rMk5Z4AFjUZwQCbhNpkV-J6IN2Sxliu14234nhpjk90V5NZU9qsPh4gBcX9PszByZS8rNFK3",
        imageAlt: "App de Mensagens Seguro",
        tags: ["FinTech", "Segurança"],
        title: "Carteira e Mensageiro Cipher",
        description: "Suíte de comunicação financeira com criptografia de ponta a ponta, apresentando suporte a carteira multi-assinatura e integração com chave de hardware.",
        demoLink: "#",
        githubLink: "#"
      }
    ]
  },
  contact: {
    titleHighlight: "excepcional?",
    titlePrefix: "Pronto para construir algo",
    description: "Atualmente estou aceitando novos projetos e oportunidades de consultoria. Vamos discutir como podemos dar vida à sua visão.",
    ctaLabel: "Iniciar uma Conversa",
    email: "contato@andreric.com"
  },
  footer: {
    copyright: "© 2026 André Ric. Construído com Precisão.",
    tagline: "Excelência em Engenharia",
    links: {
      linkedin: "#",
      github: "https://github.com/arporj",
      email: "mailto:contato@andreric.com"
    }
  }
};
