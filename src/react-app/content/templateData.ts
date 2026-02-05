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
      role: "Pesquisador de Iniciação Científica",
      period: "2025–2026",
      summary: "Pesquisa sobre desigualdades de gênero e choques climáticos.",
      highlights: [
        "Pesquisa sobre desigualdades de gênero e choques climáticos no mercado de trabalho rural brasileiro.",
        "Análise econométrica utilizando microdados da PNAD Contínua e dados climáticos via satélite.",
        "Automatização de rotinas de limpeza de dados em R e Stata."
      ]
    },
    {
      institution: "Secretaria de Planejamento",
      role: "Estagiário de Políticas Públicas",
      period: "2024–2025",
      summary: "Apoio na estruturação de indicadores de desempenho para programas estaduais.",
      highlights: [
        "Apoio na estruturação de indicadores de desempenho para programas estaduais de educação.",
        "Elaboração de notas técnicas para avaliação de impacto preliminar."
      ]
    },
    {
      institution: "Consultoria Econômica Jr.",
      role: "Analista de Dados",
      period: "2023–2024",
      summary: "Modelagem de cenários macroeconômicos e relatórios setoriais.",
      highlights: [] 
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
