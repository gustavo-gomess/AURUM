import { NextRequest, NextResponse } from 'next/server';
import { MercadoPagoConfig, Payment } from 'mercadopago';
import dbConnect from '@/lib/database';
import { hashPassword } from '@/lib/auth';
import { Role } from '@prisma/client';

const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN!,
});

export async function POST(request: NextRequest) {
  try {
    const prisma = dbConnect();
    const body = await request.json();

    // Verificar se é uma notificação de pagamento
    if (body.type !== 'payment') {
      return NextResponse.json({ message: 'Not a payment notification' });
    }

    const paymentId = body.data.id;
    const payment = new Payment(client);
    
    // Buscar detalhes do pagamento
    const paymentData = await payment.get({ id: paymentId });

    // Verificar se o pagamento foi aprovado
    if (paymentData.status !== 'approved') {
      return NextResponse.json({ message: 'Payment not approved' });
    }

    // Extrair dados da referência externa
    const externalReference = JSON.parse(paymentData.external_reference || '{}');
    const { courseId, userEmail, userName } = externalReference;

    if (!courseId || !userEmail || !userName) {
      console.error('Missing data in external reference:', externalReference);
      return NextResponse.json({ error: 'Invalid external reference' }, { status: 400 });
    }

    // Verificar se o usuário já existe
    let user = await prisma.user.findUnique({
      where: { email: userEmail.toLowerCase() }
    });

    if (!user) {
      // Criar novo usuário com senha temporária
      const tempPassword = Math.random().toString(36).slice(-8);
      const hashedPassword = await hashPassword(tempPassword);

      user = await prisma.user.create({
        data: {
          name: userName,
          email: userEmail.toLowerCase(),
          password: hashedPassword,
          role: Role.STUDENT,
        }
      });

      // TODO: Enviar email com credenciais de acesso
      console.log(`User created with temporary password: ${tempPassword}`);
    }

    // Verificar se já existe matrícula
    const existingEnrollment = await prisma.enrollment.findFirst({
      where: {
        userId: user.id,
        courseId: courseId,
      }
    });

    if (!existingEnrollment) {
      // Criar nova matrícula
      await prisma.enrollment.create({
        data: {
          userId: user.id,
          courseId: courseId,
        }
      });
    }

    return NextResponse.json({ message: 'Payment processed successfully' });

  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Permitir apenas POST
export async function GET() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}