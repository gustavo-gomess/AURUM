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

    // Buscar usuário por email
    const user = await prisma.user.findUnique({ 
      where: { email: email.toLowerCase() },
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
    const isPasswordValid = await comparePassword(password, user.password);
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

