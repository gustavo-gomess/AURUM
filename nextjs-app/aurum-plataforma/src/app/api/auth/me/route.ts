import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/database';
import { extractTokenFromRequest, verifyToken } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const prisma = dbConnect();

    // Extrair token do header Authorization
    const token = extractTokenFromRequest(request);
    if (!token) {
      return NextResponse.json(
        { error: 'Authorization token required' },
        { status: 401 }
      );
    }

    // Verificar token
    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    // Verificar se é o usuário administrador fixo
    if (payload.userId === 'admin-fixed-user-id' && payload.email === 'admin@aurum.com.br') {
      const adminUser = {
        id: 'admin-fixed-user-id',
        name: 'Administrador',
        email: 'admin@aurum.com.br',
        avatarUrl: null,
        role: 'ADMIN',
        enrollments: [],
      };
      return NextResponse.json({ user: adminUser });
    }

    // Buscar usuário
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      include: {
        enrollments: {
          include: {
            course: true
          }
        }
      }
    });
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Retornar dados do usuário (sem a senha)
    const userResponse = {
      id: user.id,
      name: user.name,
      email: user.email,
      avatarUrl: user.avatarUrl,
      role: user.role,
      enrollments: user.enrollments,
    };

    return NextResponse.json({ user: userResponse });

  } catch (error) {
    console.error('Get user error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

