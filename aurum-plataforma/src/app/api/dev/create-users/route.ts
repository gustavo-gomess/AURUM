import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/database';
import { hashPassword } from '@/lib/auth';
// Removido import do Role - usando string diretamente

export async function POST(request: NextRequest) {
  try {
    const prisma = dbConnect();

    // Criar usuário admin
    const adminPassword = await hashPassword('admin123');
    
    let adminUser;
    try {
      adminUser = await prisma.user.create({
        data: {
          name: 'Administrador AURUM',
          email: 'admin@aurum.com.br',
          password: adminPassword,
          role: 'ADMIN',
        }
      });
      console.log('✅ Usuário admin criado:', adminUser.email);
    } catch (error) {
      // Se usuário já existe, buscar o existente
      adminUser = await prisma.user.findUnique({
        where: { email: 'admin@aurum.com.br' }
      });
      console.log('ℹ️ Usuário admin já existe:', adminUser?.email);
    }

    // Criar usuário padrão (estudante)
    const studentPassword = await hashPassword('student123');
    
    let studentUser;
    try {
      studentUser = await prisma.user.create({
        data: {
          name: 'Estudante Teste',
          email: 'estudante@teste.com',
          password: studentPassword,
          role: 'STUDENT',
        }
      });
      console.log('✅ Usuário estudante criado:', studentUser.email);
    } catch (error) {
      // Se usuário já existe, buscar o existente
      studentUser = await prisma.user.findUnique({
        where: { email: 'estudante@teste.com' }
      });
      console.log('ℹ️ Usuário estudante já existe:', studentUser?.email);
    }

    return NextResponse.json({
      success: true,
      message: 'Usuários criados com sucesso!',
      users: [
        {
          name: adminUser?.name,
          email: adminUser?.email,
          role: adminUser?.role,
          password: 'admin123'
        },
        {
          name: studentUser?.name,
          email: studentUser?.email,
          role: studentUser?.role,
          password: 'student123'
        }
      ]
    }, { status: 201 });

  } catch (error: any) {
    console.error('Erro ao criar usuários:', error);
    return NextResponse.json({
      success: false,
      message: error.message
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Use POST para criar os usuários',
    endpoints: {
      'POST /api/dev/create-users': 'Criar usuários admin e estudante'
    }
  });
}
