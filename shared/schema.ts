export interface User {
  id: number;
  username: string;
  password: string;
  name: string;
  email: string;
  role: 'teacher';
  createdAt: Date;
}

export type InsertUser = Omit<User, 'id' | 'createdAt'>;
export type SelectUser = Omit<User, 'password'>;

export interface Class {
  id: number;
  name: string;
  section: string;
  subject: string;
  teacherId: number;
}

export interface Student {
  id: number;
  name: string;
  rollNumber: string;
  classId: number;
}

export interface Attendance {
  id: number;
  studentId: number;
  classId: number;
  date: string;
  status: 'present' | 'absent' | 'late';
  teacherId: number;
}

export interface Notification {
  id: number;
  userId: number;
  title: string;
  message: string;
  read: boolean;
  createdAt: Date;
}
