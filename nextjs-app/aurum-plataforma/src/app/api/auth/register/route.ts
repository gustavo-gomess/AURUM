import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { hashPassword, generateToken } from '@/lib/auth';
import rateLimit from '@/lib/rateLimit';
import logger from '@/lib/logger';

const registerLimiter = rateLimit(2, 60 * 1000); // 2 requests per minute

export async function POST(request: NextRequest) {
  const res = await registerLimiter(request);
  if (res) return res;

  try {
    await dbConnect();

    const { name, email, password, role = 'student' } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Name, email and password are required' },
        { status: 400 }
      );
    }

    // Verificar se o email já existe
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      );
    }

    // Hash da senha
    const hashedPassword = await hashPassword(password);

    // Criar novo usuário
    const user = new User({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role,
      courses: [],
    });

    await user.save();

    // Gerar token JWT
    const token = generateToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    // Retornar dados do usuário (sem a senha) e token
    const userResponse = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      courses: user.courses,
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

