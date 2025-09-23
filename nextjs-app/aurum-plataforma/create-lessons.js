const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function createLessons() {
  try {
    console.log('🔍 Verificando curso existente...');
    
    // Buscar curso existente
    const course = await prisma.course.findFirst({
      where: { title: 'EDUCAÇÃO FINANCEIRA BÁSICA' }
    });
    
    if (!course) {
      console.log('❌ Curso não encontrado. Execute o seed primeiro.');
      return;
    }
    
    console.log('✅ Curso encontrado:', course.title);
    console.log('🎯 ID do curso:', course.id);
    
    // Buscar módulos do curso
    const modules = await prisma.module.findMany({
      where: { courseId: course.id },
      include: { lessons: true },
      orderBy: { order: 'asc' }
    });
    
    console.log(`📚 Encontrados ${modules.length} módulos:`);
    modules.forEach(module => {
      console.log(`  - ${module.title} (${module.lessons.length} aulas)`);
    });
    
    // Se não há aulas, criar
    if (modules.length === 0 || modules.every(m => m.lessons.length === 0)) {
      console.log('🏗️ Criando módulo e aulas...');
      
      // Criar módulo se não existir
      let module1 = modules.find(m => m.title.includes('Mentalidade'));
      if (!module1) {
        module1 = await prisma.module.create({
          data: {
            title: 'Módulo 1 - Mentalidade Financeira',
            description: 'Fundamentos da mentalidade financeira',
            order: 0,
            courseId: course.id,
          }
        });
        console.log('✅ Módulo criado:', module1.title);
      }
      
      // Criar aulas
      const lessons = [
        'AULA 01 LIMPAR O TERRENO',
        'AULA 02 MENTALIDADE DE ABUNDÂNCIA X MENTALIDADE DE ESCASSEZ',
        'AULA 03 CRENÇAS LIMITANTES SOBRE VOCÊ',
        'AULA 04 CRENÇAS LIMITANTES EM RELAÇÃO AO DINHEIRO',
        'AULA 05 O PODER DO AMBIENTE E DAS PESSOAS AO REDOR'
      ];
      
      for (let i = 0; i < lessons.length; i++) {
        const existingLesson = await prisma.lesson.findFirst({
          where: {
            title: lessons[i],
            moduleId: module1.id
          }
        });
        
        if (!existingLesson) {
          await prisma.lesson.create({
            data: {
              title: lessons[i],
              description: `Descrição da ${lessons[i]}`,
              vimeoVideoId: '1120965691',
              order: i,
              moduleId: module1.id,
              courseId: course.id,
              tasks: [],
            }
          });
          console.log(`✅ Aula criada: ${lessons[i]}`);
        } else {
          console.log(`⏭️ Aula já existe: ${lessons[i]}`);
        }
      }
      
      console.log('🎉 Aulas criadas com sucesso!');
    } else {
      console.log('✅ Aulas já existem no banco de dados');
    }
    
    // Verificar resultado final
    const finalModules = await prisma.module.findMany({
      where: { courseId: course.id },
      include: { lessons: true },
      orderBy: { order: 'asc' }
    });
    
    console.log('\n📊 Status final:');
    finalModules.forEach(module => {
      console.log(`  - ${module.title}: ${module.lessons.length} aulas`);
      module.lessons.forEach(lesson => {
        console.log(`    • ${lesson.title} (ID: ${lesson.vimeoVideoId})`);
      });
    });
    
  } catch (error) {
    console.error('❌ Erro:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createLessons();
