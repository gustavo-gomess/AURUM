import type { SEOPageData } from "@/types/seo-page"

// ─── Re-exporta os tipos do sistema de templates ──────────────────────────────
export type {
  SEOPageData,
  ContentBlock,
  StepItem,
  MistakeItem,
  FAQItem,
  CTAConfig,
} from "@/types/seo-page"

// ─── Tipos legados (usados pelos componentes Blog*.tsx anteriores) ─────────────
export type BlogStep = {
  number: number
  title: string
  description: string
  tip?: string
}
export type BlogMistake = {
  icon: string
  title: string
  description: string
}
export type BlogFAQItem = {
  question: string
  answer: string
}
export type BlogPost = {
  slug: string
  metaTitle: string
  metaDescription: string
  title: string
  category: string
  publishedAt: string
  updatedAt: string
  readingTime: number
  intro: string
  keyPoint: string
  steps: BlogStep[]
  mistakes: BlogMistake[]
  faqs: BlogFAQItem[]
}

// ─── CTA padrão da AURUM (reutilize nas páginas) ──────────────────────────────
export const aurumCTA = {
  badge: "AURUM Nova Escola",
  headline: "Aprenda educação financeira do zero — no seu ritmo.",
  description:
    "Do controle de gastos ao primeiro investimento. Conteúdo direto ao ponto, sem enrolação, pensado para quem quer resultados reais na vida financeira.",
  benefits: [
    "Curso completo de educação financeira do zero ao avançado",
    "Suporte direto com nossa equipe via WhatsApp",
    "Cursos extras chegando em breve",
    "1 ano de acesso completo — aprenda quando quiser",
  ],
  price: {
    original: "R$ 79,90/mês",
    current: "39",
    period: "/mês",
    note: "equivale a R$ 1,30 por dia · parcelado em 12x via InfinitPay",
  },
  buttonText: "Quero começar agora",
  buttonHref:
    "https://api.whatsapp.com/send/?phone=55&text=Ol%C3%A1%2C+quero+assinar+a+AURUM+por+R%2439%2Fm%C3%AAs&type=phone_number&app_absent=0",
  guarantee: "7 dias de garantia — sem burocracia · Pagamento seguro via InfinitPay",
} satisfies SEOPageData["cta"]

// ─── Páginas SEO ──────────────────────────────────────────────────────────────

export const seoPages: SEOPageData[] = [
  {
    slug: "como-sair-das-dividas-rapido",
    metaTitle: "Como Sair das Dívidas Rápido — Guia Prático | AURUM",
    metaDescription:
      "Passo a passo prático para sair das dívidas rápido. Veja os erros que te prendem e como evitá-los. Guia gratuito da AURUM Nova Escola.",
    category: "Finanças Pessoais",
    title: "Como Sair das Dívidas Rápido: O Guia Que Ninguém Te Deu",
    subtitle:
      "Do caos financeiro ao controle em 5 passos práticos — sem julgamentos, sem promessas vazias.",
    publishedAt: "2026-03-17",
    updatedAt: "2026-03-17",
    readingTime: 8,

    // ── Intro: empatia antes de solução ─────────────────────────────────────
    intro:
      "Você trabalha, recebe, paga o mínimo — e no mês seguinte a dívida ainda está lá, às vezes maior do que antes. Não é falta de esforço. É falta de método. Este guia existe para mostrar que sair das dívidas é uma questão de ordem e estratégia, não de sacrifício extremo.",

    // ── Keypoint: verdade contraintuitiva (gera reflexão) ───────────────────
    keyPoint:
      "Sair das dívidas não é sobre ganhar mais dinheiro. É sobre parar de perder dinheiro para os juros. A diferença entre quem fica preso e quem se liberta é uma só: quem age com estratégia.",

    content: [
      // ── Bloco 1: micro-comprometimento (identificação) ───────────────────
      {
        type: "checklist",
        heading: "Esse guia é para você se...",
        subheading:
          "Leia os itens abaixo. Quanto mais você se identificar, mais este conteúdo foi feito para a sua situação.",
        items: [
          "Você paga o mínimo do cartão todo mês e o saldo quase não diminui",
          "Você não sabe o valor exato do total das suas dívidas hoje",
          "Tem dívidas atrasadas, nome sujo ou restrições no Serasa",
          "O salário acaba antes do mês terminar, mesmo sem grandes luxos",
          "Você sente que trabalha muito, mas a situação financeira não muda",
        ],
      },

      // ── Bloco 2: passo a passo (solução) ────────────────────────────────
      {
        type: "steps",
        label: "Passo a passo",
        heading: "5 Passos Para Sair das Dívidas",
        subheading:
          "Siga essa sequência na ordem. Pular etapas é o motivo pelo qual a maioria desiste no meio do caminho.",
        items: [
          {
            number: 1,
            title: "Mapeie tudo — sem esconder nada",
            description:
              "Anote cada dívida: credor, valor atualizado, taxa de juros mensal e vencimento. Sim, o número final pode assustar — mas ele já existe, você só está escolhendo não ver. E o que não é visto não pode ser resolvido. Quase todo mundo que faz esse mapeamento sente alívio depois, porque qualquer número concreto é menos assustador do que a angústia do desconhecido.",
            tip: "Acesse registrato.bcb.gov.br (Banco Central) para ver todas as suas dívidas registradas em um lugar só — inclusive as que você pode ter esquecido.",
          },
          {
            number: 2,
            title: "Escolha uma estratégia e comprometa-se com ela",
            description:
              "Método Avalanche: pague primeiro a dívida com maior taxa de juros. Economiza mais dinheiro no total — ideal para dívidas de cartão (15%+ ao mês). Método Bola de Neve: pague primeiro a menor dívida. Gera vitórias rápidas e mantém a motivação. A escolha certa é a que você vai conseguir manter. Mudar de método no meio do caminho é o que destrói o progresso.",
            tip: "Cartão de crédito com juros de 15% ao mês transforma R$ 1.000 em R$ 5.350 em apenas 12 meses. Se tiver cartão, ele vai primeiro — sempre.",
          },
          {
            number: 3,
            title: "Identifique os gastos que sangram sem você perceber",
            description:
              "Não é necessário cortar tudo. É necessário cortar o que você não nota. Assinaturas paradas, apps pagos que não usa, compras por impulso nos primeiros dias do mês — esses valores somados costumam representar 15 a 25% do salário. A meta não é sofrimento: é liberar pelo menos 20% da sua renda para pagar acima do mínimo nas dívidas prioritárias.",
            tip: "Técnica dos 24h: antes de qualquer compra não planejada acima de R$ 50, espere um dia. Você vai ver que metade delas perde a urgência sozinha.",
          },
          {
            number: 4,
            title: "Adicione qualquer fonte de renda extra",
            description:
              "R$ 300 por mês a mais pode eliminar meses inteiros do prazo para quitar suas dívidas. Não precisa ser algo grande: vender o que não usa (OLX, Enjoei, Shopee), fazer bicos nos fins de semana, oferecer serviços simples no bairro. O segredo é aplicar 100% dessa renda extra diretamente na dívida de maior juros — sem desviar.",
            tip: "Se você liberou 3h por semana, já dá para gerar renda extra. GetNinjas e Workana têm demanda real para dezenas de habilidades que você provavelmente já tem.",
          },
          {
            number: 5,
            title: "Negocie — os credores esperam por isso",
            description:
              "Dívidas atrasadas há mais de 90 dias têm uma característica pouco divulgada: os credores já as contabilizaram como perdidas. Por isso, aceitam descontos de 50% a 80% com frequência. Você não está pedindo favor — está fazendo uma proposta de negócio que interessa a ambos. Use Serasa Limpa Nome, Acordo Certo ou ligue diretamente. A única coisa que não funciona é não tentar.",
            tip: "Antes de ligar, calcule qual é o valor máximo que você consegue pagar à vista ou parcelado de forma realista. Ter esse número claro na cabeça evita fechar acordos que você não consegue cumprir.",
          },
        ],
      },

      // ── Bloco 3: resultado esperado (prova + esperança) ──────────────────
      {
        type: "callout",
        variant: "gold",
        text: "Seguindo esses 5 passos de forma consistente por 60 a 90 dias, o resultado esperado é: pelo menos uma dívida quitada, menos juros pagos mensalmente, e — mais importante — a sensação real de controle sobre o próprio dinheiro. Não é promessa. É consequência natural de agir com método.",
      },

      // ── Bloco 4: benefícios concretos (checklist de resultado) ───────────
      {
        type: "checklist",
        heading: "O que muda quando você segue esse plano",
        subheading: "Benefícios concretos que a maioria das pessoas alcança em 60 a 90 dias.",
        items: [
          "Você sabe exatamente quanto deve, para quem e a que juros",
          "Você está pagando pelo menos uma dívida acima do mínimo todo mês",
          "Você negociou (ou está negociando) as dívidas em atraso com desconto",
          "Você tem um orçamento simples que realmente usa no dia a dia",
          "Você parou de sentir ansiedade toda vez que abre o extrato bancário",
        ],
      },

      // ── Bloco 5: erros comuns (reforço + urgência leve) ──────────────────
      {
        type: "mistakes",
        label: "Cuidado",
        heading: "Os Erros Que Mantêm as Pessoas Presas nas Dívidas",
        subheading:
          "Evitar esses comportamentos vale tanto quanto seguir o passo a passo — às vezes mais.",
        items: [
          {
            icon: "💳",
            title: "Pagar só o mínimo do cartão de crédito",
            description:
              "O pagamento mínimo existe para beneficiar o banco, não você. Com juros de 15% ao mês, R$ 1.000 vira R$ 5.350 em 12 meses pagando apenas o mínimo. Não é exagero — é matemática. Pague o máximo que conseguir, mesmo que pareça pouco.",
          },
          {
            icon: "🙈",
            title: "Ignorar a dívida esperando 'uma hora melhorar'",
            description:
              "Dívida ignorada não vai embora — ela cresce silenciosamente com juros, multas e correção monetária. Cada mês de atraso aumenta o valor final e reduz seu poder de negociação. O melhor momento para agir foi no mês passado. O segundo melhor momento é agora.",
          },
          {
            icon: "🔄",
            title: "Contrair novos empréstimos para pagar dívidas antigas",
            description:
              "Isso pode ser estratégico se os juros do novo crédito forem realmente menores. Mas, sem planejamento, é o caminho mais rápido de transformar uma dívida em duas. Antes de qualquer empréstimo, tente negociar diretamente — o resultado costuma ser bem melhor.",
          },
          {
            icon: "📊",
            title: "Continuar gastando sem controle enquanto paga dívidas",
            description:
              "Pagar dívidas sem controlar os gastos é como tentar encher um balde com furo no fundo. Você não precisa registrar cada centavo — mas precisa saber, pelo menos de forma aproximada, para onde vai cada real. Senão as dívidas voltam.",
          },
        ],
      },
    ],

    // ── CTA específico deste post (mais contextual que o aurumCTA padrão) ──
    cta: {
      badge: "Próximo passo natural",
      headline: "Saiu das dívidas. Agora aprenda a nunca mais voltar.",
      description:
        "Na AURUM você aprende o que vem depois: como construir reserva de emergência, entender investimentos e criar patrimônio com o que sobra todo mês — do zero ao avançado, no seu ritmo.",
      benefits: [
        "Controle de orçamento e saída definitiva das dívidas",
        "Como montar sua reserva de emergência passo a passo",
        "Primeiros investimentos explicados de forma simples",
        "Suporte direto com nossa equipe via WhatsApp",
        "1 ano de acesso — aprenda quando e onde quiser",
      ],
      price: {
        original: "R$ 79,90/mês",
        current: "39",
        period: "/mês",
        note: "equivale a R$ 1,30 por dia · parcelado em 12x via InfinitPay",
      },
      buttonText: "Começar minha jornada financeira",
      buttonHref:
        "https://api.whatsapp.com/send/?phone=55&text=Ol%C3%A1%2C+quero+assinar+a+AURUM+por+R%2439%2Fm%C3%AAs&type=phone_number&app_absent=0",
      guarantee: "7 dias de garantia — sem burocracia · Pagamento seguro via InfinitPay",
    },

    // ── FAQs: respostas práticas com ponte natural para a AURUM ─────────────
    faqs: [
      {
        question: "É possível sair das dívidas sem cortar absolutamente tudo?",
        answer:
          "Sim — e aliás, tentar cortar tudo de uma vez é uma das principais razões pelas quais as pessoas desistem. O objetivo é eficiência, não sofrimento. Na prática, cortar 2 ou 3 hábitos automáticos (aquela assinatura que você esqueceu, o delivery toda semana) já libera margem suficiente para começar. O que importa é manter a consistência, não a perfeição.",
      },
      {
        question: "Qual é melhor: método avalanche ou bola de neve?",
        answer:
          "Matematicamente, o Avalanche (pagar maior juros primeiro) economiza mais dinheiro. Psicologicamente, a Bola de Neve (pagar menor dívida primeiro) sustenta a motivação por mais tempo. A resposta honesta: o melhor método é o que você vai manter por meses. Se você precisa de vitórias rápidas para não desistir, comece pela Bola de Neve. Se consegue pensar a longo prazo, o Avalanche poupa mais.",
      },
      {
        question: "Vale a pena fazer renegociação de dívida?",
        answer:
          "Na maioria dos casos, vale muito a pena — especialmente em dívidas atrasadas há mais de 3 meses. Os credores já contabilizaram essas dívidas como de difícil recuperação, então descontos de 50% a 80% são comuns. Você não está pedindo favor; está fazendo uma proposta que também interessa a eles. Plataformas gratuitas como Serasa Limpa Nome e Acordo Certo facilitam muito esse processo.",
      },
      {
        question: "Devo usar o FGTS para pagar dívidas?",
        answer:
          "Depende da taxa de juros da dívida. O FGTS rende cerca de 3% ao ano. Se sua dívida cobra 15% ao mês (cartão de crédito, por exemplo), usar o FGTS para quitá-la é uma troca extremamente vantajosa. Se a dívida tem juros mais baixos, pense duas vezes — o FGTS é também uma reserva de segurança para momentos de desemprego.",
      },
      {
        question: "Como evitar cair em dívidas de novo depois de quitar?",
        answer:
          "O passo imediato é construir uma reserva de emergência — idealmente entre 3 e 6 meses de despesas. Com esse colchão, imprevistos como uma multa, uma consulta médica ou um mês de renda menor não precisam virar dívida no cartão. Esse é exatamente o próximo módulo que ensinamos na AURUM, logo depois do controle de dívidas.",
      },
      {
        question: "Por onde começo a aprender sobre investimentos depois de sair das dívidas?",
        answer:
          "O primeiro passo é a reserva de emergência em renda fixa líquida (como o Tesouro Selic). Depois disso, você pode começar a diversificar gradualmente. O caminho não precisa ser sofisticado para ser eficiente — consistência e paciência fazem mais do que qualquer estratégia complexa. Na AURUM, temos esse caminho mapeado do zero ao primeiro investimento.",
      },
    ],
  },
]

// ─── API pública ──────────────────────────────────────────────────────────────

export function getSEOPage(slug: string): SEOPageData | undefined {
  return seoPages.find((p) => p.slug === slug)
}
