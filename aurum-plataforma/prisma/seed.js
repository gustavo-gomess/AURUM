const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...\n');

  // Criar o curso AURUM
  const course = await prisma.course.upsert({
    where: { id: 'aurum-course-id' },
    update: {},
    create: {
      id: 'aurum-course-id',
      title: 'AURUM - Educação Financeira Completa',
      description: 'Curso completo de educação financeira abordando mentalidade, dinheiro e bancos, dívidas e orçamento, renda fixa e renda variável.',
      instructor: 'AURUM Academy',
      price: 497.00,
    },
  });
  console.log('✅ Curso criado:', course.title);

  // Módulo 01 - MENTALIDADE
  const module01 = await prisma.module.upsert({
    where: { id: 'module-01-mentalidade' },
    update: {},
    create: {
      id: 'module-01-mentalidade',
      courseId: course.id,
      title: '01 MENTALIDADE',
      description: 'Fundamentos da mentalidade financeira de sucesso',
      order: 1,
    },
  });
  console.log('📚 Módulo 01 criado:', module01.title);

  // Aulas do Módulo 01
  const lessons01 = [
    { title: 'LIMPAR O TERRENO', videoId: '1147752447', order: 1 },
    { title: 'MENTALIDADE DE ABUNDÂNCIA X MENTALIDADE DE ESCASSEZ', videoId: '1146931332', order: 2 },
    { title: 'CRENÇAS LIMITANTES SOBRE VOCÊ', videoId: '1146931421', order: 3 },
    { title: 'CRENÇAS LIMITANTES EM RELAÇÃO AO DINHEIRO', videoId: '1146931552', order: 4 },
    { title: 'O PODER DO AMBIENTE E DAS PESSOAS AO REDOR', videoId: '1146931668', order: 5 },
    { title: 'FICAR RICO É COMPORTAMENTAL NÃO INTELECTUAL', videoId: '1146931762', order: 6 },
    { title: 'HÁBITO ANGULAR', videoId: '1146931853', order: 7 },
    { title: 'COMO CRIAR UM HÁBITO', videoId: '1146932010', order: 8 },
    { title: 'MINDSET DE LONGO PRAZO X PRAZER IMEDIATO', videoId: '1146932107', order: 9 },
    { title: 'FOCO E PRIORIDADES', videoId: '1146932202', order: 10 },
    { title: 'A IMPORTÂNCIA DA META E COMO ESTABELECER UMA', videoId: '1146932315', order: 11 },
    { title: 'AUTO RESPONSABILIDADE', videoId: '1146932469', order: 12 },
    { title: 'COMO LIDAR COM O MEDO DO FRACASSO FINANCEIRO', videoId: '1146932548', order: 13 },
    { title: 'MELHORIA CONTÍNUA', videoId: '1146932683', order: 14 },
    { title: 'APRENDA A SER GRATO', videoId: '1146932777', order: 15 },
  ];

  for (const lesson of lessons01) {
    await prisma.lesson.upsert({
      where: { id: `lesson-01-${lesson.order}` },
      update: {},
      create: {
        id: `lesson-01-${lesson.order}`,
        moduleId: module01.id,
        courseId: course.id,
        title: lesson.title,
        vimeoVideoId: lesson.videoId,
        order: lesson.order,
        tasks: [],
      },
    });
  }
  console.log(`   ✓ ${lessons01.length} aulas criadas no Módulo 01\n`);

  // Módulo 02 - DINHEIRO, BANCOS E GOVERNOS
  const module02 = await prisma.module.upsert({
    where: { id: 'module-02-dinheiro' },
    update: {},
    create: {
      id: 'module-02-dinheiro',
      courseId: course.id,
      title: '02 DINHEIRO, BANCOS E GOVERNOS',
      description: 'Entenda o sistema financeiro, moedas e como funcionam os bancos',
      order: 2,
    },
  });
  console.log('📚 Módulo 02 criado:', module02.title);

  const lessons02 = [
    { title: 'AULA 01 A HISTÓRIA DO DINHEIRO', videoId: '1146934236', order: 1 },
    { title: 'AULA 02 MOEDAS FIDUCIÁRIAS E O FIM DO LASTRO', videoId: '1146934360', order: 2 },
    { title: 'AULA 03 QUAL A FUNÇÃO DO DINHEIRO', videoId: '1146934472', order: 3 },
    { title: 'AULA 04 INFLAÇÃO, O QUE É E COMO FUNCIONA', videoId: '1146934597', order: 4 },
    { title: 'AULA 05 INFLAÇÃO X DEFLAÇÃO - PORQUE OS GOVERNOS GOSTAM DA INFLAÇÃO', videoId: '1146934715', order: 5 },
    { title: 'AULA 06 RESERVAS FRACIONÁRIAS', videoId: '1146934832', order: 6 },
    { title: 'AULA 07 EFEITO CANTILLON', videoId: '1146935135', order: 7 },
    { title: 'AULA 08 PORQUE OS GOVERNOS FAZEM DÍVIDAS', videoId: '1146935330', order: 8 },
    { title: 'AULA 09 A IMPORTÂNCIA DO CAPITALISMO', videoId: '1146935497', order: 9 },
    { title: 'AULA 10 CONCLUSÃO E FECHAMENTO', videoId: '1146935758', order: 10 },
  ];

  for (const lesson of lessons02) {
    await prisma.lesson.upsert({
      where: { id: `lesson-02-${lesson.order}` },
      update: {},
      create: {
        id: `lesson-02-${lesson.order}`,
        moduleId: module02.id,
        courseId: course.id,
        title: lesson.title,
        vimeoVideoId: lesson.videoId,
        order: lesson.order,
        tasks: [],
      },
    });
  }
  console.log(`   ✓ ${lessons02.length} aulas criadas no Módulo 02\n`);

  // Módulo 03 - DÍVIDAS, GASTOS E ORÇAMENTO
  const module03 = await prisma.module.upsert({
    where: { id: 'module-03-dividas' },
    update: {},
    create: {
      id: 'module-03-dividas',
      courseId: course.id,
      title: '03 DÍVIDAS, GASTOS E ORÇAMENTO',
      description: 'Aprenda a controlar suas finanças, eliminar dívidas e criar um orçamento inteligente',
      order: 3,
    },
  });
  console.log('📚 Módulo 03 criado:', module03.title);

  const lessons03 = [
    { title: 'AULA 01 DIAGNÓSTICO FINANCEIRO', videoId: '1146938529', order: 1 },
    { title: 'AULA 02 O CUSTO INVISÍVEL DA DÍVIDA', videoId: '1146938990', order: 2 },
    { title: 'AULA 03 COMO SAIR DAS DÍVIDAS - PASSO A PASSO', videoId: '1146939161', order: 3 },
    { title: 'AULA 04 A VIDA DO ZERO A ZERO', videoId: '1146939313', order: 4 },
    { title: 'AULA 05 O GRANDE VILÃO - O CONSUMO AUTOMÁTICO', videoId: '1146939503', order: 5 },
    { title: 'AULA 06 A MENTIRA DO EU MEREÇO', videoId: '1146939652', order: 6 },
    { title: 'AULA 07 POQUE SOBRAR DINHEIRO NÃO É O FIM, MAS SIM O COMEÇO', videoId: '1146939781', order: 7 },
    { title: 'AULA 08 CRIANDO O SEU ORÇAMENTO PESSOAL INTELIGENTE', videoId: '1146939892', order: 8 },
    { title: 'AULA 09 O PRIMEIRO PASSO PRA INVESTIR', videoId: '1146940180', order: 9 },
    { title: 'AULA EXTRA - COMO CONVERSAR SOBRE DINHEIRO COM A FAMÍLIA', videoId: '1146940366', order: 10 },
  ];

  for (const lesson of lessons03) {
    await prisma.lesson.upsert({
      where: { id: `lesson-03-${lesson.order}` },
      update: {},
      create: {
        id: `lesson-03-${lesson.order}`,
        moduleId: module03.id,
        courseId: course.id,
        title: lesson.title,
        vimeoVideoId: lesson.videoId,
        order: lesson.order,
        tasks: [],
      },
    });
  }
  console.log(`   ✓ ${lessons03.length} aulas criadas no Módulo 03\n`);

  // Módulo 04 - RENDA FIXA
  const module04 = await prisma.module.upsert({
    where: { id: 'module-04-renda-fixa' },
    update: {},
    create: {
      id: 'module-04-renda-fixa',
      courseId: course.id,
      title: '04 RENDA FIXA',
      description: 'Tudo sobre investimentos em renda fixa: Tesouro Direto, CDB, LCI, LCA e mais',
      order: 4,
    },
  });
  console.log('📚 Módulo 04 criado:', module04.title);

  const lessons04 = [
    { title: 'AULA 01 O QUE É A RENDA FIXA', videoId: '1146941304', order: 1 },
    { title: 'AULA 02 MITOS E VERDADES DA RENDA FIXA', videoId: '1146941463', order: 2 },
    { title: 'AULA 03 ENDIVIDAMENTO X INVESTIMENTOS (consórcios, financiamentos e títulos de capitalização)', videoId: '1146941804', order: 3 },
    { title: 'AULA 04 TESOURO DIRETO (SELIC, PREFIXADO E IPCA+)', videoId: '1146942248', order: 4 },
    { title: 'AULA 05 CDB, LCI, LCA E CDI: ENTENDENDO A RENDA FIXA DOS BANCOS E O PAPEL DO FGC', videoId: '1146943100', order: 5 },
    { title: 'AULA 06 RISCO DE CRÉDITO E BANCOS RUINS', videoId: '1146943721', order: 6 },
    { title: 'AULA 07 DEBÊNTURES, CRI e CRA A RENDA FIXA DE EMPRESAS', videoId: '1146944138', order: 7 },
    { title: 'AULA 08 IOF, IR E TRIBUTAÇÃO NA RENDA FIXA + COE', videoId: '1146944361', order: 8 },
    { title: 'AULA 09 PIRÂMIDES FINANCEIRAS E GOLPES', videoId: '1146944717', order: 9 },
    { title: 'AULA 10 CORRETORAS, BANCOS E HOME BROKER POR ONDE INVESTIR', videoId: '1146945092', order: 10 },
    { title: 'AULA 11 RESERVA DE EMERGÊNCIA ONDE COLOCAR NA PRÁTICA', videoId: '1146945392', order: 11 },
    { title: 'AULA 12 COMPRANDO TESOURO DIRETO NA PRÁTICA (PASSO A PASSO)', videoId: '1146945543', order: 12 },
  ];

  for (const lesson of lessons04) {
    await prisma.lesson.upsert({
      where: { id: `lesson-04-${lesson.order}` },
      update: {},
      create: {
        id: `lesson-04-${lesson.order}`,
        moduleId: module04.id,
        courseId: course.id,
        title: lesson.title,
        vimeoVideoId: lesson.videoId,
        order: lesson.order,
        tasks: [],
      },
    });
  }
  console.log(`   ✓ ${lessons04.length} aulas criadas no Módulo 04\n`);

  // Módulo 05 - RENDA VARIÁVEL
  const module05 = await prisma.module.upsert({
    where: { id: 'module-05-renda-variavel' },
    update: {},
    create: {
      id: 'module-05-renda-variavel',
      courseId: course.id,
      title: '05 RENDA VARIÁVEL',
      description: 'Investimentos em ações, análise fundamentalista e estratégias de trading',
      order: 5,
    },
  });
  console.log('📚 Módulo 05 criado:', module05.title);

  const lessons05 = [
    { title: 'RENDA VARIÁVEL E ESCOLAS DE ANÁLISE FUNDAMENTALISTA X GRÁFICA', videoId: '1147688108', order: 1 },
    { title: 'AÇÕES O QUE SÃO E PORQUE INVESTIR', videoId: '1147688249', order: 2 },
    { title: 'TIPOS DE AÇÕES E NOMENCLATURAS (ON, PN, Units e Tag Along)', videoId: '1147688373', order: 3 },
    { title: 'INDICADORES FUNDAMENTAIS QUE TODO INVESTIDOR DEVE CONHECER', videoId: '1147688520', order: 4 },
    { title: 'FERRAMENTAS E SITES PARA CONSULTAR INDICADORES', videoId: '1147688770', order: 5 },
    { title: 'COMO COMPRAR AÇÕES PELO HOME BROKER (na prática)', videoId: '1147688903', order: 6 },
    { title: 'PROVENTOS DIVIDENDOS; JCP; BONIFICAÇÕES E SUBSCRIÇÕES', videoId: '1147689218', order: 7 },
    { title: 'DESDOBRAMENTOS E GRUPAMENTOS POR QUE AS EMPRESAS FAZEM ISSO', videoId: '1147689524', order: 8 },
    { title: 'LEITURA DE GRÁFICOS CANDLESTICKS; SUPORTES E RESISTÊNCIAS', videoId: '1147689737', order: 9 },
    { title: 'ALUGUEL DE AÇÕES E OUTRAS FORMAS DE RENTABILIZAR SUA CARTEIRA', videoId: '1147690097', order: 10 },
    { title: 'ETFs e BDRs DIVERSIFICAÇÃO NACIONAL E INTERNACIONAL', videoId: '1147690310', order: 11 },
    { title: 'FUNDOS IMOBILIÁRIOS (FIIs)', videoId: '1147690689', order: 12 },
    { title: 'ETFs e BDRs DIVERSIFICAÇÃO NACIONAL E INTERNACIONAL', videoId: '1147691126', order: 13 },
    { title: 'CARTEIRA DE INVESTIMENTOS E DIVERSIFICAÇÃO INTELIGENTE', videoId: '1147751769', order: 14 },
    { title: 'APORTES MENSAIS; DISCIPLINA E JUROS COMPOSTOS', videoId: '1147751944', order: 15 },
    { title: 'QUANDO VENDER UM ATIVO (e Quando Não Fazer Nada)', videoId: '1147752153', order: 16 },
    { title: 'CONSOLIDANDO SUA CARTEIRA DE INVESTIMENTOS', videoId: '1147752333', order: 17 },
  ];

  for (const lesson of lessons05) {
    await prisma.lesson.upsert({
      where: { id: `lesson-05-${lesson.order}` },
      update: {},
      create: {
        id: `lesson-05-${lesson.order}`,
        moduleId: module05.id,
        courseId: course.id,
        title: lesson.title,
        vimeoVideoId: lesson.videoId,
        order: lesson.order,
        tasks: [],
      },
    });
  }
  console.log(`   ✓ ${lessons05.length} aulas criadas no Módulo 05\n`);

  // ── Subcurso: IA na Prática (IDs Vimeo: edite cada aula no banco ou reexecute este bloco após atualizar este arquivo)
  // Placeholder oficial do player na app: `000000000` → mensagem «Conteúdo em breve» até você colocar o id real do Vimeo.
  const PLACEHOLDER_VIMEO = '000000000';

  const iaCourse = await prisma.course.upsert({
    where: { id: 'ia-pratica' },
    update: {
      title: 'IA na Prática',
      description:
        'Série em quatro episódios com Gustavo Gomes: IA aplicada de forma direta para produtividade e clareza no dia a dia.',
      instructor: 'Gustavo Gomes',
    },
    create: {
      id: 'ia-pratica',
      title: 'IA na Prática',
      description:
        'Série em quatro episódios com Gustavo Gomes: IA aplicada de forma direta para produtividade e clareza no dia a dia.',
      instructor: 'Gustavo Gomes',
      price: 0,
    },
  });
  console.log('✅ Curso extra criado/atualizado:', iaCourse.title);

  const iaMod = await prisma.module.upsert({
    where: { id: 'ia-pratica-mod-01' },
    update: {
      title: '01 IA NA PRÁTICA',
      description: 'Quatro episódios da série',
      order: 1,
      courseId: iaCourse.id,
    },
    create: {
      id: 'ia-pratica-mod-01',
      courseId: iaCourse.id,
      title: '01 IA NA PRÁTICA',
      description: 'Quatro episódios da série',
      order: 1,
    },
  });

  const iaEpisodes = [
    { id: 'ia-pratica-ep-1', title: 'Episódio 1', order: 1 },
    { id: 'ia-pratica-ep-2', title: 'Episódio 2', order: 2 },
    { id: 'ia-pratica-ep-3', title: 'Episódio 3', order: 3 },
    { id: 'ia-pratica-ep-4', title: 'Episódio 4', order: 4 },
  ];

  for (const ep of iaEpisodes) {
    await prisma.lesson.upsert({
      where: { id: ep.id },
      update: {
        title: ep.title,
        order: ep.order,
        moduleId: iaMod.id,
        courseId: iaCourse.id,
      },
      create: {
        id: ep.id,
        moduleId: iaMod.id,
        courseId: iaCourse.id,
        title: ep.title,
        description: '',
        vimeoVideoId: PLACEHOLDER_VIMEO,
        order: ep.order,
        tasks: [],
      },
    });
  }
  console.log(`   ✓ ${iaEpisodes.length} episódios (IA na Prática) — vimeo: substitua ${PLACEHOLDER_VIMEO} pelos IDs reais\n`);

  console.log('✨ Seed concluído com sucesso!');
  console.log('\n📊 Resumo:');
  console.log(`   - 2 cursos (principal + IA na Prática)`);
  console.log(`   - 6 módulos no total (curso principal + IA)`);
  console.log(`   - ${lessons01.length + lessons02.length + lessons03.length + lessons04.length + lessons05.length + iaEpisodes.length} aulas criadas/atualizadas`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('❌ Erro no seed:', e);
    await prisma.$disconnect();
    process.exit(1);
  });

