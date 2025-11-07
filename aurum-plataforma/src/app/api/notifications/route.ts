import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/database';
import { extractTokenFromRequest, verifyToken } from '@/lib/auth';

// GET - Buscar notificações do usuário
export async function GET(req: NextRequest) {
  const prisma = dbConnect();
  try {
    const token = extractTokenFromRequest(req);
    if (!token) {
      return NextResponse.json({ success: false, message: "Authorization token required" }, { status: 401 });
    }

    const payload: any = verifyToken(token);
    if (!payload) {
      return NextResponse.json({ success: false, message: "Invalid or expired token" }, { status: 401 });
    }

    // Buscar notificações não lidas do usuário
    const notifications = await prisma.notification.findMany({
      where: {
        userId: payload.userId,
        read: false
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 10 // Limitar a 10 notificações mais recentes
    });

    return NextResponse.json({ 
      success: true, 
      notifications,
      count: notifications.length
    }, { 
      status: 200 
    });
  } catch (error: any) {
    console.error("Error fetching notifications:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
}

// PUT - Marcar notificação como lida
export async function PUT(req: NextRequest) {
  const prisma = dbConnect();
  try {
    const token = extractTokenFromRequest(req);
    if (!token) {
      return NextResponse.json({ success: false, message: "Authorization token required" }, { status: 401 });
    }

    const payload: any = verifyToken(token);
    if (!payload) {
      return NextResponse.json({ success: false, message: "Invalid or expired token" }, { status: 401 });
    }

    const { notificationId } = await req.json();

    if (!notificationId) {
      return NextResponse.json({ success: false, message: "Notification ID required" }, { status: 400 });
    }

    // Marcar notificação como lida
    await prisma.notification.update({
      where: {
        id: notificationId,
        userId: payload.userId // Garantir que seja do usuário correto
      },
      data: {
        read: true
      }
    });

    return NextResponse.json({ 
      success: true, 
      message: "Notification marked as read"
    }, { 
      status: 200 
    });
  } catch (error: any) {
    console.error("Error marking notification as read:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
}

// DELETE - Marcar todas as notificações como lidas
export async function DELETE(req: NextRequest) {
  const prisma = dbConnect();
  try {
    const token = extractTokenFromRequest(req);
    if (!token) {
      return NextResponse.json({ success: false, message: "Authorization token required" }, { status: 401 });
    }

    const payload: any = verifyToken(token);
    if (!payload) {
      return NextResponse.json({ success: false, message: "Invalid or expired token" }, { status: 401 });
    }

    // Marcar todas as notificações como lidas
    await prisma.notification.updateMany({
      where: {
        userId: payload.userId,
        read: false
      },
      data: {
        read: true
      }
    });

    return NextResponse.json({ 
      success: true, 
      message: "All notifications marked as read"
    }, { 
      status: 200 
    });
  } catch (error: any) {
    console.error("Error marking all notifications as read:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
}


