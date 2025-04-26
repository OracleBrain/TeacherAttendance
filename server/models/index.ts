import mongoose from 'mongoose';
import { User, Class, Student, Attendance, Notification } from "../../shared/schema";

// User Schema
const userSchema = new mongoose.Schema({
  id: { type: Number, unique: true, required: true },
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  role: { type: String, enum: ['teacher'], default: 'teacher' },
  createdAt: { type: Date, default: Date.now }
});

// Class Schema
const classSchema = new mongoose.Schema({
  id: { type: Number, unique: true, required: true },
  name: { type: String, required: true },
  section: { type: String, required: true },
  subject: { type: String, required: true },
  teacherId: { type: Number, required: true }
});

// Student Schema
const studentSchema = new mongoose.Schema({
  id: { type: Number, unique: true, required: true },
  name: { type: String, required: true },
  rollNumber: { type: String, required: true },
  classId: { type: Number, required: true }
});

// Attendance Schema
const attendanceSchema = new mongoose.Schema({
  id: { type: Number, unique: true, required: true },
  studentId: { type: Number, required: true },
  classId: { type: Number, required: true },
  date: { type: String, required: true },
  status: { type: String, enum: ['present', 'absent', 'late'], required: true },
  teacherId: { type: Number, required: true }
});

// Notification Schema
const notificationSchema = new mongoose.Schema({
  id: { type: Number, unique: true, required: true },
  userId: { type: Number, required: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  read: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

// Create and export the models
export const UserModel = mongoose.model<User & mongoose.Document>('User', userSchema);
export const ClassModel = mongoose.model<Class & mongoose.Document>('Class', classSchema);
export const StudentModel = mongoose.model<Student & mongoose.Document>('Student', studentSchema);
export const AttendanceModel = mongoose.model<Attendance & mongoose.Document>('Attendance', attendanceSchema);
export const NotificationModel = mongoose.model<Notification & mongoose.Document>('Notification', notificationSchema);

// Counter for auto-incrementing IDs
export const CounterModel = mongoose.model('Counter', new mongoose.Schema({
  modelName: { type: String, required: true, unique: true },
  count: { type: Number, default: 0 }
}));

// Function to get the next ID for a model
export async function getNextId(modelName: string): Promise<number> {
  const counter = await CounterModel.findOneAndUpdate(
    { modelName },
    { $inc: { count: 1 } },
    { new: true, upsert: true }
  );
  return counter.count;
}