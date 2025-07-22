import mongoose, { Document, Schema } from 'mongoose';

export interface ILesson {
  title: string;
  vimeoVideoId: string;
  order: number;
}

export interface IModule {
  title: string;
  lessons: ILesson[];
  order: number;
}

export interface ICourse extends Document {
  title: string;
  description: string;
  instructor: string;
  price: number;
  modules: IModule[];
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
});

const ModuleSchema: Schema = new Schema({
  title: {
    type: String,
    required: true,
  },
  lessons: [LessonSchema],
  order: {
    type: Number,
    required: true,
  },
});

const CourseSchema: Schema = new Schema({
  title: {
    type: String,
    required: [true, 'Please provide a course title'],
    maxlength: [100, 'Title cannot be more than 100 characters'],
  },
  description: {
    type: String,
    required: [true, 'Please provide a course description'],
  },
  instructor: {
    type: String,
    required: [true, 'Please provide an instructor name'],
  },
  price: {
    type: Number,
    required: [true, 'Please provide a price'],
    min: [0, 'Price cannot be negative'],
  },
  modules: [ModuleSchema],
}, {
  timestamps: true,
});

export default mongoose.models.Course || mongoose.model<ICourse>('Course', CourseSchema);

