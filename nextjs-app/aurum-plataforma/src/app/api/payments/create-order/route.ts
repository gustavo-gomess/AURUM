import { NextRequest, NextResponse } from 'next/server';
import { MercadoPagoConfig, Preference } from 'mercadopago';
import dbConnect from '@/lib/mongodb';
import Course from '@/models/Course';

const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN!,
});

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const { courseId, userEmail, userName } = await request.json();

    if (!courseId || !userEmail || !userName) {
      return NextResponse.json(
        { error: 'courseId, userEmail, and userName are required' },
        { status: 400 }
      );
    }

    // Buscar curso
    const course = await Course.findById(courseId);
    if (!course) {
      return NextResponse.json(
        { error: 'Course not found' },
        { status: 404 }
      );
    }

    const preference = new Preference(client);

    const preferenceData = {
      items: [
        {
          id: course._id.toString(),
          title: course.title,
          description: course.description,
          quantity: 1,
          unit_price: course.price,
        },
      ],
      payer: {
        email: userEmail,
        name: userName,
      },
      back_urls: {
        success: `${process.env.NEXT_PUBLIC_APP_URL}/payment/success`,
        failure: `${process.env.NEXT_PUBLIC_APP_URL}/payment/failure`,
        pending: `${process.env.NEXT_PUBLIC_APP_URL}/payment/pending`,
      },
      auto_return: 'approved',
      notification_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/webhooks/mercadopago`,
      external_reference: JSON.stringify({
        courseId: course._id.toString(),
        userEmail,
        userName,
      }),
    };

    const result = await preference.create({ body: preferenceData });

    return NextResponse.json({
      preferenceId: result.id,
      initPoint: result.init_point,
      sandboxInitPoint: result.sandbox_init_point,
    });

  } catch (error) {
    console.error('Create payment preference error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

