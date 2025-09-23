const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// IDs de vídeos públicos do Vimeo para teste
const VALID_VIMEO_IDS = [
    '148751763', // Vídeo público de demonstração
    '76979871',  // Vídeo de demonstração
    '148751763', // Reutilizar para consistência
    '76979871',  // Reutilizar para consistência
    '148751763', // Reutilizar para consistência
    '76979871',  // Reutilizar para consistência
    '148751763', // Reutilizar para consistência
    '76979871',  // Reutilizar para consistência
    '148751763', // Reutilizar para consistência
    '76979871',  // Reutilizar para consistência
    '148751763', // Reutilizar para consistência
    '76979871',  // Reutilizar para consistência
    '148751763', // Reutilizar para consistência
    '76979871',  // Reutilizar para consistência
    '148751763', // Reutilizar para consistência
    '76979871',  // Reutilizar para consistência
    '148751763', // Reutilizar para consistência
    '76979871',  // Reutilizar para consistência
    '148751763', // Reutilizar para consistência
    '76979871',  // Reutilizar para consistência
];

async function fixVimeoVideos() {
  try {
    console.log('🔍 Buscando aulas com ID de vídeo inválido...');
    
    // Buscar todas as aulas
    const lessons = await prisma.lesson.findMany({
      select: {
        id: true,
        title: true,
        vimeoVideoId: true,
        order: true,
        module: {
          select: {
            title: true,
            order: true
          }
        }
      },
      orderBy: [
        { module: { order: 'asc' } },
        { order: 'asc' }
      ]
    });

    console.log(`📚 Encontradas ${lessons.length} aulas`);

    let updatedCount = 0;
    let invalidCount = 0;

    for (let i = 0; i < lessons.length; i++) {
      const lesson = lessons[i];
      const currentVideoId = lesson.vimeoVideoId;
      
      // Verificar se o ID atual é inválido ou é o ID de teste
      if (currentVideoId === '1120965691' || currentVideoId === '000000000' || !currentVideoId) {
        const newVideoId = VALID_VIMEO_IDS[i % VALID_VIMEO_IDS.length];
        
        try {
          await prisma.lesson.update({
            where: { id: lesson.id },
            data: { vimeoVideoId: newVideoId }
          });
          
          console.log(`✅ ${lesson.module.title} - ${lesson.title}: ${currentVideoId} → ${newVideoId}`);
          updatedCount++;
        } catch (error) {
          console.error(`❌ Erro ao atualizar ${lesson.title}:`, error.message);
        }
      } else {
        console.log(`⏭️  ${lesson.module.title} - ${lesson.title}: ID ${currentVideoId} já é válido`);
      }
    }

    console.log('\n📊 Resumo:');
    console.log(`✅ Aulas atualizadas: ${updatedCount}`);
    console.log(`⏭️  Aulas já válidas: ${lessons.length - updatedCount}`);
    
    if (updatedCount > 0) {
      console.log('\n🎯 Próximos passos:');
      console.log('1. Teste os vídeos no navegador');
      console.log('2. Se funcionarem, substitua pelos seus próprios IDs do Vimeo');
      console.log('3. Configure as permissões de domínio no Vimeo');
    }

  } catch (error) {
    console.error('❌ Erro ao atualizar vídeos:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  fixVimeoVideos();
}

module.exports = { fixVimeoVideos };
