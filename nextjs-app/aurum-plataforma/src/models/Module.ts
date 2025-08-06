import mongoose, { Document, Schema } from 'mongoose';
import { ILesson } from './Course';

export interface IModule extends Document {
  title: string;
  description?: string;
  lessons: ILesson[];
  order: number;
  courseId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const LessonSchema: Schema = new Schema({
  title: {
    type: String,
    required: true,
  },
  vimeoVideoId: {
    type: String,
    required: true,
  },
  order: {
    type: Number,
    required: true,
  },
  tasks: {
    type: [String],
    required: false,
  },
});

const ModuleSchema: Schema = new Schema({
  title: {
    type: String,
    required: [true, 'Please provide a module title'],
    maxlength: [100, 'Title cannot be more than 100 characters'],
  },
  description: {
    type: String,
    required: false,
  },
  lessons: [LessonSchema],
  order: {
    type: Number,
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

export default mongoose.models.Module || mongoose.model<IModule>('Module', ModuleSchema);

