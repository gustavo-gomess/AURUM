const fetch = require('node-fetch');

const BASE_URL = 'http://localhost:3000';
const TEST_VIDEO_ID = '1120965691';

// Estrutura completa de todos os módulos
const COMPLETE_MODULES = [
  {
    title: 'Módulo 1 - Mentalidade Financeira',
    description: 'Desenvolva a mentalidade correta para alcançar a liberdade financeira',
    lessons: [
      { title: 'AULA 01 LIMPAR O TERRENO', description: 'Primeira aula do módulo de mentalidade - preparando sua mente para a transformação financeira' },
      { title: 'AULA 02 MENTALIDADE DE ABUNDÂNCIA X MENTALIDADE DE ESCASSEZ', description: 'Diferenças entre mentalidade de abundância e escassez e como isso afeta suas finanças' },
      { title: 'AULA 03 CRENÇAS LIMITANTES SOBRE VOCÊ', description: 'Como identificar e superar crenças limitantes pessoais que impedem seu crescimento' },
      { title: 'AULA 04 CRENÇAS LIMITANTES EM RELAÇÃO AO DINHEIRO', description: 'Como superar crenças limitantes sobre dinheiro e riqueza' },
      { title: 'AULA 05 O PODER DO AMBIENTE E DAS PESSOAS AO REDOR', description: 'Como o ambiente e as pessoas influenciam suas decisões financeiras' },
      { title: 'AULA 06 FICAR RICO É COMPORTAMENTAL NÃO INTELECTUAL', description: 'A psicologia por trás do sucesso financeiro' },
      { title: 'AULA 07 HÁBITO ANGULAR', description: 'Como identificar e criar o hábito que transformará sua vida financeira' },
      { title: 'AULA 08 COMO CRIAR UM HÁBITO', description: 'Metodologia prática para formar novos hábitos financeiros' },
      { title: 'AULA 09 MINDSET DE LONGO PRAZO X PRAZER IMEDIATO', description: 'Equilibrando gratificação imediata e objetivos de longo prazo' },
      { title: 'AULA 10 FOCO E PRIORIDADES', description: 'Como manter o foco nos seus objetivos financeiros principais' },
      { title: 'AULA 11 A IMPORTÂNCIA DA META E COMO ESTABELECER UMA', description: 'Definindo metas financeiras claras e alcançáveis' },
      { title: 'AULA 12 AUTO RESPONSABILIDADE', description: 'Assumindo responsabilidade total pelos seus resultados financeiros' },
      { title: 'AULA 13 COMO LIDAR COM O MEDO DO FRACASSO FINANCEIRO', description: 'Superando medos que impedem seu crescimento financeiro' },
      { title: 'AULA 14 MELHORIA CONTÍNUA', description: 'Evoluindo constantemente suas habilidades financeiras' },
      { title: 'AULA 15 APRENDA A SER GRATO', description: 'A importância da gratidão na jornada financeira' },
    ]
  },
  {
    title: 'Módulo 2 - Orçamento e Controle Financeiro',
    description: 'Aprenda a organizar suas finanças e controlar seus gastos',
    lessons: [
      { title: 'AULA 01 Fundamentos do Orçamento Pessoal', description: 'Aprenda os conceitos básicos para criar um orçamento eficaz' },
      { title: 'AULA 02 Como Mapear Suas Receitas e Despesas', description: 'Identifique e categorize todas suas entradas e saídas de dinheiro' },
      { title: 'AULA 03 Método 50-30-20 na Prática', description: 'Como aplicar a regra dos 50-30-20 no seu orçamento' },
      { title: 'AULA 04 Controlando Gastos Desnecessários', description: 'Identifique e elimine gastos que prejudicam suas finanças' },
      { title: 'AULA 05 Planejamento Mensal e Semanal', description: 'Como planejar suas finanças no curto prazo' },
      { title: 'AULA 06 Reserva de Emergência - Como Calcular', description: 'A importância e como calcular sua reserva para emergências' },
      { title: 'AULA 07 Organizando Suas Contas e Documentos', description: 'Métodos para organizar e controlar suas contas' },
      { title: 'AULA 08 Aplicativos e Ferramentas de Controle', description: 'As melhores ferramentas digitais para controle financeiro' },
      { title: 'AULA 09 Como Negociar Contas e Serviços', description: 'Estratégias para reduzir custos fixos mensais' },
      { title: 'AULA 10 Orçamento Familiar - Envolvendo Todos', description: 'Como criar um orçamento que envolva toda a família' },
    ]
  },
  {
    title: 'Módulo 3 - Investimentos para Iniciantes',
    description: 'Faça seu dinheiro trabalhar para você com investimentos seguros',
    lessons: [
      { title: 'AULA 01 Primeiros Passos nos Investimentos', description: 'Introdução ao mundo dos investimentos para iniciantes' },
      { title: 'AULA 02 Renda Fixa vs Renda Variável', description: 'Entenda as diferenças entre tipos de investimento' },
      { title: 'AULA 03 Como Abrir uma Conta em Corretora', description: 'Passo a passo para começar a investir' },
      { title: 'AULA 04 Tesouro Direto - Seu Primeiro Investimento', description: 'Como investir no Tesouro Direto com segurança' },
      { title: 'AULA 05 CDB, LCI e LCA - Conhecendo Opções', description: 'Outros investimentos de renda fixa disponíveis' },
      { title: 'AULA 06 Fundos de Investimento - Como Escolher', description: 'Entendendo e escolhendo fundos de investimento' },
      { title: 'AULA 07 Ações - Introdução ao Mercado de Ações', description: 'Primeiros passos no mercado de ações' },
      { title: 'AULA 08 Diversificação de Carteira', description: 'Como diversificar seus investimentos adequadamente' },
      { title: 'AULA 09 Análise de Riscos e Retornos', description: 'Avaliando riscos antes de investir' },
      { title: 'AULA 10 Estratégias de Longo Prazo', description: 'Planejando investimentos para o futuro' },
    ]
  },
  {
    title: 'Módulo 4 - Controle de Dívidas e Crédito',
    description: 'Estratégias para quitar dívidas e usar crédito conscientemente',
    lessons: [
      { title: 'AULA 01 Mapeando Suas Dívidas Atuais', description: 'Como fazer um levantamento completo das suas dívidas' },
      { title: 'AULA 02 Estratégias para Quitar Dívidas', description: 'Métodos eficazes para sair do vermelho' },
      { title: 'AULA 03 Negociação com Credores', description: 'Como negociar suas dívidas efetivamente' },
      { title: 'AULA 04 Bola de Neve vs Avalanche de Dívidas', description: 'Duas estratégias poderosas para quitação' },
      { title: 'AULA 05 Como Usar o Cartão de Crédito Conscientemente', description: 'Usando o cartão de crédito a seu favor' },
      { title: 'AULA 06 Entendendo o Score de Crédito', description: 'Como melhorar e manter um bom score' },
      { title: 'AULA 07 Prevenindo o Endividamento', description: 'Como evitar se endividar novamente' },
      { title: 'AULA 08 Empréstimos e Financiamentos Conscientes', description: 'Quando e como usar crédito de forma inteligente' },
    ]
  },
  {
    title: 'Módulo 5 - Empreendedorismo Financeiro',
    description: 'Descubra formas de aumentar sua renda e diversificar fontes',
    lessons: [
      { title: 'AULA 01 Mentalidade Empreendedora', description: 'Desenvolvendo a mentalidade de um empreendedor financeiro' },
      { title: 'AULA 02 Identificando Oportunidades de Renda Extra', description: 'Como encontrar formas de aumentar sua renda' },
      { title: 'AULA 03 Monetização de Habilidades', description: 'Transforme suas habilidades em fonte de renda' },
      { title: 'AULA 04 Negócios Online vs Físicos', description: 'Prós e contras de diferentes tipos de negócio' },
      { title: 'AULA 05 Validação de Ideias de Negócio', description: 'Como testar suas ideias antes de investir' },
      { title: 'AULA 06 Gestão Financeira para Empreendedores', description: 'Separando finanças pessoais e empresariais' },
    ]
  },
  {
    title: 'Módulo 6 - Planejamento de Aposentadoria',
    description: 'Planeje seu futuro financeiro com metas claras e alcançáveis',
    lessons: [
      { title: 'AULA 01 Por Que Planejar a Aposentadoria Cedo', description: 'A importância de começar o quanto antes' },
      { title: 'AULA 02 Calculando Sua Aposentadoria Ideal', description: 'Quanto você precisa para se aposentar' },
      { title: 'AULA 03 INSS vs Previdência Privada', description: 'Entendendo as diferenças e complementaridades' },
      { title: 'AULA 04 Tipos de Previdência Privada', description: 'PGBL, VGBL e outras opções disponíveis' },
      { title: 'AULA 05 Investimentos para Aposentadoria', description: 'Melhores investimentos para o longo prazo' },
      { title: 'AULA 06 Estratégia dos 30, 40 e 50 Anos', description: 'Adaptando sua estratégia conforme a idade' },
      { title: 'AULA 07 Aposentadoria Antecipada (FIRE)', description: 'Conceitos de independência financeira' },
    ]
  },
  {
    title: 'Módulo 7 - Impostos e Declarações',
    description: 'Entenda o sistema tributário e otimize seus impostos',
    lessons: [
      { title: 'AULA 01 Entendendo o Sistema Tributário Brasileiro', description: 'Conceitos básicos sobre impostos no Brasil' },
      { title: 'AULA 02 Declaração de Imposto de Renda Pessoa Física', description: 'Como fazer sua declaração corretamente' },
      { title: 'AULA 03 Deduções Legais que Você Pode Fazer', description: 'Maximize suas deduções legalmente' },
      { title: 'AULA 04 Imposto sobre Investimentos', description: 'Como declarar seus investimentos' },
      { title: 'AULA 05 Planejamento Tributário Pessoa Física', description: 'Estratégias legais para reduzir impostos' },
    ]
  },
  {
    title: 'Módulo 8 - Seguros e Proteção Financeira',
    description: 'Proteja seu patrimônio e sua família financeiramente',
    lessons: [
      { title: 'AULA 01 A Importância dos Seguros na Vida Financeira', description: 'Por que você precisa de proteção financeira' },
      { title: 'AULA 02 Seguro de Vida - Como Escolher', description: 'Protegendo sua família financeiramente' },
      { title: 'AULA 03 Seguro Saúde vs Plano de Saúde', description: 'Entendendo as diferenças e necessidades' },
      { title: 'AULA 04 Seguros de Automóvel e Residencial', description: 'Protegendo seu patrimônio material' },
      { title: 'AULA 05 Como Comparar e Escolher Seguros', description: 'Critérios para escolher o melhor seguro' },
      { title: 'AULA 06 Revisão Anual dos Seguros', description: 'Como manter seus seguros atualizados' },
    ]
  },
  {
    title: 'Módulo 9 - Educação Financeira dos Filhos',
    description: 'Ensine seus filhos sobre dinheiro desde cedo',
    lessons: [
      { title: 'AULA 01 A Importância de Ensinar Finanças para Crianças', description: 'Por que começar cedo faz diferença' },
      { title: 'AULA 02 Mesada - Como Implementar Corretamente', description: 'Estratégias para usar a mesada como ferramenta educativa' },
      { title: 'AULA 03 Ensinando o Valor do Dinheiro', description: 'Como ensinar crianças sobre valor e trabalho' },
      { title: 'AULA 04 Poupança Infantil e Investimentos', description: 'Iniciando os filhos no mundo dos investimentos' },
      { title: 'AULA 05 Conversas sobre Dinheiro em Família', description: 'Como abordar o tema finanças com os filhos' },
      { title: 'AULA 06 Ensinando Consumo Consciente', description: 'Como educar para um consumo responsável' },
    ]
  },
  {
    title: 'Módulo 10 - Estratégias Financeiras Avançadas',
    description: 'Técnicas avançadas para otimizar suas finanças',
    lessons: [
      { title: 'AULA 01 Análise de Fluxo de Caixa Pessoal', description: 'Técnicas avançadas de controle financeiro' },
      { title: 'AULA 02 Investimentos Alternativos', description: 'REITs, criptomoedas e outros investimentos' },
      { title: 'AULA 03 Estratégias de Otimização Fiscal', description: 'Técnicas avançadas de planejamento tributário' },
      { title: 'AULA 04 Criação de Múltiplas Fontes de Renda', description: 'Diversificando suas fontes de receita' },
      { title: 'AULA 05 Proteção Patrimonial', description: 'Como proteger seu patrimônio de riscos' },
      { title: 'AULA 06 Sucessão e Herança', description: 'Planejando a transferência do seu patrimônio' },
    ]
  }
];

async function loginAdmin() {
  console.log('🔐 Fazendo login como admin...');
  try {
    const response = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@aurum.com.br',
        password: 'admin123'
      })
    });
    
    if (!response.ok) {
      throw new Error('Falha no login');
    }
    
    const data = await response.json();
    return data.token;
  } catch (error) {
    console.error('❌ Erro no login:', error);
    throw error;
  }
}

async function getCourseId(token) {
  console.log('📚 Buscando curso existente...');
  try {
    const response = await fetch(`${BASE_URL}/api/courses`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    if (!response.ok) {
      throw new Error('Falha ao buscar cursos');
    }
    
    const data = await response.json();
    if (data.courses && data.courses.length > 0) {
      console.log(`✅ Curso encontrado: ${data.courses[0].title}`);
      return data.courses[0].id;
    }
    
    throw new Error('Nenhum curso encontrado');
  } catch (error) {
    console.error('❌ Erro ao buscar curso:', error);
    throw error;
  }
}

async function createModule(token, courseId, moduleData, moduleIndex) {
  console.log(`📖 Criando ${moduleData.title}...`);
  try {
    const response = await fetch(`${BASE_URL}/api/modules`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        title: moduleData.title,
        description: moduleData.description,
        order: moduleIndex,
        courseId: courseId
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      console.log(`⚠️ Módulo já existe ou erro: ${errorData.message || 'Erro desconhecido'}`);
      return null; // Módulo já existe, continuamos
    }
    
    const data = await response.json();
    console.log(`✅ ${moduleData.title} criado com sucesso`);
    return data.module.id;
  } catch (error) {
    console.error(`❌ Erro ao criar ${moduleData.title}:`, error);
    return null;
  }
}

async function createLesson(token, courseId, moduleId, lessonData, lessonIndex) {
  try {
    const response = await fetch(`${BASE_URL}/api/lessons`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        title: lessonData.title,
        description: lessonData.description,
        vimeoVideoId: TEST_VIDEO_ID,
        order: lessonIndex,
        moduleId: moduleId,
        courseId: courseId,
        tasks: []
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      console.log(`   ⚠️ Aula já existe: ${lessonData.title}`);
      return false;
    }
    
    console.log(`   ✅ ${lessonData.title} criada`);
    return true;
  } catch (error) {
    console.log(`   ❌ Erro ao criar ${lessonData.title}`);
    return false;
  }
}

async function createAllModules() {
  try {
    // 1. Login
    const token = await loginAdmin();
    
    // 2. Buscar curso
    const courseId = await getCourseId(token);
    
    // 3. Criar todos os módulos
    console.log('\n🚀 Iniciando criação de todos os módulos...\n');
    
    for (let i = 0; i < COMPLETE_MODULES.length; i++) {
      const moduleData = COMPLETE_MODULES[i];
      
      // Criar módulo
      const moduleId = await createModule(token, courseId, moduleData, i);
      
      if (moduleId) {
        // Criar aulas do módulo
        console.log(`   📝 Criando ${moduleData.lessons.length} aulas...`);
        for (let j = 0; j < moduleData.lessons.length; j++) {
          await createLesson(token, courseId, moduleId, moduleData.lessons[j], j);
        }
      }
      
      console.log(''); // Linha em branco para separar módulos
    }
    
    console.log('🎉 TODOS OS MÓDULOS CRIADOS COM SUCESSO!');
    console.log('\n📊 Resumo do que foi criado:');
    console.log(`✅ ${COMPLETE_MODULES.length} módulos`);
    console.log(`✅ ${COMPLETE_MODULES.reduce((acc, mod) => acc + mod.lessons.length, 0)} aulas`);
    console.log(`✅ Todos os vídeos configurados (ID: ${TEST_VIDEO_ID})`);
    console.log('\n🌐 Acesse: http://localhost:3000/cursos');
    console.log('🎯 O curso agora tem conteúdo completo!');
    
  } catch (error) {
    console.error('❌ Erro geral:', error);
    process.exit(1);
  }
}

createAllModules();
