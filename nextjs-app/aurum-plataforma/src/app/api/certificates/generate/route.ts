import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Enrollment from '@/models/Enrollment';
import Course from '@/models/Course';
import User from '@/models/User';
import { extractTokenFromRequest, verifyToken } from '@/lib/auth';
import puppeteer from 'puppeteer';
import ReactDOMServer from 'react-dom/server';
import CertificateTemplate from '@/components/CertificateTemplate';

export async function GET(req: NextRequest) {
  await dbConnect();
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

    const enrollment = await Enrollment.findOne({ user: userId, course: courseId });

    if (!enrollment) {
      return NextResponse.json({ success: false, message: 'Enrollment not found' }, { status: 404 });
    }

    const course = await Course.findById(courseId).populate({ path: 'modules', populate: { path: 'lessons' } });
    const user = await User.findById(userId);

    if (!course || !user) {
      return NextResponse.json({ success: false, message: 'Course or User not found' }, { status: 404 });
    }

    // Check if all lessons are completed
    let allLessonsCompleted = true;
    for (const module of course.modules) {
      for (const lesson of (module as any).lessons) {
        const progress = enrollment.progress.find(
          (p) => p.moduleIndex === (module as any).order && p.lessonIndex === lesson.order
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

    // Generate certificate
    const completionDate = new Date().toLocaleDateString('pt-BR');
    const htmlContent = ReactDOMServer.renderToString(
      React.createElement(CertificateTemplate, {
        userName: user.name,
        courseTitle: course.title,
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
        'Content-Disposition': `attachment; filename="certificado-${user.name.replace(/ /g, '_')}-${course.title.replace(/ /g, '_')}.pdf"`,
      },
    });
  } catch (error: any) {
    console.error("Error generating certificate:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}


