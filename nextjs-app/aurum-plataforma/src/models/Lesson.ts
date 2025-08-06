import mongoose, { Document, Schema } from 'mongoose';

export interface ILesson extends Document {
  title: string;
  description?: string;
  vimeoVideoId: string;
  order: number;
  tasks?: string[];
  moduleId: mongoose.Types.ObjectId;
  courseId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const LessonSchema: Schema = new Schema({
  title: {
    type: String,
    required: [true, 'Please provide a lesson title'],
    maxlength: [100, 'Title cannot be more than 100 characters'],
  },
  description: {
    type: String,
    required: false,
  },
  vimeoVideoId: {
    type: String,
    required: [true, 'Please provide a Vimeo video ID'],
  },
  order: {
    type: Number,
    required: true,
  },
  tasks: {
    type: [String],
    required: false,
  },
  moduleId: {
    type: Schema.Types.ObjectId,
    ref: 'Module',
    required: true,
  },
  courseId: {
    type: Schema.Types.ObjectId,
    ref: 'Course',
    required: true,
  },
}, {
  timestamps: true,
});

export default mongoose.models.Lesson || mongoose.model<ILesson>('Lesson', LessonSchema);

