import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/database';
import { PrismaClient } from '@prisma/client';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

interface JWTPayload {
  userId: string;
  email: string;
  role: string;
}

export async function PUT(request: NextRequest) {
  try {
    const prisma = dbConnect() as PrismaClient;
    
    // Extrair e verificar token
    const token = request.headers.get('authorization')?.split(' ')[1];
    
    if (!token) {
      return NextResponse.json(
        { error: 'Token não fornecido' },
        { status: 401 }
      );
    }

    let decoded: JWTPayload;
    try {
      decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
    } catch (error) {
      return NextResponse.json(
        { error: 'Token inválido' },
        { status: 401 }
      );
    }

    // Obter dados do corpo da requisição
    const body = await request.json();
    const { name, avatarUrl, currentPassword, newPassword } = body;

    // Validações
    if (!name || name.trim() === '') {
      return NextResponse.json(
        { error: 'Nome é obrigatório' },
        { status: 400 }
      );
    }

    if (name.length > 60) {
      return NextResponse.json(
        { error: 'Nome deve ter no máximo 60 caracteres' },
        { status: 400 }
      );
    }

    // Validar URL do avatar se fornecida
    if (avatarUrl && avatarUrl.trim() !== '') {
      try {
        new URL(avatarUrl);
      } catch (error) {
        return NextResponse.json(
          { error: 'URL do avatar inválida' },
          { status: 400 }
        );
      }
    }

    // Preparar dados para atualização
    const updateData: any = {
      name: name.trim(),
      avatarUrl: avatarUrl && avatarUrl.trim() !== '' ? avatarUrl.trim() : null,
    };

    // Se está tentando alterar a senha
    if (currentPassword || newPassword) {
      if (!currentPassword) {
        return NextResponse.json(
          { error: 'Senha atual é obrigatória para alterá-la' },
          { status: 400 }
        );
      }

      if (!newPassword) {
        return NextResponse.json(
          { error: 'Nova senha é obrigatória' },
          { status: 400 }
        );
      }

      if (newPassword.length < 6) {
        return NextResponse.json(
          { error: 'A nova senha deve ter no mínimo 6 caracteres' },
          { status: 400 }
        );
      }

      // Buscar usuário com senha para validar
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        select: { id: true, password: true },
      });

      if (!user) {
        return NextResponse.json(
          { error: 'Usuário não encontrado' },
          { status: 404 }
        );
      }

      // Verificar senha atual
      const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
      
      if (!isPasswordValid) {
        return NextResponse.json(
          { error: 'Senha atual incorreta' },
          { status: 401 }
        );
      }

      // Hash da nova senha
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      updateData.password = hashedPassword;
    }

    // Atualizar usuário no banco de dados
    const updatedUser = await prisma.user.update({
      where: {
        id: decoded.userId,
      },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        avatarUrl: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    console.log('✅ Perfil atualizado com sucesso:', updatedUser.id);
    
    const message = currentPassword && newPassword 
      ? 'Perfil e senha atualizados com sucesso' 
      : 'Perfil atualizado com sucesso';

    return NextResponse.json({
      message,
      user: updatedUser,
    });
  } catch (error) {
    console.error('❌ Erro ao atualizar perfil:', error);
    return NextResponse.json(
      { error: 'Erro ao atualizar perfil' },
      { status: 500 }
    );
  }
}

