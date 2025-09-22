import { NextRequest, NextResponse } from 'next/server';
import React from 'react';
import dbConnect from '@/lib/database';
import { extractTokenFromRequest, verifyToken } from '@/lib/auth';
import puppeteer from 'puppeteer';
import ReactDOMServer from 'react-dom/server';
import CertificateTemplate from '@/components/CertificateTemplate';

export async function GET(req: NextRequest) {
  const prisma = dbConnect();
  try {
    const { searchParams } = new URL(req.url);
    const courseId = searchParams.get('courseId');

    const token = extractTokenFromRequest(req);
    if (!token) {
      return NextResponse.json({ success: false, message: 'Authorization token required' }, { status: 401 });
    }

    const payload: any = verifyToken(token);
    if (!payload) {
      return NextResponse.json({ success: false, message: 'Invalid or expired token' }, { status: 401 });
    }

    const userId = payload.userId;

    if (!courseId) {
      return NextResponse.json({ success: false, message: 'Course ID is required' }, { status: 400 });
    }

    // Buscar enrollment com progresso
    const enrollment = await prisma.enrollment.findFirst({
      where: { 
        userId: userId, 
        courseId: courseId 
      },
      include: {
        progress: true,
        course: {
          include: {
            modules: {
              include: {
                lessons: {
                  orderBy: { order: 'asc' }
                }
              },
              orderBy: { order: 'asc' }
            }
          }
        },
        user: true
      }
    });

    if (!enrollment) {
      return NextResponse.json({ success: false, message: 'Enrollment not found' }, { status: 404 });
    }

    // Verificar se todas as aulas foram completadas
    let allLessonsCompleted = true;
    for (const module of enrollment.course.modules) {
      for (const lesson of module.lessons) {
        const progress = enrollment.progress.find(
          (p) => p.moduleIndex === module.order && p.lessonIndex === lesson.order
        );
        if (!progress || !progress.completed) {
          allLessonsCompleted = false;
          break;
        }
      }
      if (!allLessonsCompleted) break;
    }

    if (!allLessonsCompleted) {
      return NextResponse.json({ success: false, message: 'Course not completed yet' }, { status: 403 });
    }

    // Gerar certificado
    const completionDate = new Date().toLocaleDateString('pt-BR');
    const htmlContent = ReactDOMServer.renderToString(
      React.createElement(CertificateTemplate, {
        userName: enrollment.user.name,
        courseTitle: enrollment.course.title,
        completionDate: completionDate,
      })
    );

    const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
    const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true });

    await browser.close();

    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="certificado-${enrollment.user.name.replace(/ /g, '_')}-${enrollment.course.title.replace(/ /g, '_')}.pdf"`,
      },
    });
  } catch (error: any) {
    console.error("Error generating certificate:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}