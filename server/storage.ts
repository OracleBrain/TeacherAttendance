import { User, InsertUser, SelectUser, Class, Student, Attendance, Notification } from "../shared/schema";
import { UserModel, ClassModel, StudentModel, AttendanceModel, NotificationModel, getNextId } from "./models";
import connectMongo from "connect-mongo";
import session from "express-session";

export interface IStorage {
  getUser(id: number): Promise<SelectUser | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<SelectUser>;
  
  getClassesByTeacherId(teacherId: number): Promise<Class[]>;
  getStudentsByClassId(classId: number): Promise<Student[]>;
  
  getAttendanceByClassId(classId: number, date?: string): Promise<Attendance[]>;
  markAttendance(attendance: Omit<Attendance, 'id'>): Promise<Attendance>;
  
  getNotificationsByUserId(userId: number): Promise<Notification[]>;
  markNotificationAsRead(id: number): Promise<Notification>;

  sessionStore: any;
}

export class MongoStorage implements IStorage {
  sessionStore: any;

  constructor() {
    this.sessionStore = connectMongo.create({
      mongoUrl: process.env.MONGODB_URI || 'mongodb://localhost:27017/attendance_app',
      collectionName: 'sessions',
      ttl: 86400 // 1 day
    });
  }

  async getUser(id: number): Promise<SelectUser | undefined> {
    const user = await UserModel.findOne({ id }).lean();
    if (!user) return undefined;
    
    const { password, ...userWithoutPassword } = user as User;
    return userWithoutPassword as SelectUser;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const user = await UserModel.findOne({ username }).lean();
    return user as User | undefined;
  }

  async createUser(user: InsertUser): Promise<SelectUser> {
    const id = await getNextId('User');
    
    const newUser: User = {
      ...user,
      id,
      createdAt: new Date()
    };
    
    await UserModel.create(newUser);
    
    const { password, ...userWithoutPassword } = newUser;
    return userWithoutPassword as SelectUser;
  }

  async getClassesByTeacherId(teacherId: number): Promise<Class[]> {
    const classes = await ClassModel.find({ teacherId }).lean();
    return classes as Class[];
  }

  async getStudentsByClassId(classId: number): Promise<Student[]> {
    const students = await StudentModel.find({ classId }).lean();
    return students as Student[];
  }

  async getAttendanceByClassId(classId: number, date?: string): Promise<Attendance[]> {
    const query: any = { classId };
    if (date) {
      query.date = date;
    }
    
    const attendanceRecords = await AttendanceModel.find(query).lean();
    return attendanceRecords as Attendance[];
  }

  async markAttendance(attendance: Omit<Attendance, 'id'>): Promise<Attendance> {
    const id = await getNextId('Attendance');
    
    const newAttendance: Attendance = {
      ...attendance,
      id
    };
    
    await AttendanceModel.create(newAttendance);
    return newAttendance;
  }

  async getNotificationsByUserId(userId: number): Promise<Notification[]> {
    const notifications = await NotificationModel.find({ userId }).sort({ createdAt: -1 }).lean();
    return notifications as Notification[];
  }

  async markNotificationAsRead(id: number): Promise<Notification> {
    const notification = await NotificationModel.findOneAndUpdate(
      { id },
      { read: true },
      { new: true }
    ).lean();
    
    if (!notification) {
      throw new Error("Notification not found");
    }
    
    return notification as Notification;
  }
}

// Export the MongoDB storage implementation
export const storage = new MongoStorage();
