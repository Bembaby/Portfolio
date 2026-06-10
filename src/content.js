// Single source of truth for all real portfolio content.

export const PROFILE = {
  name: "Belal Embaby",
  firstName: "belal",
  tagline: "SOFTWARE ENGINEER",
  email: "belal919@live.com",
  phone: "(862) 201-8511",
  location: "Newark, New Jersey",
  github: { handle: "Bembaby", url: "https://github.com/Bembaby" },
  instagram: { handle: "@Belalwho", url: "https://instagram.com/Belalwho" },
  resumePdf: "/Belal-Embaby-Resume.pdf",
  languages: ["Arabic", "English", "Spanish"],
};

export const EDUCATION = {
  school: "New Jersey Institute of Technology",
  college: "Ying Wu College of Computing",
  degree: "B.S. Computer Science",
  span: "Sep 2021 — Dec 2025",
  location: "Newark, NJ",
};

export const EXPERIENCE = [
  {
    role: "Software Engineer",
    company: "rancscapital.com",
    span: "Sep 2025 — Present",
    bullets: [
      "Led engineering for a revenue-generating real estate investment platform serving investors, builders, and sellers.",
      "Built CRM systems and outreach automation bots that improved lead generation, follow-up consistency, and pipeline management.",
      "Shipped website and platform improvements that converted inbound traffic into qualified leads.",
    ],
  },
];

export const PROJECTS = [
  {
    id: "fittrack",
    name: "FITTRACK+",
    subtitle: "Full-Stack Fitness Platform",
    status: "LIVE",
    link: "https://www.fitstrack.com",
    linkLabel: "FitsTrack.com",
    stats: [
      { tag: "DLS", value: "2K+" },
      { tag: "USR", value: "200+" },
    ],
    tech: ["React", "Next.js", "React Native", "Spring Boot", "Java", "OAuth", "SQL", "Docker", "Vercel"],
    bullets: [
      "Grew FitTrack+ to 2,000+ downloads and 200+ active users across web and mobile.",
      "Cross-platform mobile app in React Native, extending the web core to iOS and Android.",
      "Java Spring Boot REST APIs handling auth, workouts, nutrition logs, and user profiles.",
      "Secure JWT + Google OAuth flows with seamless login across web and mobile.",
      "One shared backend architecture serving Next.js web and the mobile app.",
    ],
  },
  {
    id: "security",
    name: "SECURITY FIRM SITE",
    subtitle: "Client Consulting Website",
    status: "SHIPPED",
    link: null,
    linkLabel: null,
    stats: [{ tag: "CLT", value: "1:1" }],
    tech: ["Web Design", "UX", "Client Work"],
    bullets: [
      "Professional website for a security consulting firm, focused on intuitive navigation and information clarity.",
      "Collaborated directly with the client to meet specific business requirements.",
    ],
  },
  {
    id: "crm",
    name: "CRM & OUTREACH BOTS",
    subtitle: "rancscapital.com",
    status: "IN PROD",
    link: "https://rancscapital.com",
    linkLabel: "rancscapital.com",
    stats: [{ tag: "OPS", value: "24/7" }],
    tech: ["CRM", "Automation", "Lead Gen", "Pipelines"],
    bullets: [
      "Outreach automation bots that improved lead generation and follow-up consistency.",
      "Pipeline management tooling for property acquisition and sales workflows.",
      "Powers day-to-day business operations on a live, revenue-generating platform.",
    ],
  },
];

export const SKILLS = [
  { group: "LANGUAGES", rank: 5, items: ["Java", "JavaScript", "C", "Python", "PHP"] },
  { group: "WEB", rank: 5, items: ["React", "Next.js", "React Native", "HTML", "CSS"] },
  { group: "BACKEND", rank: 4, items: ["Spring Boot", "REST APIs", "JWT", "OAuth", "SQL"] },
  { group: "CLOUD / DEVOPS", rank: 4, items: ["Docker", "Terraform", "Vercel", "CI/CD", "AWS Lambda"] },
  { group: "CORE", rank: 5, items: ["Data Structures", "Algorithms", "Debugging", "Git", "GitHub"] },
];

// Persona-style attribute radar. Values out of 99.
export const STATS = [
  { stat: "STR", label: "BACKEND", value: 86 },
  { stat: "MAG", label: "FRONTEND", value: 92 },
  { stat: "END", label: "DEVOPS", value: 78 },
  { stat: "AGI", label: "SHIPPING", value: 95 },
  { stat: "LUK", label: "LEARNING", value: 90 },
];

// Rotating flavor lines for the menu ticker.
export const TICKER = [
  "FULL-STACK SOFTWARE ENGINEER — NEWARK, NJ",
  "B.S. COMPUTER SCIENCE — NJIT, DEC 2025",
  "NOW ENGINEERING @ RANCS CAPITAL",
  "FITTRACK+ — 2,000+ DOWNLOADS / 200+ ACTIVE USERS",
  "ARABIC · ENGLISH · SPANISH — 8 LANGUAGES COUNTING CODE",
  "REACT · NEXT.JS · SPRING BOOT · REACT NATIVE · DOCKER",
];
