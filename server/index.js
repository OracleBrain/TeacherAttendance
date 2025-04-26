const express = require("express");
const cors = require("cors");
const session = require("express-session");
const passport = require("passport");
const { Strategy: LocalStrategy } = require("passport-local");
const crypto = require("crypto");
const util = require("util");
const MemoryStore = require("memorystore")(session);

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(cors({
  origin: ["http://localhost:5000", "http://0.0.0.0:5000", "http://127.0.0.1:5000", "https://0.0.0.0:5000"],
  credentials: true
}));
app.use(express.json());

// In-memory storage
const storage = {
  users: [],
  classes: [
    { id: 1, name: "Class 10", section: "A", subject: "Mathematics", teacherId: 1 },
    { id: 2, name: "Class 9", section: "B", subject: "Science", teacherId: 1 },
    { id: 3, name: "Class 8", section: "C", subject: "English", teacherId: 1 }
  ],
  students: [
    { id: 1, name: "John Doe", rollNumber: "10A01", classId: 1 },
    { id: 2, name: "Jane Smith", rollNumber: "10A02", classId: 1 },
    { id: 3, name: "Bob Johnson", rollNumber: "10A03", classId: 1 },
    { id: 4, name: "Alice Brown", rollNumber: "9B01", classId: 2 },
    { id: 5, name: "Charlie Davis", rollNumber: "9B02", classId: 2 },
    { id: 6, name: "Eva Wilson", rollNumber: "8C01", classId: 3 }
  ],
  attendance: [],
  notifications: [
    { 
      id: 1, 
      userId: 1, 
      title: "Welcome to the Attendance App", 
      message: "Thank you for joining our attendance management system.", 
      read: false, 
      createdAt: new Date() 
    }
  ],
  sessionStore: new MemoryStore({
    checkPeriod: 86400000
  }),
  
  // User methods
  getUser: async function(id) {
    const user = this.users.find(u => u.id === id);
    if (!user) return undefined;
    
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  },
  
  getUserByUsername: async function(username) {
    return this.users.find(u => u.username === username);
  },
  
  createUser: async function(user) {
    const newUser = {
      ...user,
      id: this.users.length + 1,
      createdAt: new Date()
    };
    
    this.users.push(newUser);
    
    const { password, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  },
  
  // Class methods
  getClassesByTeacherId: async function(teacherId) {
    return this.classes.filter(c => c.teacherId === teacherId);
  },
  
  // Student methods
  getStudentsByClassId: async function(classId) {
    return this.students.filter(s => s.classId === classId);
  },
  
  // Attendance methods
  getAttendanceByClassId: async function(classId, date) {
    let results = this.attendance.filter(a => a.classId === classId);
    if (date) {
      results = results.filter(a => a.date === date);
    }
    return results;
  },
  
  markAttendance: async function(attendance) {
    const newAttendance = {
      ...attendance,
      id: this.attendance.length + 1
    };
    
    this.attendance.push(newAttendance);
    return newAttendance;
  },
  
  // Notification methods
  getNotificationsByUserId: async function(userId) {
    return this.notifications.filter(n => n.userId === userId);
  },
  
  markNotificationAsRead: async function(id) {
    const notification = this.notifications.find(n => n.id === id);
    if (!notification) {
      throw new Error("Notification not found");
    }
    
    notification.read = true;
    return notification;
  }
};

// Authentication setup
const scryptAsync = util.promisify(crypto.scrypt);

async function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64));
  return `${buf.toString("hex")}.${salt}`;
}

async function comparePasswords(supplied, stored) {
  const [hashed, salt] = stored.split(".");
  const hashedBuf = Buffer.from(hashed, "hex");
  const suppliedBuf = (await scryptAsync(supplied, salt, 64));
  return crypto.timingSafeEqual(hashedBuf, suppliedBuf);
}

// Session configuration
const sessionSettings = {
  secret: process.env.SESSION_SECRET || "attendance-app-super-secret",
  resave: false,
  saveUninitialized: false,
  store: storage.sessionStore,
};

app.set("trust proxy", 1);
app.use(session(sessionSettings));
app.use(passport.initialize());
app.use(passport.session());

// Passport configuration
passport.use(
  new LocalStrategy(async (username, password, done) => {
    const user = await storage.getUserByUsername(username);
    if (!user || !(await comparePasswords(password, user.password))) {
      return done(null, false);
    } else {
      return done(null, user);
    }
  }),
);

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  const user = await storage.getUser(id);
  done(null, user);
});

// Auth routes
app.post("/api/register", async (req, res, next) => {
  const existingUser = await storage.getUserByUsername(req.body.username);
  if (existingUser) {
    return res.status(400).send("Username already exists");
  }

  const user = await storage.createUser({
    ...req.body,
    password: await hashPassword(req.body.password),
  });

  req.login(user, (err) => {
    if (err) return next(err);
    res.status(201).json(user);
  });
});

app.post("/api/login", passport.authenticate("local"), (req, res) => {
  res.status(200).json(req.user);
});

app.post("/api/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    res.sendStatus(200);
  });
});

app.get("/api/user", (req, res) => {
  if (!req.isAuthenticated()) return res.sendStatus(401);
  res.json(req.user);
});

// API Routes
// Classes
app.get("/api/classes", async (req, res) => {
  if (!req.isAuthenticated()) return res.sendStatus(401);
  
  const teacherId = req.user?.id;
  const classes = await storage.getClassesByTeacherId(teacherId);
  res.json(classes);
});

// Students by class
app.get("/api/classes/:classId/students", async (req, res) => {
  if (!req.isAuthenticated()) return res.sendStatus(401);
  
  const classId = parseInt(req.params.classId);
  const students = await storage.getStudentsByClassId(classId);
  res.json(students);
});

// Attendance
app.get("/api/classes/:classId/attendance", async (req, res) => {
  if (!req.isAuthenticated()) return res.sendStatus(401);
  
  const classId = parseInt(req.params.classId);
  const date = req.query.date;
  const attendance = await storage.getAttendanceByClassId(classId, date);
  res.json(attendance);
});

app.post("/api/attendance", async (req, res) => {
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
app.get("/api/notifications", async (req, res) => {
  if (!req.isAuthenticated()) return res.sendStatus(401);
  
  const userId = req.user?.id;
  const notifications = await storage.getNotificationsByUserId(userId);
  res.json(notifications);
});

app.put("/api/notifications/:id/read", async (req, res) => {
  if (!req.isAuthenticated()) return res.sendStatus(401);
  
  const id = parseInt(req.params.id);
  const notification = await storage.markNotificationAsRead(id);
  res.json(notification);
});

// Start the server
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});