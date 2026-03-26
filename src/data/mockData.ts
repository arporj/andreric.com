export const siteData = {
  header: {
    logoText: "André Ric",
    navLinks: [
      { label: "About", href: "#about" },
      { label: "Experience", href: "#experience" },
      { label: "Skills", href: "#skills" },
      { label: "Projects", href: "#projects" },
      { label: "Contact", href: "#contact" }
    ]
  },
  hero: {
    upperSub: "Architecting Digital Experiences",
    greetingPrefix: "Hi, I'm",
    name: "André Ric.",
    description: "A Software Engineer dedicated to precision, performance, and clean code.",
    primaryCta: { label: "View Projects", href: "#projects" },
    secondaryCta: { label: "Download CV", href: "#" },
    imageSrc: "https://lh3.googleusercontent.com/aida-public/AB6AXuDmtTPlURA3p-Uya3sv-2_PawK1R8weFfA6r5U5vOfpXznovdQ4MtcxITsrl2mEbFlr0kagJxy2jHLRbRMxlvVuazrJV1I_khsL4yz5yB0Fgd-zkphSTBsRmnK51D-t3Ih8pObb21L7GlpuHq_8I2tbDLr7dODo9DW_ZHGc3yUBj-S5yPNGRQgFcNwvEv-IS7wE7OJnUVzmLmisCkjb0s16NeNVheKijWWVrmbuuMwpkl4fLzj8qIIZQYShi-vih4om2gfA3dyuHETa",
    imageAlt: "André Ric Profile",
    badge: {
      title: "Experience",
      value: "8+ Years"
    }
  },
  about: {
    title: "Technical Philosophy",
    paragraphs: [
      "I approach software development as a form of digital architecture. Every line of code should serve a purpose, and every interface should feel intuitive and seamless.",
      "With nearly a decade of experience across the stack, I specialize in building scalable web applications that don't just work—they excel. My focus is on the intersection of robust backend logic and elegant frontend presentation."
    ],
    facts: [
      { label: "Location", value: "São Paulo, SP" },
      { label: "Education", value: "B.S. Computer Science" },
      { label: "Specialty", value: "Full-Stack Architecture" },
      { label: "Availability", value: "Open to Projects" }
    ]
  },
  experience: {
    title: "Career Journey",
    items: [
      {
        id: 1,
        period: "2021 — Present",
        role: "Senior Systems Architect",
        company: "Tech Solutions",
        details: [
          "Led a team of 12 engineers in migrating legacy infrastructure to microservices.",
          "Reduced cloud operational costs by 35% through container optimization.",
          "Implemented CI/CD pipelines that cut deployment time by 60%."
        ],
        align: "right"
      },
      {
        id: 2,
        period: "2018 — 2021",
        role: "Lead Full-Stack Developer",
        company: "Creative Flow Agency",
        details: [
          "Spearheaded development of 50+ client web applications.",
          "Integrated advanced real-time features using WebSockets and Node.js.",
          "Mentored junior developers and established internal coding standards."
        ],
        align: "left"
      }
    ]
  },
  skills: {
    title: "Technical Toolkit",
    categories: [
      {
        id: "frontend",
        icon: "brush",
        title: "Frontend Architecture",
        tags: ["React / Next.js", "TypeScript", "Tailwind CSS", "Framer Motion", "Three.js"]
      },
      {
        id: "backend",
        icon: "database",
        title: "Backend & Systems",
        tags: ["Node.js", "PostgreSQL", "Redis", "GraphQL", "Python / FastAPI"]
      },
      {
        id: "infrastructure",
        icon: "terminal",
        title: "Infrastructure & Tools",
        tags: ["Docker / K8s", "AWS / GCP", "Terraform", "CI/CD", "Git / GitHub"]
      }
    ]
  },
  projects: {
    title: "Featured Projects",
    subtitle: "A selection of my recent work focusing on complex systems and high-fidelity user interfaces.",
    viewAllLink: "#",
    items: [
      {
        id: 1,
        imageSrc: "https://lh3.googleusercontent.com/aida-public/AB6AXuC-KAg-8IorkDL9leTYCQQ_FJEpXnBIZDOQhkjGLNQPYkQek2lB2h6W566IDEuaaawWPwpa5ttCAT1YLAyAriI7o6SQjDHfQTQYlzHwFBPGmmcQ4qeJT1kVhhz1R4G_JRRxeziebT6h20e8gX2T5eq1zfaCqdzCPxgoH3u7d3NA5yMPf5JDelvVFyL__2okiDDcIJCNssLk8wsiUpLp-YqL_Bsrzg5knlasUbYh9HSjptVWmrQB9IQoWfyvA8U4-71VrC2Ie-YXOIzK",
        imageAlt: "Data Analytics Dashboard",
        tags: ["SaaS", "Analytics"],
        title: "Vortex Insight Platform",
        description: "A real-time analytics engine processing over 10M events daily with sub-second latency and an intuitive React dashboard.",
        demoLink: "#",
        githubLink: "#"
      },
      {
        id: 2,
        imageSrc: "https://lh3.googleusercontent.com/aida-public/AB6AXuDgDrKrhmLfI_Tf3rfAzhRY7tSYHY7AKssgF4FBCwNfGsBoRr9qTMEQGopRabySMu46W2WczUFwVd_ZYHmQZGv5Wu-MAv-AYWEGuWWoM0kpNpRwls-1PaNHgzKH9ErbRGrZUZIq2tTRXUsFRC2cgGu6BEamMZJlft-FSXGVogs468h6Kl5Y-pLi8SrVfoobiDEch8l6rMk5Z4AFjUZwQCbhNpkV-J6IN2Sxliu14234nhpjk90V5NZU9qsPh4gBcX9PszByZS8rNFK3",
        imageAlt: "Secure Messaging App",
        tags: ["FinTech", "Security"],
        title: "Cipher Wallet & Messenger",
        description: "End-to-end encrypted financial communication suite featuring multi-signature wallet support and hardware key integration.",
        demoLink: "#",
        githubLink: "#"
      }
    ]
  },
  contact: {
    titleHighlight: "exceptional?",
    titlePrefix: "Ready to build something",
    description: "I'm currently accepting new projects and consulting opportunities. Let's discuss how we can bring your vision to life.",
    ctaLabel: "Start a Conversation",
    email: "contato@andreric.com"
  },
  footer: {
    copyright: "© 2026 André Ric. Built with Precision.",
    tagline: "Engineering Excellence",
    links: {
      linkedin: "#",
      github: "https://github.com/arporj",
      email: "mailto:contato@andreric.com"
    }
  }
};
