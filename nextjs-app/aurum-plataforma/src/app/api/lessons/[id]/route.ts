import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Lesson from '@/models/Lesson';
import Module from '@/models/Module';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  await dbConnect();
  try {
    const { id } = params;
    const lesson = await Lesson.findById(id);
    if (!lesson) {
      return NextResponse.json({ success: false, message: 'Lesson not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: lesson }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  await dbConnect();
  try {
    const { id } = params;
    const body = await req.json();
    const lesson = await Lesson.findByIdAndUpdate(id, body, { new: true, runValidators: true });
    if (!lesson) {
      return NextResponse.json({ success: false, message: 'Lesson not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: lesson }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  await dbConnect();
  try {
    const { id } = params;
    const lesson = await Lesson.findByIdAndDelete(id);
    if (!lesson) {
      return NextResponse.json({ success: false, message: 'Lesson not found' }, { status: 404 });
    }
    // Remove lesson reference from module
    await Module.findByIdAndUpdate(lesson.moduleId, { $pull: { lessons: lesson._id } });

    return NextResponse.json({ success: true, data: {} }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
}


