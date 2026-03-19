export type Lesson = {
  id: string
  title: string
  duration: string
  free?: boolean
}

export type Module = {
  id: string
  title: string
  subtitle: string
  lessons: Lesson[]
}

export type CourseContent = {
  courseId: string
  description: string
  longDescription: string
  duration: string
  modules: Module[]
}

export const courseContents: CourseContent[] = [
  {
    courseId: "educacao-financeira",
    description: "O ponto de partida obrigatório para sua jornada financeira.",
    longDescription:
      "Do zero ao avançado: mentalidade, organização financeira, saída das dívidas, renda fixa e renda variável. Tudo que você precisa para construir sua liberdade financeira com método e consistência.",
    duration: "18h+",
    modules: [
      {
        id: "mod-mentalidade",
        title: "Mentalidade",
        subtitle: "Fundamentos e hábitos para construir uma base financeira sólida",
        lessons: [
          { id: "m1-l1", title: "Limpar o Terreno", duration: "12:00", free: true },
          { id: "m1-l2", title: "Mentalidade Abundância x Mentalidade Escassez", duration: "14:30" },
          { id: "m1-l3", title: "Crenças Limitantes Sobre Você", duration: "11:45" },
          { id: "m1-l4", title: "Crenças Limitantes em Relação ao Dinheiro", duration: "13:20" },
          { id: "m1-l5", title: "O Poder do Ambiente e das Pessoas ao Redor", duration: "10:55" },
          { id: "m1-l6", title: "Comportamento: Ficar Rico é Comportamental e Não Intelectual", duration: "15:10" },
          { id: "m1-l7", title: "Como Criar um Hábito", duration: "12:40" },
          { id: "m1-l8", title: "Mindset Longo Prazo x Imediato", duration: "11:00" },
          { id: "m1-l9", title: "Foco e Prioridades", duration: "09:30" },
          { id: "m1-l10", title: "Importância da Meta — Como Estabelecer Uma", duration: "14:50" },
          { id: "m1-l11", title: "Auto Responsabilidade: a Chave pra Mudar de Vida", duration: "13:15" },
          { id: "m1-l12", title: "Como Lidar com o Medo e o Fracasso Financeiro", duration: "12:00" },
          { id: "m1-l13", title: "Melhoria Contínua", duration: "10:20" },
          { id: "m1-l14", title: "Aprenda a Ser Grato", duration: "09:45" },
        ],
      },
      {
        id: "mod-dinheiro",
        title: "Dinheiro, Bancos e Governos",
        subtitle: "Entenda o papel do dinheiro e como instituições e governos impactam você",
        lessons: [
          { id: "m2-l1", title: "A História do Dinheiro", duration: "16:00" },
          { id: "m2-l2", title: "Moedas Fiduciárias: o Fim do Lastro em Ouro", duration: "14:20" },
          { id: "m2-l3", title: "Qual a Função do Dinheiro", duration: "11:30" },
          { id: "m2-l4", title: "Inflação: o Que É e Como Funciona", duration: "13:45" },
          { id: "m2-l5", title: "Inflação x Deflação", duration: "10:50" },
          { id: "m2-l6", title: "Reservas Fracionárias: o Dinheiro que Não Existe", duration: "15:00" },
          { id: "m2-l7", title: "Efeito Cantillon", duration: "12:10" },
          { id: "m2-l8", title: "Por que os Governos Fazem Dívidas", duration: "13:30" },
          { id: "m2-l9", title: "A Importância do Capitalismo", duration: "14:00" },
          { id: "m2-l10", title: "Conclusão: o Papel da Inflação na Expansão da Dívida Pública", duration: "11:20" },
        ],
      },
      {
        id: "mod-dividas",
        title: "Dívidas, Gastos e Orçamento",
        subtitle: "Organize despesas, saia das dívidas e planeje seu orçamento",
        lessons: [
          { id: "m3-l1", title: "Diagnóstico Financeiro: Entendendo a Raiz do Endividamento", duration: "14:00" },
          { id: "m3-l2", title: "O Custo Invisível da Dívida: o Preço que Você Não Vê", duration: "12:30" },
          { id: "m3-l3", title: "Como Sair das Dívidas — Passo a Passo", duration: "18:00" },
          { id: "m3-l4", title: "A Vida do Zero a Zero: o Engano da Sobrevivência Financeira", duration: "11:45" },
          { id: "m3-l5", title: "O Grande Vilão: o Consumo Automático", duration: "13:20" },
          { id: "m3-l6", title: "A Mentira do \"Eu Mereço\" e da Classe Média Endividada", duration: "14:10" },
          { id: "m3-l7", title: "Por que Sobrar Dinheiro Não é o Fim, mas o Começo", duration: "10:00" },
          { id: "m3-l8", title: "Criando o Seu Orçamento Pessoal Inteligente", duration: "16:30" },
          { id: "m3-l9", title: "O Primeiro Passo para Investir e Fazer o Dinheiro Trabalhar", duration: "13:00" },
          { id: "m3-l10", title: "Aula Extra: Como Conversar sobre Dinheiro com a Família", duration: "11:50" },
        ],
      },
      {
        id: "mod-renda-fixa",
        title: "Renda Fixa",
        subtitle: "Conheça produtos e estratégias de renda fixa para investir com segurança",
        lessons: [
          { id: "m4-l1", title: "O que é a Renda Fixa", duration: "12:00" },
          { id: "m4-l2", title: "Mitos e Verdades da Renda Fixa", duration: "13:40" },
          { id: "m4-l3", title: "Endividamento x Investimentos: Consórcios, Financiamentos e Títulos de Capitalização", duration: "15:20" },
          { id: "m4-l4", title: "Tesouro Direto (Selic, Prefixado e IPCA+)", duration: "18:00" },
          { id: "m4-l5", title: "CDB, LCI, LCA e CDI: Entendendo a Renda Fixa dos Bancos e o Papel do FGC", duration: "16:30" },
          { id: "m4-l6", title: "Risco de Crédito e Bancos Ruins", duration: "11:00" },
          { id: "m4-l7", title: "Debêntures, CRI e CRA: a Renda Fixa de Empresas", duration: "13:50" },
          { id: "m4-l8", title: "IOF, IR e Tributação na Renda Fixa + COE", duration: "14:20" },
          { id: "m4-l9", title: "Pirâmides Financeiras e Golpes", duration: "12:10" },
          { id: "m4-l10", title: "Corretoras, Bancos e Home Broker: Por Onde Investir", duration: "15:00" },
          { id: "m4-l11", title: "Reserva de Emergência: Onde Colocar na Prática", duration: "13:30" },
          { id: "m4-l12", title: "Comprando Tesouro Direto na Prática — Passo a Passo", duration: "20:00" },
        ],
      },
      {
        id: "mod-renda-variavel",
        title: "Renda Variável",
        subtitle: "Aprenda sobre renda variável e como construir uma carteira diversificada",
        lessons: [
          { id: "m5-l1", title: "Renda Variável e Escolas de Análise: Fundamentalista x Gráfica", duration: "14:00" },
          { id: "m5-l2", title: "Ações: o que São e Por que Investir", duration: "12:30" },
          { id: "m5-l3", title: "Tipos de Ações e Nomenclaturas (ON, PN, Units e Tag Along)", duration: "13:20" },
          { id: "m5-l4", title: "Indicadores Fundamentais que Todo Investidor Deve Conhecer", duration: "18:00" },
          { id: "m5-l5", title: "Ferramentas e Sites para Consultar Indicadores", duration: "11:40" },
          { id: "m5-l6", title: "Como Comprar Ações pelo Home Broker e Principais Funcionalidades", duration: "16:00" },
          { id: "m5-l7", title: "Proventos: Dividendos, JCP, Bonificações e Subscrições", duration: "14:50" },
          { id: "m5-l8", title: "Desdobramentos e Grupamentos: Por que as Empresas Fazem Isso", duration: "10:30" },
          { id: "m5-l9", title: "Leitura de Gráficos: Candlesticks, Suportes e Resistências", duration: "19:00" },
          { id: "m5-l10", title: "Aluguel de Ações e Outras Formas de Rentabilizar sua Carteira", duration: "12:20" },
          { id: "m5-l11", title: "Fundos de Ações e Multimercados: Como Funcionam e Quando Usar", duration: "13:40" },
          { id: "m5-l12", title: "Fundos Imobiliários (FIIs): Como Geram Renda Passiva", duration: "15:30" },
          { id: "m5-l13", title: "Previdência Privada (PGBL e VGBL): Quando Vale a Pena", duration: "14:10" },
          { id: "m5-l14", title: "Carteira de Investimentos e Diversificação Inteligente", duration: "17:00" },
        ],
      },
    ],
  },
  {
    courseId: "energia-fotovoltaica",
    description: "Entenda como a energia solar pode economizar e gerar renda para você.",
    longDescription:
      "Do entendimento técnico à geração de renda: aprenda como a energia solar funciona, quanto você pode economizar, como instalar, financiar e até lucrar com o crescente mercado fotovoltaico no Brasil.",
    duration: "2h 40min",
    modules: [
      {
        id: "fv-mod-1",
        title: "Fundamentos",
        subtitle: "Mentalidade e entendimento sobre energia solar",
        lessons: [
          {
            id: "fv-l1",
            title: "O que é Energia Solar e Por que ela é uma Oportunidade",
            duration: "14:00",
          },
          {
            id: "fv-l2",
            title: "Economia Real: Quanto Você Pode Economizar",
            duration: "16:30",
          },
        ],
      },
      {
        id: "fv-mod-2",
        title: "Aplicação Prática",
        subtitle: "Para uso próprio: instalação, custo e financiamento",
        lessons: [
          {
            id: "fv-l3",
            title: "Como Instalar Energia Solar na Sua Casa",
            duration: "18:00",
          },
          {
            id: "fv-l4",
            title: "Quanto Custa e Como Financiar",
            duration: "15:20",
          },
        ],
      },
      {
        id: "fv-mod-3",
        title: "Renda com Energia Solar",
        subtitle: "Como ganhar dinheiro com o mercado fotovoltaico",
        lessons: [
          {
            id: "fv-l5",
            title: "Como Ganhar Dinheiro com Energia Solar",
            duration: "17:40",
          },
          {
            id: "fv-l6",
            title: "Mercado e Oportunidades",
            duration: "13:50",
          },
        ],
      },
      {
        id: "fv-mod-4",
        title: "Estratégia e Execução",
        subtitle: "Como começar do zero e evitar os erros mais comuns",
        lessons: [
          {
            id: "fv-l7",
            title: "Como Começar do Zero — Passo a Passo",
            duration: "19:00",
          },
          {
            id: "fv-l8",
            title: "Erros que Você Deve Evitar",
            duration: "14:30",
          },
        ],
      },
    ],
  },
  {
    courseId: "cozinha-inteligente",
    description: "Como comer bem gastando muito menos com método e organização.",
    longDescription:
      "Aprenda a controlar o custo real da sua alimentação, planejar compras, eliminar desperdícios e transformar a cozinha em uma ferramenta poderosa de economia mensal.",
    duration: "1h 50min",
    modules: [
      {
        id: "ci-mod-1",
        title: "Mentalidade e Consciência",
        subtitle: "Entenda o custo real da sua alimentação",
        lessons: [
          {
            id: "ci-l1",
            title: "O Custo Invisível da Alimentação",
            duration: "14:00",
          },
        ],
      },
      {
        id: "ci-mod-2",
        title: "Organização Financeira na Cozinha",
        subtitle: "Planejamento de compras e economia no supermercado",
        lessons: [
          {
            id: "ci-l2",
            title: "Como Planejar Suas Compras",
            duration: "15:30",
          },
          {
            id: "ci-l3",
            title: "Como Economizar no Supermercado",
            duration: "16:00",
          },
        ],
      },
      {
        id: "ci-mod-3",
        title: "Execução Prática",
        subtitle: "Meal prep, receitas econômicas e organização",
        lessons: [
          {
            id: "ci-l4",
            title: "Preparação Inteligente (Meal Prep)",
            duration: "17:20",
          },
          {
            id: "ci-l5",
            title: "Receitas Econômicas e Nutritivas",
            duration: "14:50",
          },
        ],
      },
      {
        id: "ci-mod-4",
        title: "Estratégia e Otimização",
        subtitle: "Eliminar desperdícios e criar um sistema de economia contínua",
        lessons: [
          {
            id: "ci-l6",
            title: "Como Reduzir Desperdícios",
            duration: "13:40",
          },
          {
            id: "ci-l7",
            title: "Construindo um Sistema de Economia Contínua",
            duration: "15:10",
          },
        ],
      },
    ],
  },
  {
    courseId: "renda-imoveis",
    description: "Como lucrar com Airbnb e aluguéis sem necessariamente ter um imóvel.",
    longDescription:
      "Aprenda a gerar renda com imóveis usando Airbnb, sublocação e gestão de propriedades de terceiros — do primeiro anúncio à escala do negócio, com números reais e estratégias práticas.",
    duration: "2h 20min",
    modules: [
      {
        id: "ri-mod-1",
        title: "Mentalidade e Oportunidade",
        subtitle: "Entenda o jogo da renda com imóveis",
        lessons: [
          {
            id: "ri-l1",
            title: "O Jogo da Renda com Imóveis",
            duration: "14:30",
          },
          {
            id: "ri-l2",
            title: "Você Não Precisa Ter um Imóvel",
            duration: "13:50",
          },
        ],
      },
      {
        id: "ri-mod-2",
        title: "Primeiros Passos",
        subtitle: "Como escolher o imóvel e montar um espaço que vende",
        lessons: [
          {
            id: "ri-l3",
            title: "Como Escolher o Imóvel Ideal",
            duration: "15:20",
          },
          {
            id: "ri-l4",
            title: "Montando um Espaço que Vende",
            duration: "14:00",
          },
        ],
      },
      {
        id: "ri-mod-3",
        title: "Plataforma e Execução",
        subtitle: "Anúncio, precificação e posicionamento no Airbnb",
        lessons: [
          {
            id: "ri-l5",
            title: "Como Criar um Anúncio que Converte",
            duration: "16:40",
          },
          {
            id: "ri-l6",
            title: "Precificação Estratégica",
            duration: "13:10",
          },
        ],
      },
      {
        id: "ri-mod-4",
        title: "Operação e Escala",
        subtitle: "Gestão de hóspedes e os números reais do negócio",
        lessons: [
          {
            id: "ri-l7",
            title: "Gestão de Hóspedes e Operação",
            duration: "15:30",
          },
          {
            id: "ri-l8",
            title: "Quanto Você Pode Ganhar — Números Reais",
            duration: "17:00",
          },
        ],
      },
      {
        id: "ri-mod-5",
        title: "Riscos e Crescimento",
        subtitle: "Erros que podem te fazer perder dinheiro",
        lessons: [
          {
            id: "ri-l9",
            title: "Erros que Podem te Fazer Perder Dinheiro",
            duration: "14:20",
          },
        ],
      },
    ],
  },
  {
    courseId: "negocios-do-zero",
    description: "Como criar uma renda real com pouco dinheiro e muita execução.",
    longDescription:
      "Aprenda a identificar oportunidades ao seu redor, validar uma ideia sem gastar dinheiro, conseguir os primeiros clientes e transformar uma renda extra em um negócio consistente.",
    duration: "2h 10min",
    modules: [
      {
        id: "ndz-mod-1",
        title: "Mentalidade e Visão de Negócio",
        subtitle: "O que é um pequeno negócio de verdade e como enxergar oportunidades",
        lessons: [
          {
            id: "ndz-l1",
            title: "O que é um Pequeno Negócio de Verdade",
            duration: "13:20",
          },
          {
            id: "ndz-l2",
            title: "Encontrando Oportunidades ao Seu Redor",
            duration: "14:40",
          },
        ],
      },
      {
        id: "ndz-mod-2",
        title: "Validação sem Gastar Dinheiro",
        subtitle: "Testar a ideia e fechar as primeiras vendas",
        lessons: [
          {
            id: "ndz-l3",
            title: "Testando uma Ideia sem Investir",
            duration: "15:00",
          },
          {
            id: "ndz-l4",
            title: "Como Vender Mesmo sem Experiência",
            duration: "14:10",
          },
        ],
      },
      {
        id: "ndz-mod-3",
        title: "Execução Prática",
        subtitle: "Estruturar o negócio e divulgar sem gastar dinheiro",
        lessons: [
          {
            id: "ndz-l5",
            title: "Estruturando Seu Negócio Simples",
            duration: "16:30",
          },
          {
            id: "ndz-l6",
            title: "Como Divulgar sem Gastar Dinheiro",
            duration: "13:50",
          },
        ],
      },
      {
        id: "ndz-mod-4",
        title: "Crescimento e Consistência",
        subtitle: "Transformar renda extra em negócio e evitar os erros fatais",
        lessons: [
          {
            id: "ndz-l7",
            title: "Transformando Renda Extra em Negócio",
            duration: "15:20",
          },
          {
            id: "ndz-l8",
            title: "Erros que Quebram Pequenos Negócios",
            duration: "13:00",
          },
        ],
      },
    ],
  },
  {
    courseId: "renda-online",
    description: "Como ganhar dinheiro na internet de forma real e consistente.",
    longDescription:
      "Aprenda a escolher o caminho certo baseado no seu perfil, fazer sua primeira venda online, crescer nas plataformas certas e construir um sistema de renda contínua — sem cair em promessas falsas.",
    duration: "2h 40min",
    modules: [
      {
        id: "ro-mod-1",
        title: "Mentalidade e Realidade do Digital",
        subtitle: "O mito do dinheiro fácil e as formas que realmente funcionam",
        lessons: [
          {
            id: "ro-l1",
            title: "O Mito do Dinheiro Fácil na Internet",
            duration: "12:50",
          },
          {
            id: "ro-l2",
            title: "As Principais Formas de Ganhar Dinheiro Online",
            duration: "15:30",
          },
        ],
      },
      {
        id: "ro-mod-2",
        title: "Começando do Zero",
        subtitle: "Escolher o primeiro caminho e criar sua primeira fonte de renda",
        lessons: [
          {
            id: "ro-l3",
            title: "Como Escolher Seu Primeiro Caminho",
            duration: "14:00",
          },
          {
            id: "ro-l4",
            title: "Criando Sua Primeira Fonte de Renda Online",
            duration: "16:20",
          },
        ],
      },
      {
        id: "ro-mod-3",
        title: "Execução Prática",
        subtitle: "Primeira venda e plataformas para começar",
        lessons: [
          {
            id: "ro-l5",
            title: "Como Fazer Sua Primeira Venda",
            duration: "15:40",
          },
          {
            id: "ro-l6",
            title: "Plataformas que Você Pode Usar",
            duration: "14:10",
          },
        ],
      },
      {
        id: "ro-mod-4",
        title: "Crescimento",
        subtitle: "Aumentar a renda e construir presença online",
        lessons: [
          {
            id: "ro-l7",
            title: "Como Aumentar Sua Renda",
            duration: "13:50",
          },
          {
            id: "ro-l8",
            title: "Construindo uma Presença Online",
            duration: "14:30",
          },
        ],
      },
      {
        id: "ro-mod-5",
        title: "Estrutura e Consistência",
        subtitle: "Sistema de renda contínua e erros que travam o crescimento",
        lessons: [
          {
            id: "ro-l9",
            title: "Criando um Sistema de Renda Contínua",
            duration: "15:00",
          },
          {
            id: "ro-l10",
            title: "Erros que te Impedem de Ganhar Dinheiro Online",
            duration: "13:20",
          },
        ],
      },
    ],
  },
]

export function getCourseContent(courseId: string): CourseContent | undefined {
  return courseContents.find((c) => c.courseId === courseId)
}

export function getFreeLesson(courseId: string): Lesson | undefined {
  const content = getCourseContent(courseId)
  if (!content) return undefined
  for (const mod of content.modules) {
    const free = mod.lessons.find((l) => l.free)
    if (free) return free
  }
  return undefined
}
