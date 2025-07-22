import mongoose, { Document, Schema } from 'mongoose';

export interface IProgress {
  moduleIndex: number;
  lessonIndex: number;
  completed: boolean;
  completedAt?: Date;
}

export interface IEnrollment extends Document {
  user: mongoose.Types.ObjectId;
  course: mongoose.Types.ObjectId;
  progress: IProgress[];
  enrolledAt: Date;
  completedAt?: Date;
}

const ProgressSchema: Schema = new Schema({
  moduleIndex: {
    type: Number,
    required: true,
  },
  lessonIndex: {
    type: Number,
    required: true,
  },
  completed: {
    type: Boolean,
    default: false,
  },
  completedAt: {
    type: Date,
  },
});

const EnrollmentSchema: Schema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  course: {
    type: Schema.Types.ObjectId,
    ref: 'Course',
    required: true,
  },
  progress: [ProgressSchema],
  enrolledAt: {
    type: Date,
    default: Date.now,
  },
  completedAt: {
    type: Date,
  },
});

// Índice único para evitar matrículas duplicadas
EnrollmentSchema.index({ user: 1, course: 1 }, { unique: true });

export default mongoose.models.Enrollment || mongoose.model<IEnrollment>('Enrollment', EnrollmentSchema);

