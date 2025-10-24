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
      description: 'Curso completo de educação financeira abordando mentalidade, dinheiro e bancos, dívidas e orçamento, renda fixa, renda variável, investimentos no exterior, criptomoedas e empreendedorismo.',
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
  // IDs corretos dos vídeos do Vimeo:
  // 1129933679 = AULA 01 LIMPAR O TERRENO (10:02)
  // 1129932850 = AULA 02 MENTALIDADE DE ABUNDÂNCIA (04:07)
  const lessons01 = [
    { title: 'LIMPAR O TERRENO', videoId: '1129933679', order: 1 },
    { title: 'MENTALIDADE DE ABUNDÂNCIA X MENTALIDADE DE ESCASSEZ', videoId: '1129932850', order: 2 },
    { title: 'CRENÇAS LIMITANTES SOBRE VOCÊ', videoId: '1129933679', order: 3 },
    { title: 'CRENÇAS LIMITANTES EM RELAÇÃO AO DINHEIRO', videoId: '1129932850', order: 4 },
    { title: 'O PODER DO AMBIENTE E DAS PESSOAS AO REDOR', videoId: '1129933679', order: 5 },
    { title: 'FICAR RICO É COMPORTAMENTAL NÃO INTELECTUAL', videoId: '1129932850', order: 6 },
    { title: 'HÁBITO ANGULAR', videoId: '1129933679', order: 7 },
    { title: 'COMO CRIAR UM HÁBITO', videoId: '1129932850', order: 8 },
    { title: 'MINDSET DE LONGO PRAZO X PRAZER IMEDIATO', videoId: '1129933679', order: 9 },
    { title: 'FOCO E PRIORIDADES', videoId: '1129932850', order: 10 },
    { title: 'A IMPORTÂNCIA DA META E COMO ESTABELECER UMA', videoId: '1129933679', order: 11 },
    { title: 'AUTO RESPONSABILIDADE', videoId: '1129932850', order: 12 },
    { title: 'COMO LIDAR COM O MEDO DO FRACASSO FINANCEIRO', videoId: '1129933679', order: 13 },
    { title: 'MELHORIA CONTÍNUA', videoId: '1129932850', order: 14 },
    { title: 'APRENDA A SER GRATO', videoId: '1129933679', order: 15 },
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
    { title: 'AULA 01 A HISTÓRIA DO DINHEIRO', videoId: '1129933679', order: 1 },
    { title: 'AULA 02 MOEDAS FIDUCIÁRIAS E O FIM DO LASTRO', videoId: '1129932850', order: 2 },
    { title: 'AULA 03 QUAL A FUNÇÃO DO DINHEIRO', videoId: '1129933679', order: 3 },
    { title: 'AULA 04 INFLAÇÃO, O QUE É E COMO FUNCIONA', videoId: '1129932850', order: 4 },
    { title: 'AULA 05 INFLAÇÃO X DEFLAÇÃO - PORQUE OS GOVERNOS GOSTAM DA INFLAÇÃO', videoId: '1129933679', order: 5 },
    { title: 'AULA 06 RESERVAS FRACIONÁRIAS', videoId: '1129932850', order: 6 },
    { title: 'AULA 07 EFEITO CANTILLON', videoId: '1129933679', order: 7 },
    { title: 'AULA 08 PORQUE OS GOVERNOS FAZEM DÍVIDAS', videoId: '1129932850', order: 8 },
    { title: 'AULA 09 A IMPORTÂNCIA DO CAPITALISMO', videoId: '1129933679', order: 9 },
    { title: 'AULA 10 CONCLUSÃO E FECHAMENTO', videoId: '1129932850', order: 10 },
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
    { title: 'AULA 01 DIAGNÓSTICO FINANCEIRO', videoId: '1129933679', order: 1 },
    { title: 'AULA 02 O CUSTO INVISÍVEL DA DÍVIDA', videoId: '1129932850', order: 2 },
    { title: 'AULA 03 COMO SAIR DAS DÍVIDAS - PASSO A PASSO', videoId: '1129933679', order: 3 },
    { title: 'AULA 04 A VIDA DO ZERO A ZERO', videoId: '1129932850', order: 4 },
    { title: 'AULA 05 O GRANDE VILÃO - O CONSUMO AUTOMÁTICO', videoId: '1129933679', order: 5 },
    { title: 'AULA 06 A MENTIRA DO EU MEREÇO', videoId: '1129932850', order: 6 },
    { title: 'AULA 07 POQUE SOBRAR DINHEIRO NÃO É O FIM, MAS SIM O COMEÇO', videoId: '1129933679', order: 7 },
    { title: 'AULA 08 CRIANDO O SEU ORÇAMENTO PESSOAL INTELIGENTE', videoId: '1129932850', order: 8 },
    { title: 'AULA 09 O PRIMEIRO PASSO PRA INVESTIR', videoId: '1129933679', order: 9 },
    { title: 'AULA EXTRA - COMO CONVERSAR SOBRE DINHEIRO COM A FAMÍLIA', videoId: '1129932850', order: 10 },
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
    { title: 'AULA 01 O QUE É A RENDA FIXA', videoId: '1129933679', order: 1 },
    { title: 'AULA 02 MITOS E VERDADES DA RENDA FIXA', videoId: '1129932850', order: 2 },
    { title: 'AULA 03 ENDIVIDAMENTO X INVESTIMENTOS (consórcios, financiamentos e títulos de capitalização)', videoId: '1129933679', order: 3 },
    { title: 'AULA 04 TESOURO DIRETO (SELIC, PREFIXADO E IPCA+)', videoId: '1129932850', order: 4 },
    { title: 'AULA 05 CDB, LCI, LCA E CDI: ENTENDENDO A RENDA FIXA DOS BANCOS E O PAPEL DO FGC', videoId: '1129933679', order: 5 },
    { title: 'AULA 06 RISCO DE CRÉDITO E BANCOS RUINS', videoId: '1129932850', order: 6 },
    { title: 'AULA 07 DEBÊNTURES, CRI e CRA A RENDA FIXA DE EMPRESAS', videoId: '1129933679', order: 7 },
    { title: 'AULA 08 IOF, IR E TRIBUTAÇÃO NA RENDA FIXA + COE', videoId: '1129932850', order: 8 },
    { title: 'AULA 09 PIRÂMIDES FINANCEIRAS E GOLPES', videoId: '1129933679', order: 9 },
    { title: 'AULA 10 CORRETORAS, BANCOS E HOME BROKER POR ONDE INVESTIR', videoId: '1129932850', order: 10 },
    { title: 'AULA 11 RESERVA DE EMERGÊNCIA ONDE COLOCAR NA PRÁTICA', videoId: '1129933679', order: 11 },
    { title: 'AULA 12 COMPRANDO TESOURO DIRETO NA PRÁTICA (PASSO A PASSO)', videoId: '1129932850', order: 12 },
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

  console.log('✨ Seed concluído com sucesso!');
  console.log('\n📊 Resumo:');
  console.log(`   - 1 curso criado`);
  console.log(`   - 4 módulos criados`);
  console.log(`   - ${lessons01.length + lessons02.length + lessons03.length + lessons04.length} aulas criadas`);
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

