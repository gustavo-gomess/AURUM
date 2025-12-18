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
    async function upsertModuleWithLessons(moduleTitle: string, moduleDescription: string, order: number, lessons: Array<{title: string, vimeoId: string, order: number}>) {
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
            description: moduleDescription,
            order,
            courseId: course!.id,
          }
        });
      }

      // Criar aulas que não existam
      for (const lesson of lessons) {
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
              description: '',
              vimeoVideoId: lesson.vimeoId,
              order: lesson.order,
              moduleId: mod.id,
              courseId: course!.id,
              tasks: [],
            }
          });
        }
      }
      return mod;
    }

    // MÓDULO 01 - MENTALIDADE (15 aulas)
    const lessons01 = [
      { title: 'LIMPAR O TERRENO', vimeoId: '1147752447', order: 1 },
      { title: 'MENTALIDADE DE ABUNDÂNCIA X MENTALIDADE DE ESCASSEZ', vimeoId: '1146931332', order: 2 },
      { title: 'CRENÇAS LIMITANTES SOBRE VOCÊ', vimeoId: '1146931421', order: 3 },
      { title: 'CRENÇAS LIMITANTES EM RELAÇÃO AO DINHEIRO', vimeoId: '1146931552', order: 4 },
      { title: 'O PODER DO AMBIENTE E DAS PESSOAS AO REDOR', vimeoId: '1146931668', order: 5 },
      { title: 'FICAR RICO É COMPORTAMENTAL NÃO INTELECTUAL', vimeoId: '1146931762', order: 6 },
      { title: 'HÁBITO ANGULAR', vimeoId: '1146931853', order: 7 },
      { title: 'COMO CRIAR UM HÁBITO', vimeoId: '1146932010', order: 8 },
      { title: 'MINDSET DE LONGO PRAZO X PRAZER IMEDIATO', vimeoId: '1146932107', order: 9 },
      { title: 'FOCO E PRIORIDADES', vimeoId: '1146932202', order: 10 },
      { title: 'A IMPORTÂNCIA DA META E COMO ESTABELECER UMA', vimeoId: '1146932315', order: 11 },
      { title: 'AUTO RESPONSABILIDADE', vimeoId: '1146932469', order: 12 },
      { title: 'COMO LIDAR COM O MEDO DO FRACASSO FINANCEIRO', vimeoId: '1146932548', order: 13 },
      { title: 'MELHORIA CONTÍNUA', vimeoId: '1146932683', order: 14 },
      { title: 'APRENDA A SER GRATO', vimeoId: '1146932777', order: 15 },
    ];

    await upsertModuleWithLessons(
      '01 MENTALIDADE',
      'Fundamentos da mentalidade financeira de sucesso',
      1,
      lessons01
    );

    // MÓDULO 02 - DINHEIRO, BANCOS E GOVERNOS (10 aulas)
    const lessons02 = [
      { title: 'AULA 01 A HISTÓRIA DO DINHEIRO', vimeoId: '1146934236', order: 1 },
      { title: 'AULA 02 MOEDAS FIDUCIÁRIAS E O FIM DO LASTRO', vimeoId: '1146934360', order: 2 },
      { title: 'AULA 03 QUAL A FUNÇÃO DO DINHEIRO', vimeoId: '1146934472', order: 3 },
      { title: 'AULA 04 INFLAÇÃO, O QUE É E COMO FUNCIONA', vimeoId: '1146934597', order: 4 },
      { title: 'AULA 05 INFLAÇÃO X DEFLAÇÃO - PORQUE OS GOVERNOS GOSTAM DA INFLAÇÃO', vimeoId: '1146934715', order: 5 },
      { title: 'AULA 06 RESERVAS FRACIONÁRIAS', vimeoId: '1146934832', order: 6 },
      { title: 'AULA 07 EFEITO CANTILLON', vimeoId: '1146935135', order: 7 },
      { title: 'AULA 08 PORQUE OS GOVERNOS FAZEM DÍVIDAS', vimeoId: '1146935330', order: 8 },
      { title: 'AULA 09 A IMPORTÂNCIA DO CAPITALISMO', vimeoId: '1146935497', order: 9 },
      { title: 'AULA 10 CONCLUSÃO E FECHAMENTO', vimeoId: '1146935758', order: 10 },
    ];

    await upsertModuleWithLessons(
      '02 DINHEIRO, BANCOS E GOVERNOS',
      'Entenda o sistema financeiro, moedas e como funcionam os bancos',
      2,
      lessons02
    );

    // MÓDULO 03 - DÍVIDAS, GASTOS E ORÇAMENTO (10 aulas)
    const lessons03 = [
      { title: 'AULA 01 DIAGNÓSTICO FINANCEIRO', vimeoId: '1146938529', order: 1 },
      { title: 'AULA 02 O CUSTO INVISÍVEL DA DÍVIDA', vimeoId: '1146938990', order: 2 },
      { title: 'AULA 03 COMO SAIR DAS DÍVIDAS - PASSO A PASSO', vimeoId: '1146939161', order: 3 },
      { title: 'AULA 04 A VIDA DO ZERO A ZERO', vimeoId: '1146939313', order: 4 },
      { title: 'AULA 05 O GRANDE VILÃO - O CONSUMO AUTOMÁTICO', vimeoId: '1146939503', order: 5 },
      { title: 'AULA 06 A MENTIRA DO EU MEREÇO', vimeoId: '1146939652', order: 6 },
      { title: 'AULA 07 POQUE SOBRAR DINHEIRO NÃO É O FIM, MAS SIM O COMEÇO', vimeoId: '1146939781', order: 7 },
      { title: 'AULA 08 CRIANDO O SEU ORÇAMENTO PESSOAL INTELIGENTE', vimeoId: '1146939892', order: 8 },
      { title: 'AULA 09 O PRIMEIRO PASSO PRA INVESTIR', vimeoId: '1146940180', order: 9 },
      { title: 'AULA EXTRA - COMO CONVERSAR SOBRE DINHEIRO COM A FAMÍLIA', vimeoId: '1146940366', order: 10 },
    ];

    await upsertModuleWithLessons(
      '03 DÍVIDAS, GASTOS E ORÇAMENTO',
      'Aprenda a controlar suas finanças, eliminar dívidas e criar um orçamento inteligente',
      3,
      lessons03
    );

    // MÓDULO 04 - RENDA FIXA (12 aulas)
    const lessons04 = [
      { title: 'AULA 01 O QUE É A RENDA FIXA', vimeoId: '1146941304', order: 1 },
      { title: 'AULA 02 MITOS E VERDADES DA RENDA FIXA', vimeoId: '1146941463', order: 2 },
      { title: 'AULA 03 ENDIVIDAMENTO X INVESTIMENTOS (consórcios, financiamentos e títulos de capitalização)', vimeoId: '1146941804', order: 3 },
      { title: 'AULA 04 TESOURO DIRETO (SELIC, PREFIXADO E IPCA+)', vimeoId: '1146942248', order: 4 },
      { title: 'AULA 05 CDB, LCI, LCA E CDI: ENTENDENDO A RENDA FIXA DOS BANCOS E O PAPEL DO FGC', vimeoId: '1146943100', order: 5 },
      { title: 'AULA 06 RISCO DE CRÉDITO E BANCOS RUINS', vimeoId: '1146943721', order: 6 },
      { title: 'AULA 07 DEBÊNTURES, CRI e CRA A RENDA FIXA DE EMPRESAS', vimeoId: '1146944138', order: 7 },
      { title: 'AULA 08 IOF, IR E TRIBUTAÇÃO NA RENDA FIXA + COE', vimeoId: '1146944361', order: 8 },
      { title: 'AULA 09 PIRÂMIDES FINANCEIRAS E GOLPES', vimeoId: '1146944717', order: 9 },
      { title: 'AULA 10 CORRETORAS, BANCOS E HOME BROKER POR ONDE INVESTIR', vimeoId: '1146945092', order: 10 },
      { title: 'AULA 11 RESERVA DE EMERGÊNCIA ONDE COLOCAR NA PRÁTICA', vimeoId: '1146945392', order: 11 },
      { title: 'AULA 12 COMPRANDO TESOURO DIRETO NA PRÁTICA (PASSO A PASSO)', vimeoId: '1146945543', order: 12 },
    ];

    await upsertModuleWithLessons(
      '04 RENDA FIXA',
      'Tudo sobre investimentos em renda fixa: Tesouro Direto, CDB, LCI, LCA e mais',
      4,
      lessons04
    );

    // MÓDULO 05 - RENDA VARIÁVEL (19 aulas)
    const lessons05 = [
      { title: 'RENDA VARIÁVEL E ESCOLAS DE ANÁLISE FUNDAMENTALISTA X GRÁFICA', vimeoId: '1147688108', order: 1 },
      { title: 'AÇÕES O QUE SÃO E PORQUE INVESTIR', vimeoId: '1147688249', order: 2 },
      { title: 'TIPOS DE AÇÕES E NOMENCLATURAS (ON, PN, Units e Tag Along)', vimeoId: '1147688373', order: 3 },
      { title: 'INDICADORES FUNDAMENTAIS QUE TODO INVESTIDOR DEVE CONHECER', vimeoId: '1147688520', order: 4 },
      { title: 'FERRAMENTAS E SITES PARA CONSULTAR INDICADORES', vimeoId: '1147688770', order: 5 },
      { title: 'COMO COMPRAR AÇÕES PELO HOME BROKER (na prática)', vimeoId: '1147688903', order: 6 },
      { title: 'PROVENTOS DIVIDENDOS; JCP; BONIFICAÇÕES E SUBSCRIÇÕES', vimeoId: '1147689218', order: 7 },
      { title: 'DESDOBRAMENTOS E GRUPAMENTOS POR QUE AS EMPRESAS FAZEM ISSO', vimeoId: '1147689524', order: 8 },
      { title: 'LEITURA DE GRÁFICOS CANDLESTICKS; SUPORTES E RESISTÊNCIAS', vimeoId: '1147689737', order: 9 },
      { title: 'ALUGUEL DE AÇÕES E OUTRAS FORMAS DE RENTABILIZAR SUA CARTEIRA', vimeoId: '1147690097', order: 10 },
      { title: 'ETFs e BDRs DIVERSIFICAÇÃO NACIONAL E INTERNACIONAL', vimeoId: '1147690310', order: 11 },
      { title: 'FUNDOS IMOBILIÁRIOS (FIIs)', vimeoId: '1147690689', order: 12 },
      { title: 'ETFs e BDRs DIVERSIFICAÇÃO NACIONAL E INTERNACIONAL', vimeoId: '1147691126', order: 13 },
      { title: 'CARTEIRA DE INVESTIMENTOS E DIVERSIFICAÇÃO INTELIGENTE', vimeoId: '1147751769', order: 14 },
      { title: 'APORTES MENSAIS; DISCIPLINA E JUROS COMPOSTOS', vimeoId: '1147751944', order: 15 },
      { title: 'QUANDO VENDER UM ATIVO (e Quando Não Fazer Nada)', vimeoId: '1147752153', order: 16 },
      { title: 'CONSOLIDANDO SUA CARTEIRA DE INVESTIMENTOS', vimeoId: '1147752333', order: 17 },
    ];

    await upsertModuleWithLessons(
      '05 RENDA VARIÁVEL',
      'Investimentos em ações, análise fundamentalista e estratégias de trading',
      5,
      lessons05
    );

    const totalLessons = lessons01.length + lessons02.length + lessons03.length + lessons04.length + lessons05.length;

    return NextResponse.json({ 
      success: true, 
      message: 'Seed concluído com dados corretos do curso AURUM', 
      courseId: course.id,
      modules: 5,
      totalLessons: totalLessons
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}