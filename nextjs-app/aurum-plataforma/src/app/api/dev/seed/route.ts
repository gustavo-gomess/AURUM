import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/database';
import { extractTokenFromRequest, verifyToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const prisma = dbConnect();

    const token = extractTokenFromRequest(request);
    if (!token) {
      return NextResponse.json({ error: 'Authorization token required' }, { status: 401 });
    }
    const payload = verifyToken(token);
    if (!payload || payload.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    // Verificar se o curso já existe
    let course = await prisma.course.findFirst({ 
      where: { title: 'EDUCAÇÃO FINANCEIRA' }
    });
    if (!course) {
      course = await prisma.course.create({
        data: {
          title: 'EDUCAÇÃO FINANCEIRA',
          description: 'Programa completo para transformação financeira prática.',
          instructor: 'AURUM',
          price: 1999,
        }
      });
    }

    // Helper para criar módulo com aulas
    async function upsertModuleWithLessons(moduleTitle: string, order: number, lessons: Array<{title: string, vimeoId?: string, description?: string}>) {
      let mod = await prisma.module.findFirst({ 
        where: { 
          title: moduleTitle, 
          courseId: course!.id 
        }
      });
      
      if (!mod) {
        mod = await prisma.module.create({
          data: {
            title: moduleTitle,
            description: '',
            order,
            courseId: course!.id,
          }
        });
      }

      // Criar aulas que não existam
      for (let i = 0; i < lessons.length; i++) {
        const lesson = lessons[i];
        const existing = await prisma.lesson.findFirst({ 
          where: { 
            title: lesson.title, 
            moduleId: mod.id, 
            courseId: course!.id 
          }
        });
        
        if (!existing) {
          await prisma.lesson.create({
            data: {
              title: lesson.title,
              description: lesson.description || '',
              vimeoVideoId: lesson.vimeoId || '000000000',
              order: i,
              moduleId: mod.id,
              courseId: course!.id,
              tasks: [],
            }
          });
        }
      }
      return mod;
    }

    // Usando o mesmo vídeo para teste em todas as aulas
    const testVideoId = '1120965691'; // Vídeo da AULA 02 para teste

    // Módulo 1 - Mentalidade (15 aulas)
    await upsertModuleWithLessons('Módulo 1 - Mentalidade', 0, [
      { title: 'AULA 01 LIMPAR O TERRENO', vimeoId: testVideoId, description: 'Primeira aula do módulo de mentalidade' },
      { title: 'AULA 02 MENTALIDADE DE ABUNDÂNCIA X MENTALIDADE DE ESCASSEZ', vimeoId: testVideoId, description: 'Diferenças entre mentalidade de abundância e escassez' },
      { title: 'AULA 03 CRENÇAS LIMITANTES SOBRE VOCÊ', vimeoId: testVideoId, description: 'Como identificar e superar crenças limitantes pessoais' },
      { title: 'AULA 04 CRENÇAS LIMITANTES EM RELAÇÃO AO DINHEIRO', vimeoId: testVideoId, description: 'Como superar crenças limitantes sobre dinheiro e riqueza' },
      { title: 'AULA 05 O PODER DO AMBIENTE E DAS PESSOAS AO REDOR', vimeoId: testVideoId, description: 'Como o ambiente influencia suas finanças' },
      { title: 'AULA 06 FICAR RICO É COMPORTAMENTAL NÃO INTELECTUAL', vimeoId: testVideoId, description: 'A psicologia por trás do sucesso financeiro' },
      { title: 'AULA 07 HÁBITO ANGULAR', vimeoId: testVideoId, description: 'Como criar hábitos que transformam sua vida financeira' },
      { title: 'AULA 08 COMO CRIAR UM HÁBITO', vimeoId: testVideoId, description: 'Metodologia prática para formar novos hábitos' },
      { title: 'AULA 09 MINDSET DE LONGO PRAZO X PRAZER IMEDIATO', vimeoId: testVideoId, description: 'Equilibrando gratificação imediata e objetivos futuros' },
      { title: 'AULA 10 FOCO E PRIORIDADES', vimeoId: testVideoId, description: 'Como manter o foco nos seus objetivos financeiros' },
      { title: 'AULA 11 A IMPORTÂNCIA DA META E COMO ESTABELECER UMA', vimeoId: testVideoId, description: 'Definindo metas financeiras claras e alcançáveis' },
      { title: 'AULA 12 AUTO RESPONSABILIDADE', vimeoId: testVideoId, description: 'Assumindo responsabilidade pelos seus resultados financeiros' },
      { title: 'AULA 13 COMO LIDAR COM O MEDO DO FRACASSO FINANCEIRO', vimeoId: testVideoId, description: 'Superando medos que impedem seu crescimento financeiro' },
      { title: 'AULA 14 MELHORIA CONTÍNUA', vimeoId: testVideoId, description: 'Evoluindo constantemente suas habilidades financeiras' },
      { title: 'AULA 15 APRENDA A SER GRATO', vimeoId: testVideoId, description: 'A importância da gratidão na jornada financeira' },
    ]);

    // Módulo 2 - Orçamento
    await upsertModuleWithLessons('Módulo 2 - Orçamento', 1, [
      { title: 'AULA 01 Como fazer um orçamento', vimeoId: testVideoId, description: 'Aprenda a criar um orçamento pessoal eficaz' },
      { title: 'AULA 02 Controlando gastos desnecessários', vimeoId: testVideoId, description: 'Identifique e elimine gastos que prejudicam suas finanças' },
      { title: 'AULA 03 Planejamento mensal', vimeoId: testVideoId, description: 'Como planejar suas finanças mensalmente' },
      { title: 'AULA 04 Reserva de emergência', vimeoId: testVideoId, description: 'A importância de ter uma reserva para emergências' },
      { title: 'AULA 05 Organizando suas contas', vimeoId: testVideoId, description: 'Métodos para organizar e controlar suas contas' },
    ]);

    // Módulo 3 - Investimentos
    await upsertModuleWithLessons('Módulo 3 - Investimentos', 2, [
      { title: 'AULA 01 Primeiros passos nos investimentos', vimeoId: testVideoId, description: 'Introdução ao mundo dos investimentos' },
      { title: 'AULA 02 Renda fixa vs Renda variável', vimeoId: testVideoId, description: 'Entenda as diferenças entre tipos de investimento' },
      { title: 'AULA 03 Diversificação de carteira', vimeoId: testVideoId, description: 'Como diversificar seus investimentos adequadamente' },
      { title: 'AULA 04 Análise de riscos', vimeoId: testVideoId, description: 'Avaliando riscos antes de investir' },
      { title: 'AULA 05 Estratégias de longo prazo', vimeoId: testVideoId, description: 'Planejando investimentos para o futuro' },
    ]);

    // Módulo 4 - Dívidas
    await upsertModuleWithLessons('Módulo 4 - Dívidas, Gastos e Orçamentos', 3, [
      { title: 'AULA 01 Como sair das dívidas', vimeoId: testVideoId, description: 'Estratégias para quitar suas dívidas' },
      { title: 'AULA 02 Negociação com credores', vimeoId: testVideoId, description: 'Como negociar suas dívidas efetivamente' },
      { title: 'AULA 03 Prevenindo o endividamento', vimeoId: testVideoId, description: 'Como evitar se endividar novamente' },
      { title: 'AULA 04 Cartão de crédito consciente', vimeoId: testVideoId, description: 'Usando o cartão de crédito a seu favor' },
      { title: 'AULA EXTRA Como conversar sobre dinheiro com a família', vimeoId: testVideoId, description: 'Diálogos importantes sobre finanças familiares' },
    ]);

    // Módulos adicionais (5-10)
    const moduleTopics = [
      'Empreendedorismo',
      'Aposentadoria',
      'Impostos',
      'Seguros',
      'Educação Financeira dos Filhos',
      'Planejamento Financeiro Avançado'
    ];

    for (let i = 0; i < moduleTopics.length; i++) {
      await upsertModuleWithLessons(`Módulo ${i + 5} - ${moduleTopics[i]}`, i + 4, [
        { title: `AULA 01 Introdução a ${moduleTopics[i]}`, vimeoId: testVideoId, description: `Conceitos fundamentais sobre ${moduleTopics[i].toLowerCase()}` },
        { title: `AULA 02 Estratégias práticas`, vimeoId: testVideoId, description: `Aplicações práticas em ${moduleTopics[i].toLowerCase()}` },
        { title: `AULA 03 Casos reais`, vimeoId: testVideoId, description: `Exemplos reais e estudos de caso` },
        { title: `AULA 04 Exercícios práticos`, vimeoId: testVideoId, description: `Atividades para fixar o aprendizado` },
      ]);
    }

    return NextResponse.json({ success: true, message: 'Seed concluído', courseId: course.id });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}


