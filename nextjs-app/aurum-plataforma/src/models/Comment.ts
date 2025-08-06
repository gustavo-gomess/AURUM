import mongoose, { Document, Schema } from 'mongoose';

export interface IComment extends Document {
  userId: mongoose.Types.ObjectId;
  lessonId: mongoose.Types.ObjectId;
  content: string;
  timestamp: Date;
  parentId?: mongoose.Types.ObjectId;
  answeredBy?: mongoose.Types.ObjectId;
  answerContent?: string;
}

const CommentSchema: Schema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  lessonId: {
    type: Schema.Types.ObjectId,
    ref: 'Lesson',
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  parentId: {
    type: Schema.Types.ObjectId,
    ref: 'Comment',
    required: false,
  },
  answeredBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: false,
  },
  answerContent: {
    type: String,
    required: false,
  },
});

export default mongoose.models.Comment || mongoose.model<IComment>('Comment', CommentSchema);


