import session from "express-session";
import createMemoryStore from "memorystore";
import { User, InsertUser, SelectUser, Class, Student, Attendance, Notification } from "../shared/schema";

const MemoryStore = createMemoryStore(session);

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

  sessionStore: session.SessionStore;
}

export class MemStorage implements IStorage {
  private users: User[] = [];
  private classes: Class[] = [];
  private students: Student[] = [];
  private attendance: Attendance[] = [];
  private notifications: Notification[] = [];
  sessionStore: session.SessionStore;

  constructor() {
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000,
    });
  }

  async getUser(id: number): Promise<SelectUser | undefined> {
    const user = this.users.find(u => u.id === id);
    if (!user) return undefined;
    
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword as SelectUser;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return this.users.find(u => u.username === username);
  }

  async createUser(user: InsertUser): Promise<SelectUser> {
    const newUser: User = {
      ...user,
      id: this.users.length + 1,
      createdAt: new Date()
    };
    
    this.users.push(newUser);
    
    const { password, ...userWithoutPassword } = newUser;
    return userWithoutPassword as SelectUser;
  }

  async getClassesByTeacherId(teacherId: number): Promise<Class[]> {
    return this.classes.filter(c => c.teacherId === teacherId);
  }

  async getStudentsByClassId(classId: number): Promise<Student[]> {
    return this.students.filter(s => s.classId === classId);
  }

  async getAttendanceByClassId(classId: number, date?: string): Promise<Attendance[]> {
    let results = this.attendance.filter(a => a.classId === classId);
    if (date) {
      results = results.filter(a => a.date === date);
    }
    return results;
  }

  async markAttendance(attendance: Omit<Attendance, 'id'>): Promise<Attendance> {
    const newAttendance: Attendance = {
      ...attendance,
      id: this.attendance.length + 1
    };
    
    this.attendance.push(newAttendance);
    return newAttendance;
  }

  async getNotificationsByUserId(userId: number): Promise<Notification[]> {
    return this.notifications.filter(n => n.userId === userId);
  }

  async markNotificationAsRead(id: number): Promise<Notification> {
    const notification = this.notifications.find(n => n.id === id);
    if (!notification) {
      throw new Error("Notification not found");
    }
    
    notification.read = true;
    return notification;
  }
}

export const storage = new MemStorage();
