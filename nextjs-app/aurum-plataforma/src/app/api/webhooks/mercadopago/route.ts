import { NextRequest, NextResponse } from 'next/server';
import { MercadoPagoConfig, Payment } from 'mercadopago';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import Course from '@/models/Course';
import Enrollment from '@/models/Enrollment';
import { hashPassword } from '@/lib/auth';

const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN!,
});

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

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
    let user = await User.findOne({ email: userEmail.toLowerCase() });

    if (!user) {
      // Criar novo usuário com senha temporária
      const tempPassword = Math.random().toString(36).slice(-8);
      const hashedPassword = await hashPassword(tempPassword);

      user = new User({
        name: userName,
        email: userEmail.toLowerCase(),
        password: hashedPassword,
        role: 'student',
        courses: [courseId],
      });

      await user.save();

      // TODO: Enviar email com credenciais de acesso
      console.log(`User created with temporary password: ${tempPassword}`);
    } else {
      // Adicionar curso ao usuário existente se ainda não tiver
      if (!user.courses.includes(courseId)) {
        user.courses.push(courseId);
        await user.save();
      }
    }

    // Verificar se já existe matrícula
    const existingEnrollment = await Enrollment.findOne({
      user: user._id,
      course: courseId,
    });

    if (!existingEnrollment) {
      // Criar nova matrícula
      const enrollment = new Enrollment({
        user: user._id,
        course: courseId,
        progress: [],
      });

      await enrollment.save();
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

