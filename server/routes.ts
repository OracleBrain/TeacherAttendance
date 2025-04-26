import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";

export function registerRoutes(app: Express): Server {
  // Sets up authentication routes
  setupAuth(app);

  // API Routes
  // Classes
  app.get("/api/classes", async (req: Request, res: Response) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    const teacherId = req.user?.id;
    const classes = await storage.getClassesByTeacherId(teacherId);
    res.json(classes);
  });

  // Students by class
  app.get("/api/classes/:classId/students", async (req: Request, res: Response) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    const classId = parseInt(req.params.classId);
    const students = await storage.getStudentsByClassId(classId);
    res.json(students);
  });

  // Attendance
  app.get("/api/classes/:classId/attendance", async (req: Request, res: Response) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    const classId = parseInt(req.params.classId);
    const date = req.query.date as string | undefined;
    const attendance = await storage.getAttendanceByClassId(classId, date);
    res.json(attendance);
  });

  app.post("/api/attendance", async (req: Request, res: Response) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    const { studentId, classId, date, status } = req.body;
    const teacherId = req.user?.id;
    
    const newAttendance = await storage.markAttendance({
      studentId,
      classId,
      date,
      status,
      teacherId
    });
    
    res.status(201).json(newAttendance);
  });

  // Notifications
  app.get("/api/notifications", async (req: Request, res: Response) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    const userId = req.user?.id;
    const notifications = await storage.getNotificationsByUserId(userId);
    res.json(notifications);
  });

  app.put("/api/notifications/:id/read", async (req: Request, res: Response) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    const id = parseInt(req.params.id);
    const notification = await storage.markNotificationAsRead(id);
    res.json(notification);
  });

  const httpServer = createServer(app);

  return httpServer;
}
