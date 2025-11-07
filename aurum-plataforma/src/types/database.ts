import { 
  User, 
  Course, 
  Module, 
  Lesson, 
  Enrollment, 
  Progress, 
  Comment, 
  Role 
} from '@prisma/client';

// Tipos básicos exportados do Prisma
export type { 
  User, 
  Course, 
  Module, 
  Lesson, 
  Enrollment, 
  Progress, 
  Comment, 
  Role 
};

// Tipos estendidos com relacionamentos
export type UserWithRelations = User & {
  enrollments?: EnrollmentWithRelations[];
  comments?: Comment[];
  answeredComments?: Comment[];
};

export type CourseWithRelations = Course & {
  modules?: ModuleWithRelations[];
  enrollments?: EnrollmentWithRelations[];
};

export type ModuleWithRelations = Module & {
  course?: Course;
  lessons?: Lesson[];
};

export type LessonWithRelations = Lesson & {
  module?: Module;
  comments?: CommentWithRelations[];
};

export type EnrollmentWithRelations = Enrollment & {
  user?: User;
  course?: CourseWithRelations;
  progress?: Progress[];
};

export type CommentWithRelations = Comment & {
  user?: User;
  lesson?: Lesson;
  parent?: Comment;
  replies?: Comment[];
  answeredByUser?: User;
};

// Tipos para criação (sem campos automáticos)
export type CreateUser = Omit<User, 'id' | 'createdAt' | 'updatedAt'>;
export type CreateCourse = Omit<Course, 'id' | 'createdAt' | 'updatedAt'>;
export type CreateModule = Omit<Module, 'id' | 'createdAt' | 'updatedAt'>;
export type CreateLesson = Omit<Lesson, 'id' | 'createdAt' | 'updatedAt'>;
export type CreateEnrollment = Omit<Enrollment, 'id' | 'enrolledAt' | 'completedAt'>;
export type CreateProgress = Omit<Progress, 'id' | 'completedAt'>;
export type CreateComment = Omit<Comment, 'id' | 'timestamp'>;

// Tipos para atualização (todos os campos opcionais exceto id)
export type UpdateUser = Partial<Omit<User, 'id' | 'createdAt' | 'updatedAt'>>;
export type UpdateCourse = Partial<Omit<Course, 'id' | 'createdAt' | 'updatedAt'>>;
export type UpdateModule = Partial<Omit<Module, 'id' | 'createdAt' | 'updatedAt'>>;
export type UpdateLesson = Partial<Omit<Lesson, 'id' | 'createdAt' | 'updatedAt'>>;
export type UpdateEnrollment = Partial<Omit<Enrollment, 'id' | 'enrolledAt'>>;
export type UpdateProgress = Partial<Omit<Progress, 'id'>>;
export type UpdateComment = Partial<Omit<Comment, 'id' | 'timestamp'>>;
