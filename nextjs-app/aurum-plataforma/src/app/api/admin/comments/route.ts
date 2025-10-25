import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/database';
import { verifyToken } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 [Admin Comments API] Starting request...');
    const prisma = dbConnect();
    
    // Verificar token
    const authHeader = request.headers.get('authorization');
    console.log('🔑 [Admin Comments API] Auth header:', authHeader ? 'Present' : 'Missing');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('❌ [Admin Comments API] No valid auth header');
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);
    
    console.log('👤 [Admin Comments API] Decoded token:', decoded ? `User: ${decoded.userId}, Role: ${decoded.role}` : 'Invalid');
    
    if (!decoded) {
      console.log('❌ [Admin Comments API] Invalid token');
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    // Verificar se é admin
    if (decoded.role !== 'ADMIN') {
      console.log('❌ [Admin Comments API] User is not admin');
      return NextResponse.json(
        { error: 'Forbidden - Admin access required' },
        { status: 403 }
      );
    }

    console.log('📊 [Admin Comments API] Fetching comments from database...');

    // Buscar todos os comentários com informações relacionadas
    const comments = await prisma.comment.findMany({
      where: {
        parentId: null // Apenas comentários principais (não respostas)
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true
          }
        },
        lesson: {
          select: {
            id: true,
            title: true,
            module: {
              select: {
                title: true
              }
            }
          }
        },
        replies: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                role: true
              }
            }
          },
          orderBy: {
            timestamp: 'asc'
          }
        }
      },
      orderBy: {
        timestamp: 'desc'
      }
    });

    console.log(`✅ [Admin Comments API] Found ${comments.length} comments`);

    return NextResponse.json({
      comments,
      total: comments.length
    });

  } catch (error: any) {
    console.error('❌ [Admin Comments API] Error:', error);
    console.error('Error details:', error.message);
    console.error('Error stack:', error.stack);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

