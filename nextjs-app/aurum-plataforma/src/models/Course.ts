import mongoose, { Document, Schema } from 'mongoose';
import { IModule } from './Module';

export interface ICourse extends Document {
  title: string;
  description: string;
  instructor: string;
  price: number;
  modules: mongoose.Types.ObjectId[] | IModule[];
  createdAt: Date;
  updatedAt: Date;
}



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
  modules: [{
    type: Schema.Types.ObjectId,
    ref: 'Module',
  }],
}, {
  timestamps: true,
});

export default mongoose.models.Course || mongoose.model<ICourse>('Course', CourseSchema);


