export const TEMPLATE_DATA = {
  menuItems: ['Home', 'Sobre', 'Experiência', 'Projetos', 'Contato'],
  hero: {
    name: "Pedro Campelo",
    subtitle: "Economia, políticas públicas e análise aplicada.",
    intro: "Estudante de Economia na FGV-EESP, com atuação em pesquisa acadêmica e consultoria para o setor público.",
    focusAreas: ["Microeconomia Aplicada", "Avaliação de Impacto", "Consultoria"]
  },
  about: {
    paragraphs: [
      "Sou estudante de Economia na FGV-EESP, com interesse em microeconomia aplicada, políticas públicas e análise de dados voltada à tomada de decisão.",
      "Minha trajetória combina pesquisa acadêmica, atuação em consultoria para o primeiro setor e envolvimento institucional, sempre com foco em estruturar problemas complexos de forma clara e operacional.",
      "Acredito em políticas públicas bem desenhadas, baseadas em evidência empírica e sensíveis às dimensões sociais e institucionais dos problemas."
    ],
    pullQuote: "A clareza na formulação do problema é tão importante quanto o rigor na sua solução."
  },
  experiences: [
    {
      institution: "FGV-EESP",
      role: "Pesquisador Bolsista de Iniciação Científica",
      period: "Jun 2025 – Jun 2026",
      summary: "Pesquisa sobre desigualdades de gênero e choques climáticos.",
      highlights: [
        "Pesquisa sobre desigualdades de gênero e choques climáticos no mercado de trabalho rural brasileiro."
      ]
    },
    {
      institution: "Consultoria Júnior Pública – FGV (CJP-FGV)",
    role: "Trainee → Consultor → Gerente",
    period: "Set 2023– Dez 2025",
    summary: "Consultoria para o setor público, com foco em planejamento estratégico e gestão de projetos.",
    highlights: [
      "Redesenho de processos e diagnóstico de disfunções organizacionais em entidade do terceiro setor.",
      "Atuação em planejamento estratégico e governança em projeto do Vale da Inovação em Políticas Públicas.",
      "Gestão de projetos e liderança de equipe ao longo da trajetória na organização.",
      "Participação em avaliação institucional no Projeto 100 Melhores ONGs.",
       <>
      Prospecção comercial de <em>leads</em> no setor público.
    </>,
  ],
},
    {
      institution: "Diretório Acadêmico Getúlio Vargas (DAGV)",
      role: "Membro da Vice-Presidência Acadêmica de Economia",
      period: "Mar 2024 – Ago 2025",
      summary: "Atuação em governança estudantil e execução de projetos acadêmicos.",
      highlights: [
        "Participação em reuniões semanais de tomada de decisão.",
        "Planejamento e execução de projetos acadêmicos e culturais para o alunato de Economia."
      ]
    }
  ],
  projects: [
    {
      title: "Entre o Campo e o Lar",
      type: "Pesquisa",
      description: "Análise dos impactos de secas severas sobre a alocação de tempo e desigualdades de gênero no mercado de trabalho rural brasileiro.",
      link: "https://exemplo.com/paper",
      metadata: { year: "2025", methods: "Diff-in-Diff", output: "Working Paper" }
    },
    {
      title: "Eficiência no Gasto Público",
      type: "Policy Paper",
      description: "Estudo comparativo sobre a eficiência da alocação de recursos em educação básica nos municípios do estado de São Paulo.",
      link: null,
      metadata: { year: "2024", methods: "DEA", output: "Relatório Técnico" }
    },
    {
      title: "Dinâmica da Inflação",
      type: "Projeto Acadêmico",
      description: "Aplicação de modelos de Vetores Autorregressivos (VAR) para entender a persistência inflacionária no setor de serviços pós-pandemia.",
      onOpen: () => alert("Exemplo de ação modal"),
      metadata: { year: "2024", methods: "VAR/VEC", output: "Artigo de Termo" }
    }
  ]
};
