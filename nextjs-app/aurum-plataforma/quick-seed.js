const { PrismaClient } = require('@prisma/client');

async function quickSeed() {
  const prisma = new PrismaClient();
  
  try {
    console.log('🌱 Iniciando seed rápido...');

    // Verificar se já existe curso
    const existingCourse = await prisma.course.findFirst();
    if (existingCourse) {
      console.log('✅ Curso já existe:', existingCourse.title);
      console.log('🎯 ID do curso:', existingCourse.id);
      
      // Verificar módulos
      const modules = await prisma.module.findMany({
        where: { courseId: existingCourse.id },
        include: { lessons: true },
        orderBy: { order: 'asc' }
      });
      
      console.log(`📚 Encontrados ${modules.length} módulos:`);
      modules.forEach(module => {
        console.log(`  - ${module.title} (${module.lessons.length} aulas)`);
      });
      
      return;
    }

    // Criar curso
    console.log('📝 Criando curso...');
    const course = await prisma.course.create({
      data: {
        title: 'EDUCAÇÃO FINANCEIRA',
        description: 'Programa completo para transformação financeira prática.',
        instructor: 'AURUM',
        price: 1999,
      }
    });

    console.log('✅ Curso criado:', course.title);

    // Criar módulo 1 com aulas
    console.log('📚 Criando Módulo 1...');
    const module1 = await prisma.module.create({
      data: {
        title: 'Módulo 1 - Mentalidade',
        description: 'Fundamentos da mentalidade financeira',
        order: 0,
        courseId: course.id,
      }
    });

    // Criar aulas do módulo 1
    const lessons = [
      'AULA 01 LIMPAR O TERRENO',
      'AULA 02 MENTALIDADE DE ABUNDÂNCIA X MENTALIDADE DE ESCASSEZ',
      'AULA 03 CRENÇAS LIMITANTES SOBRE VOCÊ',
      'AULA 04 CRENÇAS LIMITANTES EM RELAÇÃO AO DINHEIRO',
      'AULA 05 O PODER DO AMBIENTE E DAS PESSOAS AO REDOR'
    ];

    for (let i = 0; i < lessons.length; i++) {
      await prisma.lesson.create({
        data: {
          title: lessons[i],
          description: `Descrição da ${lessons[i]}`,
          vimeoVideoId: '1120965691', // Mesmo vídeo para teste
          order: i,
          moduleId: module1.id,
          courseId: course.id,
          tasks: [],
        }
      });
    }

    console.log(`✅ Criadas ${lessons.length} aulas no Módulo 1`);

    // Criar mais módulos rapidamente
    const moduleNames = [
      'Módulo 2 - Orçamento',
      'Módulo 3 - Investimentos', 
      'Módulo 4 - Dívidas'
    ];

    for (let i = 0; i < moduleNames.length; i++) {
      const module = await prisma.module.create({
        data: {
          title: moduleNames[i],
          description: `Conteúdo sobre ${moduleNames[i]}`,
          order: i + 1,
          courseId: course.id,
        }
      });

      // 3 aulas por módulo
      for (let j = 0; j < 3; j++) {
        await prisma.lesson.create({
          data: {
            title: `AULA ${j + 1} - ${moduleNames[i]}`,
            description: `Aula ${j + 1} do ${moduleNames[i]}`,
            vimeoVideoId: '1120965691',
            order: j,
            moduleId: module.id,
            courseId: course.id,
            tasks: [],
          }
        });
      }
    }

    console.log('✅ Seed concluído!');
    console.log('🌐 Acesse: http://localhost:3000/cursos');
    console.log('🎯 ID do curso:', course.id);

  } catch (error) {
    console.error('❌ Erro no seed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

quickSeed();
