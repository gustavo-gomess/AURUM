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

    console.log('🗑️  Limpando banco de dados...');

    // Deletar todos os dados na ordem correta (respeitando as foreign keys)
    await prisma.comment.deleteMany({});
    console.log('   ✓ Comentários deletados');

    await prisma.notification.deleteMany({});
    console.log('   ✓ Notificações deletadas');

    await prisma.progress.deleteMany({});
    console.log('   ✓ Progresso deletado');

    await prisma.lesson.deleteMany({});
    console.log('   ✓ Aulas deletadas');

    await prisma.module.deleteMany({});
    console.log('   ✓ Módulos deletados');

    await prisma.course.deleteMany({});
    console.log('   ✓ Cursos deletados');

    await prisma.live.deleteMany({});
    console.log('   ✓ Lives deletadas');

    console.log('✅ Banco de dados limpo com sucesso!');

    return NextResponse.json({ 
      success: true, 
      message: 'Banco de dados limpo com sucesso. Agora você pode executar o seed novamente.' 
    });
  } catch (error: any) {
    console.error('❌ Erro ao limpar banco:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}

