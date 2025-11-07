import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/database';
import { Role } from '@prisma/client';
import { hashPassword, generateToken } from '@/lib/auth';
import rateLimit from '@/lib/rateLimit';
import logger from '@/lib/logger';

const registerLimiter = rateLimit(2, 60 * 1000); // 2 requests per minute

export async function POST(request: NextRequest) {
  const res = await registerLimiter(request);
  if (res) return res;

  try {
    const prisma = dbConnect();

    const { name, email, password, role = 'STUDENT' } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Name, email and password are required' },
        { status: 400 }
      );
    }

    // Verificar se o email já existe
    const existingUser = await prisma.user.findUnique({ 
      where: { email: email.toLowerCase() }
    });
    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      );
    }

    // Hash da senha
    const hashedPassword = await hashPassword(password);

    // Criar novo usuário
    const user = await prisma.user.create({
      data: {
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
        role: role.toUpperCase() as Role,
      },
    });

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
    };

    return NextResponse.json({
      user: userResponse,
      token,
    }, { status: 201 });

  } catch (error: any) {
    logger.error("Registration error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

