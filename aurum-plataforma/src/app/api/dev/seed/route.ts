import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/database';
import { extractTokenFromRequest, verifyToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const prisma = dbConnect();

    // Verificar se é admin
    const token = extractTokenFromRequest(request);
    if (!token) {
      return NextResponse.json({ error: 'Token required' }, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload || payload.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    // Criar ou buscar curso
    let course = await prisma.course.findFirst({
      where: { title: 'EDUCAÇÃO FINANCEIRA BÁSICA' }
    });

    if (!course) {
      course = await prisma.course.create({
        data: {
          title: 'EDUCAÇÃO FINANCEIRA BÁSICA',
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
              vimeoVideoId: lesson.vimeoId || '1120965691',
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

    // MÓDULO 1 - MENTALIDADE FINANCEIRA (15 aulas completas)
    await upsertModuleWithLessons('Módulo 1 - Mentalidade Financeira', 0, [
      { title: 'AULA 01 LIMPAR O TERRENO', vimeoId: testVideoId, description: 'Primeira aula do módulo de mentalidade - preparando sua mente para a transformação financeira' },
      { title: 'AULA 02 MENTALIDADE DE ABUNDÂNCIA X MENTALIDADE DE ESCASSEZ', vimeoId: testVideoId, description: 'Diferenças entre mentalidade de abundância e escassez e como isso afeta suas finanças' },
      { title: 'AULA 03 CRENÇAS LIMITANTES SOBRE VOCÊ', vimeoId: testVideoId, description: 'Como identificar e superar crenças limitantes pessoais que impedem seu crescimento' },
      { title: 'AULA 04 CRENÇAS LIMITANTES EM RELAÇÃO AO DINHEIRO', vimeoId: testVideoId, description: 'Como superar crenças limitantes sobre dinheiro e riqueza' },
      { title: 'AULA 05 O PODER DO AMBIENTE E DAS PESSOAS AO REDOR', vimeoId: testVideoId, description: 'Como o ambiente e as pessoas influenciam suas decisões financeiras' },
      { title: 'AULA 06 FICAR RICO É COMPORTAMENTAL NÃO INTELECTUAL', vimeoId: testVideoId, description: 'A psicologia por trás do sucesso financeiro' },
      { title: 'AULA 07 HÁBITO ANGULAR', vimeoId: testVideoId, description: 'Como identificar e criar o hábito que transformará sua vida financeira' },
      { title: 'AULA 08 COMO CRIAR UM HÁBITO', vimeoId: testVideoId, description: 'Metodologia prática para formar novos hábitos financeiros' },
      { title: 'AULA 09 MINDSET DE LONGO PRAZO X PRAZER IMEDIATO', vimeoId: testVideoId, description: 'Equilibrando gratificação imediata e objetivos de longo prazo' },
      { title: 'AULA 10 FOCO E PRIORIDADES', vimeoId: testVideoId, description: 'Como manter o foco nos seus objetivos financeiros principais' },
      { title: 'AULA 11 A IMPORTÂNCIA DA META E COMO ESTABELECER UMA', vimeoId: testVideoId, description: 'Definindo metas financeiras claras e alcançáveis' },
      { title: 'AULA 12 AUTO RESPONSABILIDADE', vimeoId: testVideoId, description: 'Assumindo responsabilidade total pelos seus resultados financeiros' },
      { title: 'AULA 13 COMO LIDAR COM O MEDO DO FRACASSO FINANCEIRO', vimeoId: testVideoId, description: 'Superando medos que impedem seu crescimento financeiro' },
      { title: 'AULA 14 MELHORIA CONTÍNUA', vimeoId: testVideoId, description: 'Evoluindo constantemente suas habilidades financeiras' },
      { title: 'AULA 15 APRENDA A SER GRATO', vimeoId: testVideoId, description: 'A importância da gratidão na jornada financeira' },
    ]);

    // MÓDULO 2 - ORÇAMENTO PESSOAL (5 aulas)
    await upsertModuleWithLessons('Módulo 2 - Orçamento Pessoal', 1, [
      { title: 'AULA 01 Fundamentos do Orçamento', vimeoId: testVideoId, description: 'Aprenda os conceitos básicos para criar um orçamento eficaz' },
      { title: 'AULA 02 Mapeando Receitas e Despesas', vimeoId: testVideoId, description: 'Identifique e categorize todas suas entradas e saídas de dinheiro' },
      { title: 'AULA 03 Método 50-30-20 na Prática', vimeoId: testVideoId, description: 'Como aplicar a regra dos 50-30-20 no seu orçamento' },
      { title: 'AULA 04 Controlando Gastos Desnecessários', vimeoId: testVideoId, description: 'Identifique e elimine gastos que prejudicam suas finanças' },
      { title: 'AULA 05 Reserva de Emergência', vimeoId: testVideoId, description: 'A importância e como calcular sua reserva para emergências' },
    ]);

    // MÓDULO 3 - INVESTIMENTOS BÁSICOS (5 aulas)
    await upsertModuleWithLessons('Módulo 3 - Investimentos Básicos', 2, [
      { title: 'AULA 01 Primeiros Passos nos Investimentos', vimeoId: testVideoId, description: 'Introdução ao mundo dos investimentos para iniciantes' },
      { title: 'AULA 02 Renda Fixa vs Renda Variável', vimeoId: testVideoId, description: 'Entenda as diferenças entre tipos de investimento' },
      { title: 'AULA 03 Tesouro Direto - Seu Primeiro Investimento', vimeoId: testVideoId, description: 'Como investir no Tesouro Direto com segurança' },
      { title: 'AULA 04 Diversificação de Carteira', vimeoId: testVideoId, description: 'Como diversificar seus investimentos adequadamente' },
      { title: 'AULA 05 Estratégias de Longo Prazo', vimeoId: testVideoId, description: 'Planejando investimentos para o futuro' },
    ]);

    // MÓDULO 4 - CONTROLE DE DÍVIDAS (5 aulas)
    await upsertModuleWithLessons('Módulo 4 - Controle de Dívidas', 3, [
      { title: 'AULA 01 Mapeando Suas Dívidas', vimeoId: testVideoId, description: 'Como fazer um levantamento completo das suas dívidas' },
      { title: 'AULA 02 Estratégias para Quitar Dívidas', vimeoId: testVideoId, description: 'Métodos eficazes para sair do vermelho' },
      { title: 'AULA 03 Negociação com Credores', vimeoId: testVideoId, description: 'Como negociar suas dívidas efetivamente' },
      { title: 'AULA 04 Cartão de Crédito Consciente', vimeoId: testVideoId, description: 'Usando o cartão de crédito a seu favor' },
      { title: 'AULA 05 Prevenindo o Endividamento', vimeoId: testVideoId, description: 'Como evitar se endividar novamente' },
    ]);

    // MÓDULO 5 - PLANEJAMENTO FINANCEIRO (5 aulas)
    await upsertModuleWithLessons('Módulo 5 - Planejamento Financeiro', 4, [
      { title: 'AULA 01 Definindo Metas Financeiras', vimeoId: testVideoId, description: 'Como estabelecer objetivos claros e alcançáveis' },
      { title: 'AULA 02 Planejamento para Aposentadoria', vimeoId: testVideoId, description: 'A importância de planejar o futuro financeiro' },
      { title: 'AULA 03 Seguros e Proteção', vimeoId: testVideoId, description: 'Protegendo seu patrimônio e sua família' },
      { title: 'AULA 04 Educação Financeira dos Filhos', vimeoId: testVideoId, description: 'Como ensinar finanças para crianças' },
      { title: 'AULA 05 Revisão e Ajustes', vimeoId: testVideoId, description: 'Como revisar e ajustar seu planejamento' },
    ]);

    // MÓDULO EXTRA - CONTEÚDO BÔNUS (5 aulas)
    await upsertModuleWithLessons('Módulo Extra - Conteúdo Bônus', 5, [
      { title: 'AULA EXTRA 01 Empreendedorismo Financeiro', vimeoId: testVideoId, description: 'Como aumentar sua renda através do empreendedorismo' },
      { title: 'AULA EXTRA 02 Investimentos Alternativos', vimeoId: testVideoId, description: 'Explorando opções além dos investimentos tradicionais' },
      { title: 'AULA EXTRA 03 Impostos e Declarações', vimeoId: testVideoId, description: 'Entendendo o sistema tributário brasileiro' },
      { title: 'AULA EXTRA 04 Estratégias Avançadas', vimeoId: testVideoId, description: 'Técnicas avançadas para otimizar suas finanças' },
      { title: 'AULA EXTRA 05 Casos Práticos', vimeoId: testVideoId, description: 'Exemplos reais de transformação financeira' },
    ]);

    return NextResponse.json({ 
      success: true, 
      message: 'Seed concluído com 1 curso e 6 módulos (5 principais + 1 extra)', 
      courseId: course.id,
      modules: 6,
      totalLessons: 40
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}