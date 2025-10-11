import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/database';
import { extractTokenFromRequest, verifyToken } from '@/lib/auth';
import { redisClient, connectRedis } from '@/lib/cache';
import logger from '@/lib/logger';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const prisma = dbConnect();
    await connectRedis();

    const { id } = await params;
    const cacheKey = `course:${id}`;

    // Tentar buscar do cache
    const cachedCourse = await redisClient.get(cacheKey);
    if (cachedCourse) {
      logger.info(`Course ${id} found in cache.`);
      return NextResponse.json({ course: JSON.parse(cachedCourse) });
    }

    // Buscar curso por ID
    const course = await prisma.course.findUnique({
      where: { id },
      include: {
        modules: {
          include: {
            lessons: true
          }
        }
      }
    });
    if (!course) {
      logger.warn(`Course ${id} not found.`);
      return NextResponse.json(
        { error: 'Course not found' },
        { status: 404 }
      );
    }

    // Armazenar no cache (TTL de 1 hora)
    await redisClient.set(cacheKey, JSON.stringify(course), { EX: 3600 });
    logger.info(`Course ${id} cached.`);

    return NextResponse.json({ course });

  } catch (error: any) {
    logger.error('Get course error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const prisma = dbConnect();
    await connectRedis();

    const { id } = await params;
    const cacheKey = `course:${id}`;

    // Extrair token do header Authorization
    const token = extractTokenFromRequest(request);
    if (!token) {
      logger.warn("Authorization token required for course update.");
      return NextResponse.json(
        { error: 'Authorization token required' },
        { status: 401 }
      );
    }

    // Verificar token
    const payload = verifyToken(token);
    if (!payload) {
      logger.warn("Invalid or expired token for course update.");
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    // Verificar se é admin
    if (payload.role !== 'ADMIN') {
      logger.warn(`User ${payload.userId} attempted to update course ${id} without admin privileges.`);
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    const updateData = await request.json();

    // Atualizar curso
    const course = await prisma.course.update({
      where: { id },
      data: updateData,
      include: {
        modules: {
          include: {
            lessons: true
          }
        }
      }
    });

    if (!course) {
      logger.warn(`Course ${id} not found for update.`);
      return NextResponse.json(
        { error: 'Course not found' },
        { status: 404 }
      );
    }

    // Invalidar cache
    await redisClient.del(cacheKey);
    logger.info(`Cache for course ${id} invalidated.`);

    return NextResponse.json({ course });

  } catch (error: any) {
    logger.error('Update course error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const prisma = dbConnect();
    await connectRedis();

    const { id } = await params;
    const cacheKey = `course:${id}`;

    // Extrair token do header Authorization
    const token = extractTokenFromRequest(request);
    if (!token) {
      logger.warn("Authorization token required for course deletion.");
      return NextResponse.json(
        { error: 'Authorization token required' },
        { status: 401 }
      );
    }

    // Verificar token
    const payload = verifyToken(token);
    if (!payload) {
      logger.warn("Invalid or expired token for course deletion.");
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    // Verificar se é admin
    if (payload.role !== 'ADMIN') {
      logger.warn(`User ${payload.userId} attempted to delete course ${id} without admin privileges.`);
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    // Deletar curso
    const course = await prisma.course.delete({
      where: { id }
    });

    if (!course) {
      logger.warn(`Course ${id} not found for deletion.`);
      return NextResponse.json(
        { error: 'Course not found' },
        { status: 404 }
      );
    }

    // Invalidar cache
    await redisClient.del(cacheKey);
    logger.info(`Cache for course ${id} invalidated.`);

    return NextResponse.json({ message: 'Course deleted successfully' });

  } catch (error: any) {
    logger.error('Delete course error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

