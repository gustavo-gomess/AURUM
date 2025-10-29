import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/database';
import { extractTokenFromRequest, verifyToken } from '@/lib/auth';

// Cache simples em memória (válido por 5 minutos)
let coursesCache: any = null;
let cacheTime: number = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

export async function GET(request: NextRequest) {
  try {
    // Verificar cache
    const now = Date.now();
    if (coursesCache && (now - cacheTime) < CACHE_DURATION) {
      return NextResponse.json({ courses: coursesCache }, {
        headers: { 'X-Cache': 'HIT' }
      });
    }

    const prisma = dbConnect();

    // Buscar todos os cursos
    const courses = await prisma.course.findMany({
      include: {
        modules: {
          include: {
            lessons: true
          }
        }
      }
    });

    // Atualizar cache
    coursesCache = courses;
    cacheTime = now;

    return NextResponse.json({ courses }, {
      headers: { 'X-Cache': 'MISS' }
    });

  } catch (error) {
    console.error('Get courses error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
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

    // Verificar se é admin
    if (payload.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    const courseData = await request.json();

    // Criar novo curso
    const course = await prisma.course.create({
      data: {
        title: courseData.title,
        description: courseData.description,
        instructor: courseData.instructor,
        price: courseData.price,
      },
      include: {
        modules: true
      }
    });

    return NextResponse.json({ course }, { status: 201 });

  } catch (error) {
    console.error('Create course error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

