import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/database';
import { comparePassword, generateToken } from '@/lib/auth';
import rateLimit from '@/lib/rateLimit';
import logger from '@/lib/logger';

const loginLimiter = rateLimit(5, 60 * 1000); // 5 requests per minute

export async function POST(request: NextRequest) {
  const res = await loginLimiter(request);
  if (res) return res;

  try {
    const prisma = dbConnect();

    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Normalizar email (remover espaços e converter para lowercase)
    const normalizedEmail = email.trim().toLowerCase();
    const normalizedPassword = password.trim();

    // Usuário administrador fixo (hardcoded)
    const ADMIN_EMAIL = 'admin@aurum.com.br';
    const ADMIN_PASSWORD = 'admin';
    
    // Verificar se é o usuário administrador fixo
    if (normalizedEmail === ADMIN_EMAIL && normalizedPassword === ADMIN_PASSWORD) {
      // Gerar token JWT para o administrador fixo
      const token = generateToken({
        userId: 'admin-fixed-user-id',
        email: ADMIN_EMAIL,
        role: 'ADMIN',
      });

      // Retornar dados do administrador fixo
      const adminUser = {
        id: 'admin-fixed-user-id',
        name: 'Administrador',
        email: ADMIN_EMAIL,
        role: 'ADMIN',
        enrollments: [],
      };

      return NextResponse.json({
        user: adminUser,
        token,
      });
    }

    // Buscar usuário por email
    const user = await prisma.user.findUnique({ 
      where: { email: normalizedEmail },
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
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Verificar senha
    const isPasswordValid = await comparePassword(normalizedPassword, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Gerar token JWT
    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    // Retornar dados do usuário (sem a senha) e token
    const userResponse = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      enrollments: user.enrollments,
    };

    return NextResponse.json({
      user: userResponse,
      token,
    });

  } catch (error: any) {
    logger.error("Login error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

